const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'rotc.db');
const db = new sqlite3.Database(dbPath);

const columnsToAdd = [
    "ADD COLUMN is_approved INTEGER DEFAULT 0",
    "ADD COLUMN profile_pic TEXT",
    "ADD COLUMN email TEXT"
];

db.serialize(() => {
    columnsToAdd.forEach(col => {
        db.run(`ALTER TABLE users ${col}`, (err) => {
            if (err) {
                if (err.message.includes('duplicate column name')) {
                    console.log(`Column already exists: ${col}`);
                } else {
                    console.error(`Error adding column: ${col}`, err.message);
                }
            } else {
                console.log(`Added column: ${col}`);
            }
        });
    });

    // Update existing admins to be approved by default
    db.run("UPDATE users SET is_approved = 1 WHERE role = 'admin'", (err) => {
        if (err) console.error("Error approving admins", err);
        else console.log("Existing admins approved.");
    });
});

db.close();
