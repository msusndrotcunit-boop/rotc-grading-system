# Database Management Scripts

This directory contains scripts to help manage your NeonDB storage and archive old data to MongoDB.

## Prerequisites

1.  **Dependencies**: Ensure dependencies are installed.
    ```bash
    cd server
    npm install
    ```
2.  **Environment Variables**: Your `.env` file (in `server/` or project root) must contain:
    *   `DATABASE_URL`: Connection string for NeonDB (Postgres).
    *   `MONGO_URI`: Connection string for MongoDB (e.g., MongoDB Atlas).
    *   `ARCHIVE_CUTOFF_DATE` (Optional): Date string (YYYY-MM-DD) to define "old" data. Defaults to 1 year ago.

## Scripts

### 1. Check Database Size
Run this script to see the current size of all tables in your Postgres database.

```bash
node server/scripts/check_db_size.js
```

### 2. Archive Data to MongoDB
Run this script to move old records from Postgres to MongoDB and delete them from Postgres.

**What it archives:**
*   `merit_demerit_logs` older than cutoff date.
*   `attendance_records` (and linked `training_days`) older than cutoff date.
*   `notifications` older than cutoff date.

**Usage:**
```bash
node server/scripts/archive_to_mongo.js
```

## Automation
You can run the archiving script manually or set up a scheduled task (cron job) to run it monthly.
