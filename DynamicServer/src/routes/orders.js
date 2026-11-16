// Customer order endpoints. All require a logged-in customer.
//   POST /api/orders                 place order(s) from the cart (one order per date)
//   GET  /api/orders                 my orders, newest first
//   GET  /api/orders/:id             one of my orders, with status history
//   POST /api/orders/:id/cancel      { reason }  while placed / confirmed
//   POST /api/orders/:id/dispute     { reason }  within 48h of delivery / pickup
const express = require('express');
const { ROLES, requireAuth, requireRole } = require('../auth');
const orders = require('../orders');

const router = express.Router();

router.use(requireAuth, requireRole(ROLES.CUSTOMER));

router.post('/', async (req, res) => {
  try {
    const ids = await orders.createOrders(req.user, req.body);
    const created = await orders.findOrders({
      where: 'o.id IN (?)',
      params: [ids],
      orderBy: 'o.scheduled_date, o.id',
      viewerRole: 'customer',
    });
    res.status(201).json({ orders: created });
  } catch (err) {
    if (!orders.sendOrderError(err, res)) throw err;
  }
});

router.get('/', async (req, res) => {
  res.json(
    await orders.findOrders({
      where: 'o.user_id = ?',
      params: [req.user.id],
      withHistory: true,
      viewerRole: 'customer',
    })
  );
});

router.get('/:id', async (req, res) => {
  const [order] = await orders.findOrders({
    where: 'o.id = ? AND o.user_id = ?',
    params: [Number(req.params.id), req.user.id],
    withHistory: true,
    viewerRole: 'customer',
  });
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  res.json(order);
});

async function customerAction(req, res, nextStatus) {
  try {
    await orders.changeStatus(Number(req.params.id), nextStatus, req.body?.reason, {
      id: req.user.id,
      role: 'customer',
    });
    const [order] = await orders.findOrders({
      where: 'o.id = ?',
      params: [Number(req.params.id)],
      withHistory: true,
      viewerRole: 'customer',
    });
    res.json(order);
  } catch (err) {
    if (!orders.sendOrderError(err, res)) throw err;
  }
}

router.post('/:id/cancel', (req, res) => customerAction(req, res, 'cancelled'));
router.post('/:id/dispute', (req, res) => customerAction(req, res, 'disputed'));

module.exports = router;
