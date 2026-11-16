// Small input helpers shared by the auth and admin routes.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

// Accepts "98494 89900", "+91 98494-89900", "919849489900" -> "9849489900".
// Returns null if it is not a 10-digit mobile number.
function normalizePhone(value) {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

function isValidEmail(email) {
  return EMAIL_RE.test(email) && email.length <= 255;
}

// Returns an error message, or null when the password is acceptable.
function passwordProblem(password) {
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  if (password.length > 72) {
    return 'Password must be at most 72 characters.'; // bcrypt limit
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Password must contain at least one letter and one number.';
  }
  return null;
}

// In-memory throttle for login attempts: max failures per key per window.
function createThrottle({ max = 10, windowMs = 15 * 60 * 1000 } = {}) {
  const failures = new Map();
  const fresh = (entry) => entry && Date.now() - entry.first <= windowMs;
  return {
    blocked(key) {
      const entry = failures.get(key);
      if (!fresh(entry)) {
        failures.delete(key);
        return false;
      }
      return entry.count >= max;
    },
    fail(key) {
      const entry = failures.get(key);
      if (fresh(entry)) entry.count += 1;
      else failures.set(key, { count: 1, first: Date.now() });
    },
    reset(key) {
      failures.delete(key);
    },
  };
}

module.exports = { normalizeEmail, normalizePhone, isValidEmail, passwordProblem, createThrottle };
