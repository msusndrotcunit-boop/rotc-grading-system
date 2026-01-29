const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false } // Neon requires SSL
});

console.log('Testing connection to Neon DB...');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection error:', err);
  } else {
    console.log('Connection successful!');
    console.log('Server time:', res.rows[0].now);
  }
  pool.end();
});
