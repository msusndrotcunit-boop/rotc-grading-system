const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'rotc.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Check if column exists or just try to add it and ignore error
    db.run("ALTER TABLE grades ADD COLUMN status TEXT DEFAULT 'active'", (err) => {
        if (err) {
            if (err.message.includes('duplicate column name')) {
                console.log('Column "status" already exists.');
            } else {
                console.error('Error adding column:', err.message);
            }
        } else {
            console.log('Column "status" added successfully.');
        }
    });
});

db.close();
