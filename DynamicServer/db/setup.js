// Usage:
//   npm run db:setup   -> create missing tables; seed data only if the catalog is empty
//   npm run db:seed    -> create missing tables and RE-SEED catalog/content tables
//                         (deletes and re-inserts them; settings and user accounts are kept)
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { connectionConfig } = require('../src/db');
const data = require('./seed-data');

const forceSeed = process.argv.includes('--seed');

// Child tables first so foreign keys are satisfied when deleting.
const SEEDED_TABLES = [
  'menu_item_prices', 'menu_items', 'menu_categories',
  'preorder_item_prices', 'preorder_items', 'preorder_categories',
  'meat_product_cuts', 'meat_products', 'meat_categories', 'cutting_styles',
  'delivery_slots', 'special_menu_items', 'special_menu_groups', 'content_items',
];

async function insert(conn, table, row) {
  const [result] = await conn.query(`INSERT INTO ${table} SET ?`, row);
  return result.insertId;
}

async function seedCatalog(conn) {
  for (const table of SEEDED_TABLES) {
    await conn.query(`DELETE FROM ${table}`);
    await conn.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
  }

  // Menu
  const menuCategoryIds = {};
  for (const [i, c] of data.menuCategories.entries()) {
    menuCategoryIds[c.name] = await insert(conn, 'menu_categories', {
      name: c.name, icon: c.icon, page_heading: c.pageHeading, sort_order: i + 1,
    });
  }
  let menuOrder = 0;
  for (const group of data.menuGroups) {
    for (const [name, prices] of group.rows) {
      const itemId = await insert(conn, 'menu_items', {
        category_id: menuCategoryIds[group.category],
        main_heading: group.mainHeading,
        section: group.section,
        name,
        description: group.description || `Freshly prepared ${name.toLowerCase()} with authentic Spice Soirée flavours.`,
        image: data.menuImages[name] || '',
        is_bestseller: data.menuBestsellers.includes(name) ? 1 : 0,
        sort_order: ++menuOrder,
      });
      for (const [s, size] of group.sizes.entries()) {
        await insert(conn, 'menu_item_prices', {
          menu_item_id: itemId, size_label: size, price: prices[s], sort_order: s + 1,
        });
      }
    }
  }

  // Pre-order curries
  const preorderCategoryIds = {};
  for (const [i, c] of data.preorderCategories.entries()) {
    preorderCategoryIds[c.name] = await insert(conn, 'preorder_categories', {
      name: c.name, icon: c.icon, curry_type: c.curryType, sort_order: i + 1,
    });
  }
  for (const [i, item] of data.preorderItems.entries()) {
    const itemId = await insert(conn, 'preorder_items', {
      category_id: preorderCategoryIds[item.category],
      name: item.name, description: item.description, image: item.image, sort_order: i + 1,
    });
    for (const [s, [size, price]] of Object.entries(item.prices).entries()) {
      await insert(conn, 'preorder_item_prices', {
        preorder_item_id: itemId, size_label: size, price, sort_order: s + 1,
      });
    }
  }

  // Fresh meat
  const meatCategoryIds = {};
  for (const [i, c] of data.meatCategories.entries()) {
    meatCategoryIds[c.name] = await insert(conn, 'meat_categories', {
      name: c.name, icon: c.icon, sort_order: i + 1,
    });
  }
  for (const [i, p] of data.meatProducts.entries()) {
    const productId = await insert(conn, 'meat_products', {
      category_id: meatCategoryIds[p.category], name: p.name, subtitle: p.subtitle, price: p.price,
      display_price: p.displayPrice, unit: p.unit, image: p.image,
      cutting_allowed: p.cuttingAllowed ? 1 : 0, sort_order: i + 1,
    });
    for (const [c, cut] of p.cuts.entries()) {
      await insert(conn, 'meat_product_cuts', { meat_product_id: productId, name: cut, sort_order: c + 1 });
    }
  }
  for (const [i, s] of data.cuttingStyles.entries()) {
    await insert(conn, 'cutting_styles', { ...s, sort_order: i + 1 });
  }

  // Booking slots
  for (const [i, label] of data.deliverySlots.entries()) {
    await insert(conn, 'delivery_slots', { label, sort_order: i + 1 });
  }

  // Special menu
  for (const [i, g] of data.specialMenuGroups.entries()) {
    const groupId = await insert(conn, 'special_menu_groups', { name: g.name, image: g.image, sort_order: i + 1 });
    for (const [j, name] of g.items.entries()) {
      await insert(conn, 'special_menu_items', { group_id: groupId, name, sort_order: j + 1 });
    }
  }

  // Page content
  for (const [page, sections] of Object.entries(data.content)) {
    for (const [section, rows] of Object.entries(sections)) {
      for (const [i, r] of rows.entries()) {
        await insert(conn, 'content_items', {
          page, section,
          title: r.title || '', subtitle: r.subtitle || '', description: r.description || '',
          detail: r.detail || '', icon: r.icon || '', image: r.image || '',
          button_text: r.buttonText || '', link: r.link || '', sort_order: i + 1,
        });
      }
    }
  }
}

async function seedSettings(conn) {
  // Only adds missing keys; never overwrites values edited in the database.
  for (const [key, value] of Object.entries(data.settings)) {
    await conn.query('INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)', [key, value]);
  }
}

// Adds a column to an existing table if it is missing (CREATE TABLE IF NOT EXISTS
// does not change tables that already exist).
async function ensureColumn(conn, table, column, definition) {
  const [rows] = await conn.query(
    'SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
    [table, column]
  );
  if (!rows.length) {
    await conn.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    console.log(`  migration: added ${table}.${column}`);
  }
}

async function migrateColumns(conn) {
  for (const table of ['menu_items', 'preorder_items', 'meat_products']) {
    await ensureColumn(conn, table, 'in_stock', 'TINYINT(1) NOT NULL DEFAULT 1 AFTER is_active');
  }
}

// Item images shipped with the project live in db/seed-images (tracked in git).
// Copy any that are missing into the uploads folder the server serves from.
function copySeedImages() {
  const { UPLOAD_DIR } = require('../src/uploads');
  const sourceDir = path.join(__dirname, 'seed-images');
  if (!fs.existsSync(sourceDir)) return;
  let copied = 0;
  for (const file of fs.readdirSync(sourceDir)) {
    const target = path.join(UPLOAD_DIR, file);
    if (!fs.existsSync(target)) {
      fs.copyFileSync(path.join(sourceDir, file), target);
      copied += 1;
    }
  }
  console.log(`  images: ${copied} seed image(s) copied to ${UPLOAD_DIR}`);
}

// One-time migration from the old admin_users table into users(role='admin').
async function migrateLegacyAdmins(conn) {
  const [tables] = await conn.query("SHOW TABLES LIKE 'admin_users'");
  if (!tables.length) return;
  const [result] = await conn.query(
    `INSERT IGNORE INTO users (role, name, email, password_hash)
     SELECT 'admin', username, LOWER(email), password_hash FROM admin_users`
  );
  await conn.query('DROP TABLE admin_users');
  console.log(`  admin: migrated ${result.affectedRows} account(s) from admin_users -> users`);
}

async function seedAdmin(conn) {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log('  admin: ADMIN_EMAIL / ADMIN_PASSWORD not set in .env, skipped');
    return;
  }
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const [existing] = await conn.query('SELECT id, role FROM users WHERE email = ?', [email]);
  if (existing.length) {
    if (existing[0].role !== 'admin') {
      console.log(`  admin: WARNING ${email} exists as a ${existing[0].role}, not changed`);
    } else {
      console.log(`  admin: ${email} already exists, left unchanged`);
    }
    return;
  }
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await insert(conn, 'users', {
    role: 'admin', name: ADMIN_NAME || 'Administrator', email, password_hash: hash,
  });
  console.log(`  admin: created ${email}`);
}

async function main() {
  const conn = await mysql.createConnection(connectionConfig({ multipleStatements: true }));
  try {
    console.log(`Connected to ${process.env.DB_HOST}/${process.env.DB_NAME}`);
    await conn.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
    console.log('  schema: ok');
    await migrateColumns(conn);

    const [[{ count }]] = await conn.query('SELECT COUNT(*) AS count FROM menu_items');
    if (forceSeed || count === 0) {
      await conn.beginTransaction();
      try {
        await seedCatalog(conn);
        await conn.commit();
      } catch (err) {
        await conn.rollback();
        throw err;
      }
      console.log('  catalog & content: seeded');
    } else {
      console.log('  catalog & content: already populated (use "npm run db:seed" to reload)');
    }

    await seedSettings(conn);
    console.log('  settings: ok');
    await migrateLegacyAdmins(conn);
    await seedAdmin(conn);
    copySeedImages();
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('Database setup failed:', err.message);
  process.exit(1);
});
