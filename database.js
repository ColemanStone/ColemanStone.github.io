// database.js
const Database = require('sqlite3');
const db = new Database('data/site.db'); // Creates or opens the DB file

// Create the users table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0
  );
`).run();

module.exports = db;