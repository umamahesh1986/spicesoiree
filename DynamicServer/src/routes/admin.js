// Admin-only endpoints. Every route here requires a valid token with role = admin.
const express = require('express');
const { pool } = require('../db');
const { ROLES, requireAuth, requireRole } = require('../auth');
const catalogRoutes = require('./adminCatalog');
const adminOrderRoutes = require('./adminOrders');
const adminUploadRoutes = require('./adminUploads');
const { OPEN_STATUSES } = require('../orderStatus');
const { restaurantDate } = require('../orders');

const router = express.Router();

router.use(requireAuth, requireRole(ROLES.ADMIN));

// Add / edit / hide / out-of-stock for menu, pre-order and fresh meat items
router.use('/catalog', catalogRoutes);

// Order management (status changes, payment)
router.use('/orders', adminOrderRoutes);

// Image uploads for items (stored in UPLOAD_DIR, served at /uploads)
router.use('/uploads', adminUploadRoutes);

// GET /api/admin/summary -> counts for the dashboard
router.get('/summary', async (req, res) => {
  const [[counts]] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM users WHERE role = 'customer')                  AS customers,
      (SELECT COUNT(*) FROM users WHERE role = 'customer' AND is_active = 0) AS blockedCustomers,
      (SELECT COUNT(*) FROM menu_items WHERE is_active = 1)                 AS menuItems,
      (SELECT COUNT(*) FROM preorder_items WHERE is_active = 1)             AS preorderItems,
      (SELECT COUNT(*) FROM meat_products WHERE is_active = 1)              AS meatProducts,
      (SELECT COUNT(*) FROM orders WHERE status IN (?))                      AS openOrders,
      (SELECT COUNT(*) FROM orders WHERE status = 'placed')                  AS newOrders,
      (SELECT COUNT(*) FROM orders WHERE status = 'disputed')                AS disputedOrders,
      (SELECT COUNT(*) FROM orders WHERE scheduled_date = ? AND status <> 'cancelled') AS todayOrders
  `, [OPEN_STATUSES, restaurantDate(0)]);
  res.json(counts);
});

// GET /api/admin/customers -> customer accounts, newest first
router.get('/customers', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, name, email, phone, is_active = 1 AS isActive,
            created_at AS createdAt, last_login_at AS lastLoginAt
       FROM users
      WHERE role = 'customer'
      ORDER BY created_at DESC, id DESC`
  );
  rows.forEach((r) => { r.isActive = Boolean(r.isActive); });
  res.json(rows);
});

// PATCH /api/admin/customers/:id { isActive } -> block / unblock a customer.
// Blocking also bumps token_version so the customer is signed out immediately.
router.patch('/customers/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || typeof req.body?.isActive !== 'boolean') {
    return res.status(400).json({ error: 'Expected { isActive: true | false }.' });
  }
  const [result] = await pool.query(
    `UPDATE users
        SET is_active = ?, token_version = token_version + IF(? = 0, 1, 0)
      WHERE id = ? AND role = 'customer'`,
    [req.body.isActive ? 1 : 0, req.body.isActive ? 1 : 0, id]
  );
  if (!result.affectedRows) return res.status(404).json({ error: 'Customer not found.' });
  res.json({ ok: true });
});

module.exports = router;
