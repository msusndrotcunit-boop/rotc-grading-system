const path = require('path');
const dotenv = require('dotenv');

// Try loading from server directory first, then root
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Client } = require('pg');
const mongoose = require('mongoose');

const PG_URL = process.env.DATABASE_URL || process.env.SUPABASE_URL;
const MONGO_URI = process.env.MONGO_URI;

// Configurable cutoff date (default: 1 year ago)
const CUTOFF_DATE = process.env.ARCHIVE_CUTOFF_DATE || new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0];

if (!PG_URL || !MONGO_URI) {
    console.error('Error: Missing DATABASE_URL or MONGO_URI in environment.');
    console.error('Please add MONGO_URI to your .env file.');
    process.exit(1);
}

// MongoDB Schema for Archives
const ArchiveSchema = new mongoose.Schema({
    original_table: String,
    archived_at: { type: Date, default: Date.now },
    data: mongoose.Schema.Types.Mixed
});

const Archive = mongoose.model('Archive', ArchiveSchema);

async function archiveData() {
    const pgClient = new Client({
        connectionString: PG_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await pgClient.connect();
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Postgres and MongoDB.');
        console.log(`Using cutoff date: ${CUTOFF_DATE}`);

        // 1. Archive Merit/Demerit Logs
        await archiveTable(pgClient, 'merit_demerit_logs', 'date_recorded', CUTOFF_DATE);

        // 2. Archive Attendance Records (via training_days)
        // This requires a JOIN, so we handle it separately
        await archiveAttendance(pgClient, CUTOFF_DATE);

        // 3. Archive Notifications
        await archiveTable(pgClient, 'notifications', 'created_at', CUTOFF_DATE);

    } catch (err) {
        console.error('Archiving failed:', err);
    } finally {
        await pgClient.end();
        await mongoose.disconnect();
    }
}

async function archiveTable(pgClient, tableName, dateColumn, cutoff) {
    console.log(`\nChecking ${tableName}...`);
    const selectQuery = `SELECT * FROM ${tableName} WHERE ${dateColumn} < $1`;
    const res = await pgClient.query(selectQuery, [cutoff]);

    if (res.rows.length > 0) {
        console.log(`Found ${res.rows.length} records in ${tableName} to archive.`);
        
        const archiveDocs = res.rows.map(row => ({
            original_table: tableName,
            data: row
        }));

        await Archive.insertMany(archiveDocs);
        console.log(`Saved to MongoDB.`);

        const deleteQuery = `DELETE FROM ${tableName} WHERE ${dateColumn} < $1`;
        await pgClient.query(deleteQuery, [cutoff]);
        console.log(`Deleted from Postgres.`);
    } else {
        console.log(`No records found in ${tableName} older than ${cutoff}.`);
    }
}

async function archiveAttendance(pgClient, cutoff) {
    console.log(`\nChecking attendance_records...`);
    // Find attendance records linked to old training days
    const selectQuery = `
        SELECT ar.* 
        FROM attendance_records ar
        JOIN training_days td ON ar.training_day_id = td.id
        WHERE td.date < $1
    `;
    
    const res = await pgClient.query(selectQuery, [cutoff]);

    if (res.rows.length > 0) {
        console.log(`Found ${res.rows.length} attendance records to archive.`);
        
        const archiveDocs = res.rows.map(row => ({
            original_table: 'attendance_records',
            data: row
        }));

        await Archive.insertMany(archiveDocs);
        console.log(`Saved to MongoDB.`);

        // Delete using subquery
        const deleteQuery = `
            DELETE FROM attendance_records 
            WHERE id IN (
                SELECT ar.id 
                FROM attendance_records ar
                JOIN training_days td ON ar.training_day_id = td.id
                WHERE td.date < $1
            )
        `;
        await pgClient.query(deleteQuery, [cutoff]);
        console.log(`Deleted from Postgres.`);
    } else {
        console.log(`No attendance records found older than ${cutoff}.`);
    }
}

archiveData();
