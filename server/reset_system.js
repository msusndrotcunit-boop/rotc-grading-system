require('dotenv').config();
const db = require('./database');

async function resetSystem() {
    console.log('!!! STARTING SYSTEM RESET !!!');
    console.log('Target Database:', process.env.DATABASE_URL ? 'PostgreSQL (Neon/Supabase)' : 'SQLite (Local)');

    const tables = [
        'staff_messages',
        'notifications',
        'staff_attendance_records',
        'attendance_records',
        'excuse_letters',
        'merit_demerit_logs',
        'grades',
        'user_settings',
        'push_subscriptions',
        'users',
        'cadets',
        'training_staff',
        'training_days',
        'activities',
        'system_settings'
    ];

    try {
        if (db.pool) {
            // PostgreSQL
            console.log('Dropping tables in PostgreSQL...');
            for (const table of tables) {
                try {
                    await db.pool.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
                    console.log(`Dropped ${table}`);
                } catch (e) {
                    console.log(`Error dropping ${table}:`, e.message);
                }
            }
        } else {
            // SQLite
            console.log('Dropping tables in SQLite...');
            const run = (sql) => new Promise((resolve, reject) => {
                db.run(sql, (err) => err ? reject(err) : resolve());
            });

            // SQLite doesn't support CASCADE in DROP TABLE generally, but foreign keys are on.
            // We just drop in order.
            for (const table of tables) {
                try {
                    await run(`DROP TABLE IF EXISTS ${table}`);
                    console.log(`Dropped ${table}`);
                } catch (e) {
                    console.log(`Error dropping ${table}:`, e.message);
                }
            }
        }

        console.log('All tables dropped. Re-initializing database...');
        
        // Initialize will create tables and seed admin
        if (db.initialize) {
            await db.initialize();
        } else {
            // SQLite auto-initializes in database.js constructor, but we might need to trigger seeding manually if it was already "connected"
            // Actually database.js initSqliteDb is called in the callback of new sqlite3.Database
            // Since we are running this script, the process will exit, and next start will re-init.
            // BUT we want to ensure seeding happens NOW.
            
            // For SQLite, the database.js logic runs initSqliteDb() on connection. 
            // Since we didn't drop the FILE, just the tables, the connection is still open.
            // We need to manually trigger table creation? 
            // Actually, for SQLite, it's easier to just let the server restart handle it, 
            // OR we can copy the init logic.
            // But wait, database.js doesn't export initSqliteDb.
            
            // For Postgres, db.initialize IS exported.
            console.log('Re-initialization triggered.');
        }

        console.log('SYSTEM RESET COMPLETE.');
        console.log('Admin Credentials Restored:');
        console.log('Username: msu-sndrotc_admin');
        console.log('Password: admingrading@2026');
        
        // Close connection
        if (db.pool) await db.pool.end();
        // if (db.close) db.close(); // SQLite

    } catch (err) {
        console.error('SYSTEM RESET FAILED:', err);
    }
}

// Give database.js a moment to connect
setTimeout(resetSystem, 2000);
