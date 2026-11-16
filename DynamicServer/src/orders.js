// Order service: creation (with server-side pricing), loading and status changes.
// Used by both the customer routes (routes/orders.js) and admin routes (routes/adminOrders.js).
const { pool } = require('./db');
const status = require('./orderStatus');
const { normalizePhone } = require('./validation');

const TIME_ZONE = 'Asia/Kolkata';
const BOOKING_DAYS_AHEAD = 3; // the booking page offers today + 3 days
const MAX_LINES = 50;
const MAX_QUANTITY = 99;

class OrderError extends Error {
  constructor(message, httpStatus = 400) {
    super(message);
    this.httpStatus = httpStatus;
  }
}

// ---------------------------------------------------------------------------
// Time helpers (restaurant runs on India time regardless of server location)
// ---------------------------------------------------------------------------
function restaurantDate(offsetDays = 0) {
  const date = new Date(Date.now() + offsetDays * 86400000);
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(date); // YYYY-MM-DD
}

function restaurantMinutesNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  return get('hour') * 60 + get('minute');
}

// "12:00 – 1:00 PM" -> minutes of the END time (13:00 -> 780). null if unparseable.
function slotEndMinutes(label) {
  const match = /(\d{1,2}):(\d{2})\s*(AM|PM)\s*$/i.exec(label);
  if (!match) return null;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hours += 12;
  return hours * 60 + Number(match[2]);
}

// ---------------------------------------------------------------------------
// Pricing: never trust prices from the browser
// ---------------------------------------------------------------------------
async function priceLine(conn, line) {
  const itemType = line?.itemType;
  const itemId = Number(line?.itemId);
  const quantity = Number(line?.quantity);
  const size = String(line?.size || '').trim();
  const cuttingOption = String(line?.cuttingOption || '').trim();

  if (!['menu', 'preorder', 'meat'].includes(itemType) || !Number.isInteger(itemId)) {
    throw new OrderError('Some items in your cart are out of date. Please remove them and add them again.');
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    throw new OrderError(`Quantity must be between 1 and ${MAX_QUANTITY}.`);
  }

  let row;
  if (itemType === 'meat') {
    const [rows] = await conn.query(
      'SELECT id, name, price, unit, cutting_allowed, is_active, in_stock FROM meat_products WHERE id = ?',
      [itemId]
    );
    row = rows[0];
    if (row && row.cutting_allowed) {
      const [cuts] = await conn.query(
        'SELECT 1 FROM meat_product_cuts WHERE meat_product_id = ? AND name = ?',
        [itemId, cuttingOption]
      );
      if (!cuts.length) throw new OrderError(`Please choose a valid cutting option for ${row.name}.`);
    }
  } else {
    const table = itemType === 'menu' ? 'menu_items' : 'preorder_items';
    const priceTable = itemType === 'menu' ? 'menu_item_prices' : 'preorder_item_prices';
    const fk = itemType === 'menu' ? 'menu_item_id' : 'preorder_item_id';
    const [rows] = await conn.query(
      `SELECT i.id, i.name, i.is_active, i.in_stock, p.price
         FROM ${table} i
         LEFT JOIN ${priceTable} p ON p.${fk} = i.id AND p.size_label = ?
        WHERE i.id = ?`,
      [size, itemId]
    );
    row = rows[0];
    if (row && row.price === null) {
      throw new OrderError(`"${size}" is no longer available for ${row.name}. Please re-add it to your cart.`);
    }
  }

  if (!row || !row.is_active) {
    throw new OrderError('An item in your cart is no longer on the menu. Please remove it and try again.');
  }
  if (!row.in_stock) {
    throw new OrderError(`${row.name} is currently out of stock. Please remove it from your cart.`);
  }

  const unitPrice = Number(row.price);
  return {
    item_type: itemType,
    item_id: itemId,
    name: row.name,
    size_label: itemType === 'meat' ? '' : size,
    cutting_option: itemType === 'meat' ? cuttingOption : '',
    unit: row.unit || '',
    unit_price: unitPrice,
    quantity,
    line_total: Math.round(unitPrice * quantity * 100) / 100,
  };
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------
// body: { fulfilmentType, customerName, customerPhone, deliveryAddress, dates[], timeSlot, notes, items[] }
// Returns the created orders (one per date).
async function createOrders(user, body = {}) {
  const fulfilmentType = body.fulfilmentType === 'pickup' ? 'pickup' : 'delivery';
  const customerName = String(body.customerName || '').trim();
  const customerPhone = normalizePhone(body.customerPhone);
  const deliveryAddress = String(body.deliveryAddress || '').trim();
  const notes = String(body.notes || '').trim();
  const timeSlot = String(body.timeSlot || '').trim();
  const dates = [...new Set(Array.isArray(body.dates) ? body.dates.map(String) : [])].sort();
  const items = Array.isArray(body.items) ? body.items : [];

  if (customerName.length < 2 || customerName.length > 150) throw new OrderError('Please enter your name.');
  if (!customerPhone) throw new OrderError('Please enter a valid 10-digit mobile number.');
  if (fulfilmentType === 'delivery' && (deliveryAddress.length < 5 || deliveryAddress.length > 500)) {
    throw new OrderError('Please enter your delivery address.');
  }
  if (notes.length > 500) throw new OrderError('Notes must be at most 500 characters.');
  if (!items.length) throw new OrderError('Your cart is empty.');
  if (items.length > MAX_LINES) throw new OrderError(`An order can have at most ${MAX_LINES} lines.`);

  // Dates: today .. today + BOOKING_DAYS_AHEAD (restaurant time)
  const firstDate = restaurantDate(0);
  const lastDate = restaurantDate(BOOKING_DAYS_AHEAD);
  if (!dates.length) throw new OrderError('Please choose at least one date.');
  for (const d of dates) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || d < firstDate || d > lastDate) {
      throw new OrderError('Please choose dates between today and the next 3 days.');
    }
  }

  const conn = await pool.getConnection();
  try {
    // Slot must exist and, for today, must not have ended yet
    const [slots] = await conn.query('SELECT label FROM delivery_slots WHERE is_active = 1 AND label = ?', [timeSlot]);
    if (!slots.length) throw new OrderError('Please choose a valid time slot.');
    const slotEnd = slotEndMinutes(timeSlot);
    if (dates.includes(firstDate) && slotEnd !== null && slotEnd <= restaurantMinutesNow()) {
      throw new OrderError(`The ${timeSlot} slot has already passed for today. Please pick a later slot or another date.`);
    }

    const lines = [];
    for (const line of items) lines.push(await priceLine(conn, line));
    const itemsTotal = Math.round(lines.reduce((sum, l) => sum + l.line_total, 0) * 100) / 100;
    const deliveryFee = 0; // "Zero delivery surcharge"

    await conn.beginTransaction();
    const created = [];
    for (const date of dates) {
      const [result] = await conn.query('INSERT INTO orders SET ?', {
        user_id: user.id,
        status: 'placed',
        fulfilment_type: fulfilmentType,
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: fulfilmentType === 'delivery' ? deliveryAddress : null,
        scheduled_date: date,
        time_slot: timeSlot,
        customer_notes: notes,
        items_total: itemsTotal,
        delivery_fee: deliveryFee,
        total: itemsTotal + deliveryFee,
      });
      const orderId = result.insertId;
      await conn.query("UPDATE orders SET order_number = CONCAT('SS', LPAD(id, 6, '0')) WHERE id = ?", [orderId]);
      for (const line of lines) {
        await conn.query('INSERT INTO order_items SET ?', { ...line, order_id: orderId });
      }
      await conn.query('INSERT INTO order_status_history SET ?', {
        order_id: orderId, from_status: null, to_status: 'placed',
        note: '', changed_by_id: user.id, changed_by_role: 'customer',
      });
      created.push(orderId);
    }
    await conn.commit();
    return created;
  } catch (err) {
    await conn.rollback().catch(() => {});
    throw err;
  } finally {
    conn.release();
  }
}

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------
const ORDER_COLUMNS = `
  o.id, o.order_number, o.user_id, o.status, o.fulfilment_type, o.customer_name, o.customer_phone,
  o.delivery_address, DATE_FORMAT(o.scheduled_date, '%Y-%m-%d') AS scheduled_date, o.time_slot,
  o.customer_notes, o.items_total, o.delivery_fee, o.total, o.payment_status, o.cancelled_by,
  o.cancel_reason, o.dispute_reason, o.resolution_note, o.completed_at, o.created_at, o.updated_at`;

function serialize(row, items, history, viewerRole) {
  const order = {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    statusLabel: status.statusLabel(row.status, row.fulfilment_type),
    stage: status.STATUSES[row.status]?.stage || 'open',
    fulfilmentType: row.fulfilment_type,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    deliveryAddress: row.delivery_address,
    scheduledDate: row.scheduled_date,
    timeSlot: row.time_slot,
    notes: row.customer_notes,
    itemsTotal: row.items_total,
    deliveryFee: row.delivery_fee,
    total: row.total,
    paymentStatus: row.payment_status,
    cancelledBy: row.cancelled_by,
    cancelReason: row.cancel_reason,
    disputeReason: row.dispute_reason,
    resolutionNote: row.resolution_note,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items: items.map((i) => ({
      itemType: i.item_type,
      itemId: i.item_id,
      name: i.name,
      size: i.size_label,
      cuttingOption: i.cutting_option,
      unit: i.unit,
      unitPrice: i.unit_price,
      quantity: i.quantity,
      lineTotal: i.line_total,
    })),
  };
  if (history) {
    order.history = history.map((h) => ({
      fromStatus: h.from_status,
      toStatus: h.to_status,
      label: status.statusLabel(h.to_status, row.fulfilment_type),
      note: h.note,
      by: h.changed_by_role,
      at: h.created_at,
    }));
  }
  if (viewerRole === 'admin') {
    order.allowedNext = status.nextStatuses(row.status, row.fulfilment_type).map((key) => ({
      status: key,
      label: status.statusLabel(key, row.fulfilment_type),
      noteRequired: Boolean(status.NOTE_REQUIRED[key]),
    }));
  } else {
    order.canCancel = status.customerCanCancel(row);
    order.canDispute = status.customerCanDispute(row);
  }
  return order;
}

// where: SQL fragment using alias "o"; returns serialized orders
async function findOrders({ where = '1=1', params = [], orderBy = 'o.created_at DESC, o.id DESC', limit = 200, withHistory = false, viewerRole }) {
  const [rows] = await pool.query(
    `SELECT ${ORDER_COLUMNS} FROM orders o WHERE ${where} ORDER BY ${orderBy} LIMIT ?`,
    [...params, limit]
  );
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);
  const [items] = await pool.query('SELECT * FROM order_items WHERE order_id IN (?) ORDER BY id', [ids]);
  let history = [];
  if (withHistory) {
    [history] = await pool.query(
      'SELECT * FROM order_status_history WHERE order_id IN (?) ORDER BY created_at, id',
      [ids]
    );
  }
  return rows.map((row) =>
    serialize(
      row,
      items.filter((i) => i.order_id === row.id),
      withHistory ? history.filter((h) => h.order_id === row.id) : null,
      viewerRole
    )
  );
}

// ---------------------------------------------------------------------------
// Status changes
// ---------------------------------------------------------------------------
// actor: { id, role: 'admin' | 'customer' }
async function changeStatus(orderId, nextStatus, note, actor) {
  const cleanNote = String(note || '').trim().slice(0, 1000);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[order]] = await conn.query('SELECT * FROM orders WHERE id = ? FOR UPDATE', [orderId]);
    if (!order) throw new OrderError('Order not found.', 404);

    if (actor.role === 'customer') {
      if (order.user_id !== actor.id) throw new OrderError('Order not found.', 404);
      const allowed =
        (nextStatus === 'cancelled' && status.customerCanCancel(order)) ||
        (nextStatus === 'disputed' && status.customerCanDispute(order));
      if (!allowed) {
        throw new OrderError(
          nextStatus === 'cancelled'
            ? 'This order can no longer be cancelled online because the kitchen has started on it. Please contact the restaurant.'
            : `Problems can be reported up to ${status.DISPUTE_WINDOW_HOURS} hours after delivery or pickup.`,
          409
        );
      }
    } else if (!status.canTransition(order.status, nextStatus, order.fulfilment_type)) {
      throw new OrderError(
        `Cannot change from "${status.statusLabel(order.status, order.fulfilment_type)}" to "${status.statusLabel(nextStatus, order.fulfilment_type)}".`,
        409
      );
    }

    if (status.NOTE_REQUIRED[nextStatus] && cleanNote.length < 3) {
      throw new OrderError(status.NOTE_REQUIRED[nextStatus]);
    }

    const changes = { status: nextStatus };
    if (nextStatus === 'cancelled') {
      changes.cancelled_by = actor.role;
      changes.cancel_reason = cleanNote;
    }
    if (nextStatus === 'disputed') changes.dispute_reason = cleanNote;
    if (nextStatus === 'resolved') changes.resolution_note = cleanNote;
    if (status.COMPLETED_STATUSES.includes(nextStatus)) changes.completed_at = new Date();

    await conn.query('UPDATE orders SET ? WHERE id = ?', [changes, orderId]);
    await conn.query('INSERT INTO order_status_history SET ?', {
      order_id: orderId,
      from_status: order.status,
      to_status: nextStatus,
      note: cleanNote,
      changed_by_id: actor.id,
      changed_by_role: actor.role,
    });
    await conn.commit();
  } catch (err) {
    await conn.rollback().catch(() => {});
    throw err;
  } finally {
    conn.release();
  }
}

// Express helper: turn OrderError into a JSON response
function sendOrderError(err, res) {
  if (err instanceof OrderError) {
    res.status(err.httpStatus).json({ error: err.message });
    return true;
  }
  return false;
}

module.exports = { OrderError, createOrders, findOrders, changeStatus, sendOrderError, restaurantDate };
