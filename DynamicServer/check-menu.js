require('dotenv').config();
const mysql = require('mysql2/promise');
const { connectionConfig } = require('./src/db');

async function check() {
  const conn = await mysql.createConnection(connectionConfig());

  const [rows] = await conn.execute(
    `SELECT i.id, i.name, p.size_label, p.price, i.is_active, i.in_stock
     FROM menu_items i
     LEFT JOIN menu_item_prices p ON p.menu_item_id = i.id
     WHERE i.name = ?`,
    ['Chicken Dum Biryani']
  );

  console.table(rows);
  await conn.end();
}

check().catch(console.error);
