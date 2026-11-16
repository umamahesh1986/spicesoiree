# Spice Soirée API

Node.js + Express + MySQL backend that serves the menu, products and page content to the React client (`../Client`).

## Setup

```bash
cd Server
npm install
cp .env.example .env      # then fill in DB_PASSWORD and ADMIN_PASSWORD
npm run db:setup          # creates tables; seeds data if the database is empty
npm start                 # http://localhost:4000/api  (npm run dev = auto-restart)
```

Then start the client (`cd Client && npm start`). It calls `http://localhost:4000/api` by default. Set `REACT_APP_API_URL` to point it somewhere else (see `Client/.env.example`).

| Script | What it does |
| --- | --- |
| `npm run db:setup` | Creates missing tables. Seeds catalog/content only if `menu_items` is empty. Adds missing settings keys and the admin user from `.env` if it doesn't exist. |
| `npm run db:seed` | Same, but **deletes and re-inserts** all catalog/content tables from `db/seed-data.js`. Settings and user accounts are never overwritten. |

## Deployment (single site on Windows IIS, SmarterASP.NET "Node.js App")

The website and API run as **one Node.js site**: Express serves the API (`/api`), the images (`/uploads`) and the built React app (everything else).

```bash
cd Server
npm run deploy:build            # default site: https://yesgp1-001-site13.itempurl.com
# or: npm run deploy:build -- https://www.your-domain.com
```

This creates `../deploy/` (git-ignored). Upload **its contents**, including the hidden `.env` and `node_modules/`, to the site's root folder.

The hosting panel only runs Node apps from a **sub-folder**, which becomes the URL prefix. The app is therefore built for `https://site/app/`, and the site root redirects there. Use `--folder=name` for a different folder.

| In `deploy/` | Purpose |
| --- | --- |
| `index.html`, `web.config` | Site root: redirects `/` to `/app/`; serves nothing else |
| `app/web.config` | IIS security settings (hide `.env`, `src`, `db`, `node_modules`; 10 MB upload limit). The hosting panel adds the Node.js handler to it |
| `app/server.js`, `app/src/` | API server (`server.js` is the startup file) |
| `app/diag.js` | Optional self-check: use it as the startup file if the app won't start. It lists Node version, missing files, write permission, modules |
| `app/public/` | Built React app (routes, scripts and images under `/app`; API at `/app/api`) |
| `app/uploads/` | Item images (copied from your local uploads folder) |
| `app/db/` | `setup.js`, schema, seed data/images |
| `app/.env` | Production settings from `Server/.env.production`, plus `BASE_PATH=/app` |

`Server/.env.production` is created on the first build with a **new JWT secret** and is reused afterwards, so logins survive redeploys. It is git-ignored. Edit it to change production settings, then rebuild.

**On the host (control panel → Node.js App):** create an application for the **`/app`** folder. Use **Node.js module: Node.JS + httpPlatform** and **startup file: `server.js`**, then turn it **ON**. The panel adds the Node handler to `web.config`, and the app listens on `process.env.PORT`. Don't set `nodeProcessCommandLine` or an iisnode handler yourself: that bypasses the host's Node setup. The site's account needs **write permission on `uploads/`** for admin image uploads. After enabling, open `/app/api/health`. It should show `"status":"ok"`, the Node version, and `"imageProcessing": true`.

**Redeploying:** when re-uploading, don't overwrite or delete the server's `uploads/` folder. It contains images admins uploaded on the live site. Upload everything else.

## Endpoints (all `GET` unless noted)

| Endpoint | Returns | Used by |
| --- | --- | --- |
| `/api/health` | `{ status: "ok" }` (checks the DB) | monitoring |
| `/api/settings` | `{ whatsapp_number, address_full, hours_display, ... }` | Header, Footer, AnnouncementBar, Contact, Catering, PreOrder, Booking |
| `/api/menu` | `{ categories, items[] }`, each item has `prices: { size: price }` | Menu |
| `/api/preorder` | `{ categories, items[] }` (each with `curryType`) | PreOrderCurries |
| `/api/fresh-meat` | `{ categories, products[], cuttingStyles[] }` | FreshMeatEggs |
| `/api/delivery-slots` | `["12:00 – 1:00 PM", ...]` | BookingPage |
| `/api/special-menu` | `[{ category, image, items[] }]` | WeekOffersPage |
| `/api/content/:page` | `{ [section]: [{ title, subtitle, description, detail, icon, image, buttonText, link }] }` | Home, Catering, Contact, AboutUs, Reviews, Hospitality, FineDining |

## Authentication

Admins and customers share **one login screen** and one `users` table. The `role` column (`admin` / `customer`) decides what each account can reach.

- Login returns a JWT (signed with `JWT_SECRET`, valid for `JWT_EXPIRES_IN`). The client stores it and sends `Authorization: Bearer <token>`.
- On every authenticated request the server re-loads the user from MySQL. Blocking an account, changing its role, or changing its password (which bumps `token_version`) therefore takes effect immediately.
- Passwords are stored as bcrypt hashes. Failed logins are throttled (10 per 15 minutes per IP and per account).
- Self-registration always creates a **customer**. Admin accounts come from `ADMIN_*` in `.env` (`db:setup`), or by changing `role` in the database.

| Endpoint | Access | Purpose |
| --- | --- | --- |
| `POST /api/auth/register` `{ name, email, phone, password }` | public | Create a customer account → `{ token, user }` |
| `POST /api/auth/login` `{ identifier, password }` | public | `identifier` is an email or mobile number → `{ token, user }` |
| `GET /api/auth/me` | logged in | Current user (restores the session on page load) |
| `PUT /api/auth/me` `{ name, phone }` | logged in | Update own profile |
| `POST /api/auth/change-password` `{ currentPassword, newPassword }` | logged in | Returns a new token; other devices are signed out |
| `POST /api/auth/logout-all` | logged in | Invalidate every token for this account |
| `GET /api/admin/summary` | admin | Dashboard counts |
| `GET /api/admin/customers` | admin | Customer list |
| `PATCH /api/admin/customers/:id` `{ isActive }` | admin | Block / unblock a customer (blocking signs them out) |
| `GET /api/admin/catalog/:type` | admin | All items incl. hidden + categories. `type` = `menu`, `preorder` or `meat` |
| `POST /api/admin/catalog/:type` | admin | Add an item (see below) |
| `PUT /api/admin/catalog/:type/:id` | admin | Edit an item. Prices/cuts are replaced; omitted `isActive`/`inStock`/`sortOrder` keep their current values |
| `PATCH /api/admin/catalog/:type/:id` `{ isActive?, inStock? }` | admin | Show/hide on website, mark in/out of stock |

Item body for `POST`/`PUT`: `categoryId`, `name`, `description`, `image`, `isActive`, `inStock`, `sortOrder`, plus:
- `menu`: `section`, `mainHeading`, `isBestseller`, `prices: [{ size, price }]`
- `preorder`: `prices: [{ size, price }]`
- `meat`: `subtitle`, `price`, `unit`, `displayPrice`, `cuttingAllowed`, `cuts: ["Curry Cut - Small", ...]` (required when `cuttingAllowed`)

**Hidden** (`is_active = 0`) items are left out of the public API. **Out-of-stock** (`in_stock = 0`) items are still returned with `inStock: false`; the website shows them with a disabled "Out of Stock" button.

Client routes: `/login` and `/register` are public. `/admin` (Dashboard, Orders, Menu Items, Pre-Order Curries, Fresh Meat & Eggs, Customers) is admin only. `/account`, `/orders` (My Orders) and `/booking` (checkout) are customer only. Menu and other pages stay public. A user who opens the other role's page is sent to their own home screen.

## Orders

Checkout (`/booking`) saves orders in MySQL. **One order is created per selected date**, each with its own status. The browser sends only item references (`itemType`, `itemId`, `size`, `cuttingOption`, `quantity`). The server reprices everything from the database and rejects hidden, out-of-stock or changed items, past time slots, and dates outside today to today + 3 (India time). Order lines are stored as snapshots, so later menu edits never change an existing order.

Status lifecycle (rules in `src/orderStatus.js`, enforced by the server):

```
placed -> confirmed -> preparing -> ready -> out_for_delivery -> delivered -> disputed -> resolved
                                         \-> picked_up (pickup orders) --/
out_for_delivery -> delivery_failed -> out_for_delivery (retry) | cancelled
placed / confirmed / preparing / ready / delivery_failed -> cancelled
```

- **Customer** can cancel while the order is `placed` or `confirmed`, and can report a problem (→ `disputed`) up to 48 hours after delivery or pickup.
- **Admin** can make any allowed transition. `cancelled`, `delivery_failed`, `disputed` and `resolved` require a note.
- **Payment status** (`unpaid` / `paid` / `refunded`) is set by the admin; there is no online payment yet.
- Every change is written to `order_status_history` (who, when, from → to, note).

| Endpoint | Access | Purpose |
| --- | --- | --- |
| `POST /api/orders` | customer | Place order(s): `{ fulfilmentType: delivery\|pickup, customerName, customerPhone, deliveryAddress, dates: ['YYYY-MM-DD'], timeSlot, notes, items: [...] }` |
| `GET /api/orders`, `GET /api/orders/:id` | customer | Own orders with history, `canCancel`, `canDispute` |
| `POST /api/orders/:id/cancel` `{ reason }` | customer | Cancel (only while placed / confirmed) |
| `POST /api/orders/:id/dispute` `{ reason }` | customer | Report a problem after delivery / pickup |
| `GET /api/admin/orders?view=open\|completed\|closed\|all&status=&date=&q=` | admin | Order list with history and `allowedNext` actions |
| `GET /api/admin/orders/meta` | admin | Status list, counts per status, today's count |
| `POST /api/admin/orders/:id/status` `{ status, note }` | admin | Change status |
| `PATCH /api/admin/orders/:id/payment` `{ paymentStatus }` | admin | Set payment status |

## Images

All item images (menu, curries, fresh meat, cutting styles, specials, page slides) are stored on the server in **one folder**, `UPLOAD_DIR` (default `Server/uploads`), and served at `/uploads/<file>` with a 30-day browser cache. The database stores the path (`/uploads/butter-naan.webp`). The client turns it into a full URL on the API server (`mediaUrl()` in `Client/src/api.js`).

- **Admin upload:** `POST /api/admin/uploads` (multipart, field `image`, admin only) → `{ url }`. The file is checked by decoding it (not by its name or type). JPG/PNG/WebP/GIF are accepted, SVG is rejected, and the limit is 8 MB. It is saved as WebP (max 1200px, quality 80), typically 50–150 KB.
- **Seed images:** compressed copies of the original photos are in `db/seed-images/` (tracked in git). `npm run db:setup` copies any missing ones into `UPLOAD_DIR`.
- `uploads/` is git-ignored: admin uploads are data. Back that folder up with the database, and on hosting make sure it is writable and survives redeploys.
- Replacing an item's image does not delete the old file.

Only site design images (logo, banner) remain in `Client/public/images`.

## Performance

Public catalog endpoints run their queries in parallel and cache the result in memory (5 minutes, max 100 entries). Any successful admin catalog change clears the cache, so edits show immediately. Order endpoints are never cached.

## Tables

- `settings`: key/value business info (WhatsApp number, phones, emails, address, hours).
- `menu_categories`, `menu_items`, `menu_item_prices`: restaurant menu.
- `preorder_categories`, `preorder_items`, `preorder_item_prices`: pre-order curries.
- `meat_categories`, `meat_products`, `meat_product_cuts`, `cutting_styles`: fresh meat & eggs.
- `delivery_slots`: booking time slots.
- `special_menu_groups`, `special_menu_items`: seasonal specials (Karthika Masam).
- `content_items`: lists shown on pages, keyed by `page` + `section`. `db/seed-data.js` documents which column holds what for each list.
- `users`: admin and customer accounts (`role`, bcrypt `password_hash`, `is_active`, `token_version`).
- `orders`, `order_items`, `order_status_history`: customer orders, line snapshots and the status audit trail.

Most tables have `is_active` and `sort_order` columns, so you can hide or reorder rows without deleting them. `menu_items`, `preorder_items` and `meat_products` also have `in_stock` (added automatically by `npm run db:setup` on existing databases).

## Configuration (`.env`)

| Variable | Purpose |
| --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection |
| `PORT` | HTTP port (default 4000) |
| `CORS_ORIGINS` | Comma-separated browser origins allowed to call the API, e.g. `http://localhost:3000,https://www.example.com` |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Initial admin account created by `db:setup` |
| `JWT_SECRET` | Secret for signing login tokens (64+ random characters; changing it logs everyone out) |
| `JWT_EXPIRES_IN` | Login lifetime, e.g. `7d`, `12h` |
| `UPLOAD_DIR` | Optional. Folder for item images (default `Server/uploads`) |

`.env` is git-ignored. Never commit real credentials.
