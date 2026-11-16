// Admin item management for the three catalogs:
//   menu      -> menu_items      (+ menu_item_prices)
//   preorder  -> preorder_items  (+ preorder_item_prices)
//   meat      -> meat_products   (+ meat_product_cuts)
//
//   GET    /api/admin/catalog/:type            all items incl. hidden + categories
//   POST   /api/admin/catalog/:type            create item
//   PUT    /api/admin/catalog/:type/:id        update item (full replace of fields, prices/cuts)
//   PATCH  /api/admin/catalog/:type/:id        { isActive?, inStock? }  show/hide, stock
//
// Mounted under the admin router, so every route already requires role = admin.
const express = require('express');
const { pool } = require('../db');
const { clearCache } = require('../cache');

const router = express.Router();

// Any successful change must be visible on the website straight away:
// clear the public catalog cache (see src/cache.js).
router.use((req, res, next) => {
  if (req.method !== 'GET') {
    res.on('finish', () => {
      if (res.statusCode < 400) clearCache();
    });
  }
  next();
});

// Per-type configuration. fields: [apiName, column, kind, options]
const TYPES = {
  menu: {
    table: 'menu_items',
    categoryTable: 'menu_categories',
    prices: { table: 'menu_item_prices', fk: 'menu_item_id' },
    fields: [
      ['mainHeading', 'main_heading', 'string', { max: 150 }],
      ['section', 'section', 'string', { max: 150 }],
      ['name', 'name', 'string', { max: 150, required: true }],
      ['description', 'description', 'string', { max: 500 }],
      ['image', 'image', 'string', { max: 500 }],
      ['isBestseller', 'is_bestseller', 'bool'],
    ],
  },
  preorder: {
    table: 'preorder_items',
    categoryTable: 'preorder_categories',
    prices: { table: 'preorder_item_prices', fk: 'preorder_item_id' },
    fields: [
      ['name', 'name', 'string', { max: 150, required: true }],
      ['description', 'description', 'string', { max: 500 }],
      ['image', 'image', 'string', { max: 500 }],
    ],
  },
  meat: {
    table: 'meat_products',
    categoryTable: 'meat_categories',
    cuts: { table: 'meat_product_cuts', fk: 'meat_product_id' },
    fields: [
      ['name', 'name', 'string', { max: 150, required: true }],
      ['subtitle', 'subtitle', 'string', { max: 150 }],
      ['price', 'price', 'money', { required: true }],
      ['displayPrice', 'display_price', 'string', { max: 100 }],
      ['unit', 'unit', 'string', { max: 20, required: true }],
      ['image', 'image', 'string', { max: 500 }],
      ['cuttingAllowed', 'cutting_allowed', 'bool'],
    ],
  },
};

// Fields every item type has
// keep: if omitted, the column is left alone (DB default on create, current value on update)
const COMMON_FIELDS = [
  ['isActive', 'is_active', 'bool', { keep: true }],
  ['inStock', 'in_stock', 'bool', { keep: true }],
  ['sortOrder', 'sort_order', 'int', { keep: true }],
];

class ValidationError extends Error {}

function getType(req, res) {
  const config = TYPES[req.params.type];
  if (!config) res.status(404).json({ error: 'Unknown catalog type.' });
  return config;
}

function parseField(body, [apiName, , kind, opts = {}]) {
  const raw = body[apiName];
  if (raw === undefined || raw === null || raw === '') {
    if (opts.required) throw new ValidationError(`${apiName} is required.`);
    if (opts.keep) return undefined;
    return kind === 'string' ? '' : kind === 'bool' ? false : undefined;
  }
  switch (kind) {
    case 'string': {
      const value = String(raw).trim();
      if (opts.required && !value) throw new ValidationError(`${apiName} is required.`);
      if (value.length > opts.max) throw new ValidationError(`${apiName} must be at most ${opts.max} characters.`);
      return value;
    }
    case 'bool':
      return raw === true || raw === 1 || raw === '1' || raw === 'true' ? 1 : 0;
    case 'money': {
      const value = Number(raw);
      if (!Number.isFinite(value) || value < 0 || value > 9999999) {
        throw new ValidationError(`${apiName} must be a valid amount.`);
      }
      return Math.round(value * 100) / 100;
    }
    case 'int': {
      const value = Number(raw);
      if (!Number.isInteger(value)) throw new ValidationError(`${apiName} must be a whole number.`);
      return value;
    }
    default:
      throw new Error(`Unknown field kind ${kind}`);
  }
}

function parsePrices(body) {
  if (!Array.isArray(body.prices) || body.prices.length === 0) {
    throw new ValidationError('Add at least one size and price.');
  }
  const seen = new Set();
  return body.prices.map((row) => {
    const size = String(row?.size || '').trim();
    const price = Number(row?.price);
    if (!size || size.length > 50) throw new ValidationError('Each price needs a size label (max 50 characters).');
    if (seen.has(size.toLowerCase())) throw new ValidationError(`Size "${size}" is listed twice.`);
    if (!Number.isFinite(price) || price < 0) throw new ValidationError(`Price for "${size}" must be a valid amount.`);
    seen.add(size.toLowerCase());
    return { size, price: Math.round(price * 100) / 100 };
  });
}

function parseCuts(body, cuttingAllowed) {
  if (!cuttingAllowed) return [];
  const cuts = (Array.isArray(body.cuts) ? body.cuts : [])
    .map((c) => String(c || '').trim())
    .filter(Boolean);
  if (!cuts.length) throw new ValidationError('Add at least one cutting option, or turn off cutting.');
  if (cuts.some((c) => c.length > 100)) throw new ValidationError('Cutting options must be at most 100 characters.');
  return [...new Set(cuts)];
}

// Builds the column -> value map for INSERT/UPDATE from the request body.
async function parseItem(conn, config, body) {
  const row = {};
  for (const field of [...config.fields, ...COMMON_FIELDS]) {
    const value = parseField(body, field);
    if (value !== undefined) row[field[1]] = value;
  }

  const categoryId = Number(body.categoryId);
  const [cats] = await conn.query(`SELECT id FROM ${config.categoryTable} WHERE id = ?`, [categoryId]);
  if (!cats.length) throw new ValidationError('Please choose a valid category.');
  row.category_id = categoryId;

  const prices = config.prices ? parsePrices(body) : null;
  const cuts = config.cuts ? parseCuts(body, row.cutting_allowed) : null;
  return { row, prices, cuts };
}

async function writeChildren(conn, config, itemId, prices, cuts) {
  if (config.prices) {
    await conn.query(`DELETE FROM ${config.prices.table} WHERE ${config.prices.fk} = ?`, [itemId]);
    for (const [i, p] of prices.entries()) {
      await conn.query(
        `INSERT INTO ${config.prices.table} (${config.prices.fk}, size_label, price, sort_order) VALUES (?, ?, ?, ?)`,
        [itemId, p.size, p.price, i + 1]
      );
    }
  }
  if (config.cuts) {
    await conn.query(`DELETE FROM ${config.cuts.table} WHERE ${config.cuts.fk} = ?`, [itemId]);
    for (const [i, name] of cuts.entries()) {
      await conn.query(
        `INSERT INTO ${config.cuts.table} (${config.cuts.fk}, name, sort_order) VALUES (?, ?, ?)`,
        [itemId, name, i + 1]
      );
    }
  }
}

async function loadItems(config, id) {
  const where = id ? 'WHERE i.id = ?' : '';
  const columns = [...config.fields, ...COMMON_FIELDS]
    .map(([api, col]) => `i.${col} AS ${api}`)
    .join(', ');
  const [items] = await pool.query(
    `SELECT i.id, i.category_id AS categoryId, c.name AS category, ${columns}
       FROM ${config.table} i
       JOIN ${config.categoryTable} c ON c.id = i.category_id
       ${where}
      ORDER BY i.sort_order, i.id`,
    id ? [id] : []
  );
  const boolFields = [...config.fields, ...COMMON_FIELDS].filter((f) => f[2] === 'bool').map((f) => f[0]);
  for (const item of items) {
    for (const f of boolFields) item[f] = Boolean(item[f]);
  }

  const ids = items.map((i) => i.id);
  if (ids.length && config.prices) {
    const [rows] = await pool.query(
      `SELECT ${config.prices.fk} AS itemId, size_label AS size, price
         FROM ${config.prices.table} WHERE ${config.prices.fk} IN (?) ORDER BY sort_order, id`,
      [ids]
    );
    for (const item of items) item.prices = rows.filter((r) => r.itemId === item.id).map(({ size, price }) => ({ size, price }));
  }
  if (ids.length && config.cuts) {
    const [rows] = await pool.query(
      `SELECT ${config.cuts.fk} AS itemId, name FROM ${config.cuts.table} WHERE ${config.cuts.fk} IN (?) ORDER BY sort_order, id`,
      [ids]
    );
    for (const item of items) item.cuts = rows.filter((r) => r.itemId === item.id).map((r) => r.name);
  }
  return items;
}

async function inTransaction(work) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await work(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

function handleValidation(err, res) {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
    return true;
  }
  return false;
}

// GET /api/admin/catalog/:type
router.get('/:type', async (req, res) => {
  const config = getType(req, res);
  if (!config) return;
  const [categories] = await pool.query(
    `SELECT id, name FROM ${config.categoryTable} ORDER BY sort_order, id`
  );
  res.json({ categories, items: await loadItems(config) });
});

// POST /api/admin/catalog/:type
router.post('/:type', async (req, res) => {
  const config = getType(req, res);
  if (!config) return;
  try {
    const id = await inTransaction(async (conn) => {
      const { row, prices, cuts } = await parseItem(conn, config, req.body || {});
      if (row.sort_order === undefined) {
        const [[{ next }]] = await conn.query(`SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM ${config.table}`);
        row.sort_order = next;
      }
      const [result] = await conn.query(`INSERT INTO ${config.table} SET ?`, row);
      await writeChildren(conn, config, result.insertId, prices, cuts);
      return result.insertId;
    });
    const [item] = await loadItems(config, id);
    res.status(201).json(item);
  } catch (err) {
    if (!handleValidation(err, res)) throw err;
  }
});

// PUT /api/admin/catalog/:type/:id
router.put('/:type/:id', async (req, res) => {
  const config = getType(req, res);
  if (!config) return;
  const id = Number(req.params.id);
  try {
    const found = await inTransaction(async (conn) => {
      const [existing] = await conn.query(`SELECT id FROM ${config.table} WHERE id = ? FOR UPDATE`, [id]);
      if (!existing.length) return false;
      const { row, prices, cuts } = await parseItem(conn, config, req.body || {});
      await conn.query(`UPDATE ${config.table} SET ? WHERE id = ?`, [row, id]);
      await writeChildren(conn, config, id, prices, cuts);
      return true;
    });
    if (!found) return res.status(404).json({ error: 'Item not found.' });
    const [item] = await loadItems(config, id);
    res.json(item);
  } catch (err) {
    if (!handleValidation(err, res)) throw err;
  }
});

// PATCH /api/admin/catalog/:type/:id { isActive?, inStock? }
router.patch('/:type/:id', async (req, res) => {
  const config = getType(req, res);
  if (!config) return;
  const changes = {};
  if (typeof req.body?.isActive === 'boolean') changes.is_active = req.body.isActive ? 1 : 0;
  if (typeof req.body?.inStock === 'boolean') changes.in_stock = req.body.inStock ? 1 : 0;
  if (!Object.keys(changes).length) {
    return res.status(400).json({ error: 'Expected { isActive } and/or { inStock } as true/false.' });
  }
  const [result] = await pool.query(`UPDATE ${config.table} SET ? WHERE id = ?`, [changes, Number(req.params.id)]);
  if (!result.affectedRows) return res.status(404).json({ error: 'Item not found.' });
  const [item] = await loadItems(config, Number(req.params.id));
  res.json(item);
});

module.exports = router;
