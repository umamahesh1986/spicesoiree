// Login / registration / profile for both admins and customers.
// Everyone logs in through the same endpoint; the returned user.role tells the
// client which screens to show. Self-registration always creates a customer.
const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db');
const { ROLES, signToken, publicUser, loadUser, requireAuth } = require('../auth');
const {
  normalizeEmail, normalizePhone, isValidEmail, passwordProblem, createThrottle,
} = require('../validation');

const router = express.Router();
const loginThrottle = createThrottle({ max: 10, windowMs: 15 * 60 * 1000 });
const registerThrottle = createThrottle({ max: 20, windowMs: 60 * 60 * 1000 });

// Used when the account does not exist, so response time doesn't reveal that.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password-1', 10);

function isDuplicate(err) {
  return err && err.code === 'ER_DUP_ENTRY';
}

// POST /api/auth/register { name, email, phone, password } -> 201 { token, user }
router.post('/register', async (req, res) => {
  if (registerThrottle.blocked(req.ip)) {
    return res.status(429).json({ error: 'Too many sign-ups from this device. Try again later.' });
  }

  const name = String(req.body?.name || '').trim();
  const email = normalizeEmail(req.body?.email);
  const phone = normalizePhone(req.body?.phone);
  const password = req.body?.password;

  if (name.length < 2 || name.length > 150) {
    return res.status(400).json({ error: 'Please enter your name.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!phone) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
  }
  const problem = passwordProblem(password);
  if (problem) return res.status(400).json({ error: problem });

  const hash = await bcrypt.hash(password, 12);
  try {
    const [result] = await pool.query(
      'INSERT INTO users (role, name, email, phone, password_hash, last_login_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [ROLES.CUSTOMER, name, email, phone, hash]
    );
    registerThrottle.fail(req.ip); // counts sign-ups per IP, not failures
    const user = await loadUser(result.insertId);
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    if (isDuplicate(err)) {
      return res.status(409).json({ error: 'An account with this email or mobile number already exists.' });
    }
    throw err;
  }
});

// POST /api/auth/login { identifier (email or mobile), password } -> { token, user }
router.post('/login', async (req, res) => {
  const identifier = String(req.body?.identifier || '').trim();
  const password = String(req.body?.password || '');
  const throttleKey = `${req.ip}|${identifier.toLowerCase()}`;

  if (loginThrottle.blocked(req.ip) || loginThrottle.blocked(throttleKey)) {
    return res.status(429).json({ error: 'Too many failed attempts. Try again in 15 minutes.' });
  }
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Enter your email or mobile number and password.' });
  }

  const phone = normalizePhone(identifier);
  const [rows] = phone
    ? await pool.query('SELECT * FROM users WHERE phone = ?', [phone])
    : await pool.query('SELECT * FROM users WHERE email = ?', [normalizeEmail(identifier)]);
  const user = rows[0];

  const valid = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);
  if (!user || !valid) {
    loginThrottle.fail(req.ip);
    loginThrottle.fail(throttleKey);
    return res.status(401).json({ error: 'Invalid email/mobile number or password.' });
  }
  if (!user.is_active) {
    return res.status(403).json({ error: 'This account has been disabled. Please contact the restaurant.' });
  }

  loginThrottle.reset(throttleKey);
  await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
  res.json({ token: signToken(user), user: publicUser(user) });
});

// GET /api/auth/me -> current user (used by the client to restore a session)
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// PUT /api/auth/me { name, phone } -> updated user
router.put('/me', requireAuth, async (req, res) => {
  const name = String(req.body?.name ?? req.user.name).trim();
  const rawPhone = req.body?.phone ?? req.user.phone;
  const phone = rawPhone ? normalizePhone(rawPhone) : null;

  if (name.length < 2 || name.length > 150) {
    return res.status(400).json({ error: 'Please enter your name.' });
  }
  if (rawPhone && !phone) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
  }
  if (req.user.role === ROLES.CUSTOMER && !phone) {
    return res.status(400).json({ error: 'A mobile number is required for customer accounts.' });
  }

  try {
    await pool.query('UPDATE users SET name = ?, phone = ? WHERE id = ?', [name, phone, req.user.id]);
  } catch (err) {
    if (isDuplicate(err)) {
      return res.status(409).json({ error: 'This mobile number is already used by another account.' });
    }
    throw err;
  }
  res.json({ user: publicUser(await loadUser(req.user.id)) });
});

// POST /api/auth/change-password { currentPassword, newPassword } -> { token, user }
// Bumps token_version, which signs out every other device.
router.post('/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  const [[row]] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);

  if (!(await bcrypt.compare(String(currentPassword || ''), row.password_hash))) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }
  const problem = passwordProblem(newPassword);
  if (problem) return res.status(400).json({ error: problem });

  const hash = await bcrypt.hash(newPassword, 12);
  await pool.query(
    'UPDATE users SET password_hash = ?, token_version = token_version + 1 WHERE id = ?',
    [hash, req.user.id]
  );
  const user = await loadUser(req.user.id);
  res.json({ token: signToken(user), user: publicUser(user) });
});

// POST /api/auth/logout-all -> invalidates every token issued for this account
router.post('/logout-all', requireAuth, async (req, res) => {
  await pool.query('UPDATE users SET token_version = token_version + 1 WHERE id = ?', [req.user.id]);
  res.json({ ok: true });
});

module.exports = router;
