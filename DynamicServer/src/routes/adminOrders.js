// Admin order management (mounted under /api/admin, so role = admin is enforced).
//   GET  /api/admin/orders/meta                 status list + counts per status
//   GET  /api/admin/orders?view=open|completed|closed|all&status=&date=&q=
//   GET  /api/admin/orders/:id                  full order with history
//   POST /api/admin/orders/:id/status           { status, note }
//   PATCH /api/admin/orders/:id/payment         { paymentStatus: unpaid | paid | refunded }
const express = require('express');
const { pool } = require('../db');
const orders = require('../orders');
const orderStatus = require('../orderStatus');

const router = express.Router();

const VIEWS = {
  open: { statuses: orderStatus.OPEN_STATUSES, orderBy: 'o.scheduled_date, o.time_slot, o.id' },
  completed: { statuses: orderStatus.COMPLETED_STATUSES, orderBy: 'o.completed_at DESC, o.id DESC' },
  closed: { statuses: ['cancelled', 'resolved'], orderBy: 'o.updated_at DESC, o.id DESC' },
  all: { statuses: null, orderBy: 'o.created_at DESC, o.id DESC' },
};

router.get('/meta', async (req, res) => {
  const [counts] = await pool.query('SELECT status, COUNT(*) AS count FROM orders GROUP BY status');
  const [[today]] = await pool.query(
    'SELECT COUNT(*) AS count FROM orders WHERE scheduled_date = ? AND status <> ?',
    [orders.restaurantDate(0), 'cancelled']
  );
  res.json({
    statuses: orderStatus.statusCatalog(),
    counts: Object.fromEntries(counts.map((c) => [c.status, c.count])),
    openCount: counts
      .filter((c) => orderStatus.OPEN_STATUSES.includes(c.status))
      .reduce((sum, c) => sum + c.count, 0),
    todayCount: today.count,
    today: orders.restaurantDate(0),
  });
});

router.get('/', async (req, res) => {
  const view = VIEWS[req.query.view] || VIEWS.open;
  const where = [];
  const params = [];

  if (req.query.status && orderStatus.STATUSES[req.query.status]) {
    where.push('o.status = ?');
    params.push(req.query.status);
  } else if (view.statuses) {
    where.push('o.status IN (?)');
    params.push(view.statuses);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(req.query.date || '')) {
    where.push('o.scheduled_date = ?');
    params.push(req.query.date);
  }
  const q = String(req.query.q || '').trim();
  if (q) {
    where.push('(o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_phone LIKE ?)');
    const like = `%${q.replace(/[%_]/g, '\\$&')}%`;
    params.push(like, like, like);
  }

  res.json(
    await orders.findOrders({
      where: where.length ? where.join(' AND ') : '1=1',
      params,
      orderBy: view.orderBy,
      limit: 300,
      withHistory: true,
      viewerRole: 'admin',
    })
  );
});

async function sendOrder(res, id) {
  const [order] = await orders.findOrders({
    where: 'o.id = ?', params: [id], withHistory: true, viewerRole: 'admin',
  });
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  res.json(order);
}

router.get('/:id', (req, res) => sendOrder(res, Number(req.params.id)));

router.post('/:id/status', async (req, res) => {
  const next = String(req.body?.status || '');
  if (!orderStatus.STATUSES[next]) return res.status(400).json({ error: 'Unknown status.' });
  try {
    await orders.changeStatus(Number(req.params.id), next, req.body?.note, { id: req.user.id, role: 'admin' });
  } catch (err) {
    if (orders.sendOrderError(err, res)) return;
    throw err;
  }
  await sendOrder(res, Number(req.params.id));
});

router.patch('/:id/payment', async (req, res) => {
  const value = req.body?.paymentStatus;
  if (!['unpaid', 'paid', 'refunded'].includes(value)) {
    return res.status(400).json({ error: 'paymentStatus must be unpaid, paid or refunded.' });
  }
  const id = Number(req.params.id);
  const [[order]] = await pool.query('SELECT status, payment_status FROM orders WHERE id = ?', [id]);
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  if (order.payment_status !== value) {
    await pool.query('UPDATE orders SET payment_status = ? WHERE id = ?', [value, id]);
    // Logged in the history (status unchanged) so payment changes are auditable
    await pool.query('INSERT INTO order_status_history SET ?', {
      order_id: id,
      from_status: order.status,
      to_status: order.status,
      note: `Payment marked as ${value}`,
      changed_by_id: req.user.id,
      changed_by_role: 'admin',
    });
  }
  await sendOrder(res, id);
});

module.exports = router;
