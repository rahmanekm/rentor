require('dotenv').config({ path: '../.env' }); // Ensure .env is loaded relative to this file's new location if needed, or rely on server.js loading it
const mysql = require('mysql2');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Optional: Test connection immediately (can also be done in server.js)
pool.getConnection((err, conn) => {
  if (err) {
    console.error('[db.js] Error connecting to database:', err.stack);
    // process.exit(1); // Or handle error appropriately
    return;
  }
  if (conn) {
    conn.release();
    console.log('[db.js] Successfully connected to the MySQL database pool.');
  }
});

module.exports = pool; // Export the pool directly
