// Authentication core: JWT issuing/verification and role-based route guards.
//
// Flow: POST /api/auth/login -> { token, user }. The client sends the token on each
// request as "Authorization: Bearer <token>". requireAuth verifies the signature and
// then re-loads the user from MySQL, so blocking an account, changing its role or
// bumping token_version (password change) takes effect immediately.
const jwt = require('jsonwebtoken');
const { pool } = require('./db');

const ROLES = Object.freeze({ ADMIN: 'admin', CUSTOMER: 'customer' });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set in .env (at least 32 characters).');
}

function signToken(user) {
  return jwt.sign(
    { sub: String(user.id), role: user.role, tv: user.token_version },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN, algorithm: 'HS256' }
  );
}

// Shape of a user that is safe to send to the browser.
function publicUser(user) {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
}

async function loadUser(id) {
  const [rows] = await pool.query(
    `SELECT id, role, name, email, phone, is_active, token_version
       FROM users WHERE id = ?`,
    [id]
  );
  return rows[0];
}

function unauthorized(res, message = 'Please log in to continue.') {
  return res.status(401).json({ error: message });
}

async function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return unauthorized(res);

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    return unauthorized(res, 'Your session has expired. Please log in again.');
  }

  const user = await loadUser(Number(payload.sub));
  if (!user || !user.is_active || user.token_version !== payload.tv) {
    return unauthorized(res, 'Your session has expired. Please log in again.');
  }

  req.user = user;
  next();
}

// Usage: router.use(requireAuth, requireRole(ROLES.ADMIN))
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have access to this resource.' });
    }
    next();
  };
}

module.exports = { ROLES, signToken, publicUser, loadUser, requireAuth, requireRole };
