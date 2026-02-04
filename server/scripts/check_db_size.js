const path = require('path');
const dotenv = require('dotenv');

// Try loading from server directory first, then root
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Client } = require('pg');

const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_URL;

if (!dbUrl) {
    console.error('Error: DATABASE_URL or SUPABASE_URL not found in environment.');
    console.error('Make sure .env file exists in server/ or root directory.');
    process.exit(1);
}

const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
});

async function checkSize() {
    try {
        await client.connect();
        console.log('Connected to database. Fetching table sizes...');

        const query = `
            SELECT
                table_name,
                pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) AS total_size,
                pg_total_relation_size(quote_ident(table_name)) as raw_size
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY raw_size DESC;
        `;

        const res = await client.query(query);

        console.table(res.rows.map(r => ({
            Table: r.table_name,
            Size: r.total_size
        })));

    } catch (err) {
        console.error('Error checking database size:', err);
    } finally {
        await client.end();
    }
}

checkSize();
