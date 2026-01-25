const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_Cf84LVnsjtbT@ep-cold-base-ahn90yr2-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

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
