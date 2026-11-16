const path = require('path');
const mysql = require('mysql2/promise');

require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

function connectionConfig(extra = {}) {
  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4', // emoji icons are stored in the database
    decimalNumbers: true, // return DECIMAL prices as JS numbers
    ...extra,
  };
}

const pool = mysql.createPool(
  connectionConfig({
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_POOL_SIZE || 5),
  })
);

module.exports = { pool, connectionConfig };
