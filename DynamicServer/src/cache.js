// Tiny in-memory cache for public catalog responses. The database is remote, so
// each query costs a network round trip; menu data changes rarely and every
// admin write clears the cache (see routes/adminCatalog.js).
const DEFAULT_TTL_MS = 5 * 60 * 1000;
const MAX_ENTRIES = 100; // keys come partly from URLs (content pages); keep memory bounded
const entries = new Map(); // key -> { expires, promise }

function cached(key, load, ttlMs = DEFAULT_TTL_MS) {
  const hit = entries.get(key);
  if (hit && hit.expires > Date.now()) return hit.promise;
  if (entries.size >= MAX_ENTRIES) entries.clear();

  const promise = load();
  entries.set(key, { expires: Date.now() + ttlMs, promise });
  // Don't keep failures around
  promise.catch(() => entries.delete(key));
  return promise;
}

function clearCache() {
  entries.clear();
}

module.exports = { cached, clearCache };
