const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env'), override: true });

// DB Connection Logic (copied from database.js logic for standalone script)
const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_URL;
const isPostgres = !!dbUrl;

let db;

if (isPostgres) {
    const { URL } = require('url');
    const params = new URL(dbUrl);
    const pool = new Pool({
        user: params.username,
        password: params.password,
        host: params.hostname,
        port: params.port,
        database: params.pathname.split('/')[1],
        ssl: { rejectUnauthorized: false }
    });
    
    db = {
        get: async (sql, params) => {
            const res = await pool.query(sql.replace(/\?/g, '$1'), params); // simple replacement, might need better generic query
            return res.rows[0];
        },
        run: async (sql, params, callback) => {
            // Convert ? to $1, $2, etc.
            let i = 1;
            const pgSql = sql.replace(/\?/g, () => `$${i++}`);
            try {
                await pool.query(pgSql, params);
                if (callback) callback(null);
            } catch (err) {
                if (callback) callback(err);
            }
        },
        serialize: (cb) => cb(), // No-op for PG
        close: () => pool.end()
    };
} else {
    const dbPath = path.resolve(__dirname, 'rotc.db');
    db = new sqlite3.Database(dbPath);
}

const seedDefaultCadet = async () => {
    const username = 'cadet@2026';
    const password = 'cadet@2026';
    const email = 'cadet2026@default.com';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Seeding default cadet user: ${username}`);

    // Check if user exists
    const checkUserSql = isPostgres 
        ? "SELECT * FROM users WHERE username = $1"
        : "SELECT * FROM users WHERE username = ?";
    
    // PG requires await/callback handling, wrapper above handles basics but let's use db.get style
    // However, the wrapper I made above for PG returns promise for get.
    // SQLite get uses callback.
    // Let's stick to standard callback pattern if using the `db` object from sqlite3, 
    // but for the PG wrapper I made, it returns promise.
    // To be safe and consistent, I will just use the `database.js` module if possible, 
    // but `database.js` has complex logic. 
    // Let's just use the `db` object I instantiated which mimics the needed API.

    const getUser = (u) => {
        return new Promise((resolve, reject) => {
            if (isPostgres) {
                db.get("SELECT * FROM users WHERE username = ?", [u]).then(resolve).catch(reject);
            } else {
                db.get("SELECT * FROM users WHERE username = ?", [u], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            }
        });
    };

    const runQuery = (sql, params) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    };

    try {
        const row = await getUser(username);
        if (row) {
            console.log('Default cadet user already exists. Updating password...');
            await runQuery("UPDATE users SET password = ?, is_approved = 1, role = 'cadet' WHERE username = ?", [hashedPassword, username]);
            console.log('Default cadet user updated.');
        } else {
            console.log('Creating default cadet user...');
            
            // 1. Create Dummy Cadet Profile
            const cadetSql = `INSERT INTO cadets (
                student_id, first_name, last_name, rank, status
            ) VALUES (?, ?, ?, ?, ?)`;
            
            // We need the ID of the inserted cadet.
            // SQLite: this.lastID in callback. PG: RETURNING id.
            
            if (isPostgres) {
                // PG Implementation
                const pgClient = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
                const cadetRes = await pgClient.query(
                    "INSERT INTO cadets (student_id, first_name, last_name, rank, status) VALUES ($1, $2, $3, $4, $5) RETURNING id",
                    ['DEFAULT_CADET', 'Default', 'Cadet', 'CDT', 'System']
                );
                const cadetId = cadetRes.rows[0].id;
                
                await pgClient.query(
                    "INSERT INTO users (username, password, role, cadet_id, is_approved, email) VALUES ($1, $2, $3, $4, $5, $6)",
                    [username, hashedPassword, 'cadet', cadetId, 1, email]
                );
                await pgClient.end();
            } else {
                // SQLite Implementation
                db.run(`INSERT INTO cadets (student_id, first_name, last_name, rank, status) VALUES (?, ?, ?, ?, ?)`, 
                    ['DEFAULT_CADET', 'Default', 'Cadet', 'CDT', 'System'], 
                    function(err) {
                        if (err) {
                            console.error('Error inserting cadet:', err);
                            return;
                        }
                        const cadetId = this.lastID;
                        db.run(`INSERT INTO users (username, password, role, cadet_id, is_approved, email) VALUES (?, ?, ?, ?, ?, ?)`, 
                            [username, hashedPassword, 'cadet', cadetId, 1, email],
                            (err) => {
                                if (err) console.error(err);
                                else console.log('Default cadet user created.');
                            }
                        );
                    }
                );
            }
        }
    } catch (err) {
        console.error('Error in seeding:', err);
    }
};

seedDefaultCadet();
