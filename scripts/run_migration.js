require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    console.log("Starting manual migration...");

    if (!process.env.DATABASE_URL) {
        console.error("Error: DATABASE_URL is not set in environment.");
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        const client = await pool.connect();
        console.log("Connected to database.");

        const sqlPath = path.join(__dirname, 'update_db.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log("Executing SQL script...");
        await client.query(sql);

        console.log("Migration completed successfully.");
        client.release();
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await pool.end();
    }
}

runMigration();
