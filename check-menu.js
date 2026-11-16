require('dotenv').config();
const mysql = require('mysql2/promise');
const { connectionConfig } = require('./src/db');

async function check() {
  const conn = await mysql.createConnection(connectionConfig());

  const [rows] = await conn.execute(
    'SELECT id, name, is_active, in_stock FROM menu_items WHERE name LIKE ?',
    ['%Chicken Dum Biryani%']
  );

  console.table(rows);
  await conn.end();
}

check().catch(console.error);
