/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require('pg');

const databaseUrl = 'postgresql://postgres:admin@127.0.0.1:5432/postgres'; // Try default DB first

const client = new Client({
    connectionString: databaseUrl,
});

async function check() {
    try {
        console.log('Connecting to Postgres...');
        await client.connect();
        console.log('Connected successfully to "postgres" database!');

        // Check if MAKE_MONEY exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'MAKE_MONEY'");
        if (res.rowCount === 0) {
            console.log('Database MAKE_MONEY does not exist. Attempting to create...');
            try {
                await client.query('CREATE DATABASE "MAKE_MONEY"');
                console.log('Database MAKE_MONEY created!');
            } catch (e) {
                console.error('Failed to create database:', e.message);
            }
        } else {
            console.log('Database MAKE_MONEY already exists.');
        }

        await client.end();
    } catch (err) {
        console.error('CONNECTION ERROR:', err);
        console.error('Message:', err.message);
        console.error('Code:', err.code);
        process.exit(1);
    }
}

check();
