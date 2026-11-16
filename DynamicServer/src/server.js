const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { pool } = require('./db');
const { UPLOAD_DIR, PUBLIC_PREFIX, imageProcessingAvailable } = require('./uploads');
const catalogRoutes = require('./routes/catalog');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();

app.set('trust proxy', 1); // correct client IPs behind IIS / nginx / load balancers
app.disable('x-powered-by');

// Sub-folder hosting (e.g. BASE_PATH=/app when the hosting panel runs the app as
// https://site/app/). Depending on the IIS setup the request may arrive with or
// without the prefix, so strip it when present; all routes below are written
// without it.
const BASE_PATH = (process.env.BASE_PATH || '').replace(/\/+$/, '');
if (BASE_PATH) {
  app.use((req, res, next) => {
    if (req.url === BASE_PATH) req.url = '/';
    else if (req.url.startsWith(`${BASE_PATH}/`) || req.url.startsWith(`${BASE_PATH}?`)) {
      req.url = req.url.slice(BASE_PATH.length) || '/';
    }
    next();
  });
}

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : false }));
app.use(express.json({ limit: '100kb' }));

// Item images (one folder for seeded + admin-uploaded images). File names are
// unique per upload, so browsers may cache them for a long time.
app.use(
  PUBLIC_PREFIX,
  express.static(UPLOAD_DIR, {
    maxAge: '30d',
    fallthrough: false, // missing image -> 404, never falls through to other routes
    setHeaders: (res) => {
      res.set('X-Content-Type-Options', 'nosniff');
      res.set('Cross-Origin-Resource-Policy', 'cross-origin'); // client may be on another port/domain
    },
  })
);

// Health check (also useful right after deploying: shows whether the database
// is reachable and whether image uploads can work on this host)
app.get('/api/health', async (req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok', node: process.version, imageProcessing: imageProcessingAvailable() });
});

app.use('/api', catalogRoutes);          // public
app.use('/api/auth', authRoutes);        // login, register, profile (admin + customer)
app.use('/api/orders', orderRoutes);     // role = customer only
app.use('/api/admin', adminRoutes);      // role = admin only

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ---------------------------------------------------------------------------
// Single-site hosting: when the built React app is present (deploy/public),
// serve it from the same server, so the website and API share one domain.
// In development this folder does not exist and the React dev server is used.
// ---------------------------------------------------------------------------
const PUBLIC_DIR = path.resolve(process.env.PUBLIC_DIR || path.join(__dirname, '..', 'public'));
const INDEX_HTML = path.join(PUBLIC_DIR, 'index.html');

if (fs.existsSync(INDEX_HTML)) {
  app.use(
    express.static(PUBLIC_DIR, {
      index: false,
      setHeaders: (res, filePath) => {
        // Hashed bundles never change; everything else should revalidate
        if (filePath.includes(`${path.sep}static${path.sep}`)) {
          res.set('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          res.set('Cache-Control', 'no-cache');
        }
      },
    })
  );

  // Client-side routes (/menu, /admin/orders, ...) all load index.html
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    res.set('Cache-Control', 'no-cache');
    res.sendFile(INDEX_HTML);
  });
  console.log(`Serving website from ${PUBLIC_DIR}`);
}

// Express 5 forwards rejected async handlers here.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 404) return res.status(404).json({ error: 'Not found' }); // e.g. missing image
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}:`, err.message);
  res.status(status).json({ error: status < 500 ? 'Bad request' : 'Internal server error' });
});

// Under IIS (iisnode) PORT is a named pipe such as \\.\pipe\..., so it must
// not be converted to a number.
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Spice Soiree API listening on ${port}`);
});
