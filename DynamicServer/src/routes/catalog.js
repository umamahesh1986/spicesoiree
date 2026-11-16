// Read-only public endpoints that feed the React client.
//
// Performance: the database is remote (one network round trip per query), so
// each endpoint runs its queries in parallel and the result is cached in memory.
// Admin catalog edits clear the cache, so changes still show up immediately.
const express = require('express');
const { pool } = require('../db');
const { cached } = require('../cache');

const router = express.Router();

const rows = (sql, params) => pool.query(sql, params).then(([result]) => result);

// Turns price rows into { [size_label]: price } on each item, preserving sort order.
function attachPrices(items, priceRows, foreignKey) {
  const byItem = new Map(items.map((item) => [item.id, item]));
  for (const item of items) item.prices = {};
  for (const row of priceRows) {
    const item = byItem.get(row[foreignKey]);
    if (item) item.prices[row.size_label] = row.price;
  }
  return items;
}

// Sends a cached JSON response; `load` builds the payload on a cache miss.
function cachedJson(keyFor, load) {
  return async (req, res) => {
    res.json(await cached(keyFor(req), () => load(req)));
  };
}

// GET /api/settings -> { whatsapp_number: '...', ... }
router.get('/settings', cachedJson(() => 'settings', async () => {
  const settings = await rows('SELECT setting_key, setting_value FROM settings');
  return Object.fromEntries(settings.map((r) => [r.setting_key, r.setting_value]));
}));

// GET /api/menu -> { categories, items }
router.get('/menu', cachedJson(() => 'menu', async () => {
  const [categories, items, prices] = await Promise.all([
    rows('SELECT id, name, icon, page_heading AS pageHeading FROM menu_categories ORDER BY sort_order, id'),
    rows(
      `SELECT i.id, c.name AS category, i.main_heading AS mainHeading, i.section, i.name,
              i.description, i.image, i.is_bestseller = 1 AS bestseller, i.in_stock = 1 AS inStock
         FROM menu_items i
         JOIN menu_categories c ON c.id = i.category_id
        WHERE i.is_active = 1
        ORDER BY i.sort_order, i.id`
    ),
    rows('SELECT menu_item_id, size_label, price FROM menu_item_prices ORDER BY menu_item_id, sort_order, id'),
  ]);
  items.forEach((item) => {
    item.bestseller = Boolean(item.bestseller);
    item.inStock = Boolean(item.inStock);
  });
  return { categories, items: attachPrices(items, prices, 'menu_item_id') };
}));

// GET /api/preorder -> { categories, items }
router.get('/preorder', cachedJson(() => 'preorder', async () => {
  const [categories, items, prices] = await Promise.all([
    rows('SELECT id, name, icon, curry_type AS curryType FROM preorder_categories ORDER BY sort_order, id'),
    rows(
      `SELECT i.id, c.name AS category, c.curry_type AS curryType, i.name, i.description, i.image,
              i.in_stock = 1 AS inStock
         FROM preorder_items i
         JOIN preorder_categories c ON c.id = i.category_id
        WHERE i.is_active = 1
        ORDER BY i.sort_order, i.id`
    ),
    rows('SELECT preorder_item_id, size_label, price FROM preorder_item_prices ORDER BY preorder_item_id, sort_order, id'),
  ]);
  items.forEach((item) => { item.inStock = Boolean(item.inStock); });
  return { categories, items: attachPrices(items, prices, 'preorder_item_id') };
}));

// GET /api/fresh-meat -> { categories, products, cuttingStyles }
router.get('/fresh-meat', cachedJson(() => 'fresh-meat', async () => {
  const [categories, products, cuts, cuttingStyles] = await Promise.all([
    rows('SELECT id, name, icon FROM meat_categories ORDER BY sort_order, id'),
    rows(
      `SELECT p.id, c.name AS category, p.name, p.subtitle, p.price, p.display_price AS displayPrice,
              p.unit, p.image, p.cutting_allowed = 1 AS cuttingAllowed, p.in_stock = 1 AS inStock
         FROM meat_products p
         JOIN meat_categories c ON c.id = p.category_id
        WHERE p.is_active = 1
        ORDER BY p.sort_order, p.id`
    ),
    rows('SELECT meat_product_id, name FROM meat_product_cuts ORDER BY meat_product_id, sort_order, id'),
    rows('SELECT id, name, subtitle, image FROM cutting_styles ORDER BY sort_order, id'),
  ]);
  for (const p of products) {
    p.cuttingAllowed = Boolean(p.cuttingAllowed);
    p.inStock = Boolean(p.inStock);
    p.cuttingOptions = cuts.filter((c) => c.meat_product_id === p.id).map((c) => c.name);
  }
  return { categories, products, cuttingStyles };
}));

// GET /api/delivery-slots -> ['12:00 – 1:00 PM', ...]
router.get('/delivery-slots', cachedJson(() => 'delivery-slots', async () => {
  const slots = await rows('SELECT label FROM delivery_slots WHERE is_active = 1 ORDER BY sort_order, id');
  return slots.map((r) => r.label);
}));

// GET /api/special-menu -> [{ category, image, items: [...] }]
router.get('/special-menu', cachedJson(() => 'special-menu', async () => {
  const [groups, items] = await Promise.all([
    rows('SELECT id, name, image FROM special_menu_groups WHERE is_active = 1 ORDER BY sort_order, id'),
    rows('SELECT group_id, name FROM special_menu_items ORDER BY group_id, sort_order, id'),
  ]);
  return groups.map((g) => ({
    category: g.name,
    image: g.image,
    items: items.filter((i) => i.group_id === g.id).map((i) => i.name),
  }));
}));

// GET /api/content/:page -> { [section]: [{ title, subtitle, description, detail, icon, image, buttonText, link }] }
router.get('/content/:page', cachedJson((req) => `content:${req.params.page}`, async (req) => {
  const content = await rows(
    `SELECT id, section, title, subtitle, description, detail, icon, image,
            button_text AS buttonText, link
       FROM content_items
      WHERE page = ? AND is_active = 1
      ORDER BY section, sort_order, id`,
    [req.params.page]
  );
  const sections = {};
  for (const { section, ...item } of content) {
    (sections[section] ||= []).push(item);
  }
  return sections;
}));

module.exports = router;
