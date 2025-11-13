const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbFile = path.join(__dirname, 'data.sqlite');
const db = new sqlite3.Database(dbFile);

// Initialize tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      passwordHash TEXT,
      displayName TEXT,
      avatarUrl TEXT,
      bio TEXT,
      role TEXT DEFAULT 'listener',
      createdAt INTEGER,
      updatedAt INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      userId INTEGER,
      expires INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS wallet_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      address TEXT,
      verified INTEGER DEFAULT 0,
      linkedAt INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS nonces (
      nonce TEXT PRIMARY KEY,
      userId INTEGER,
      expires INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS dj_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      status TEXT DEFAULT 'pending',
      createdAt INTEGER,
      processedAt INTEGER,
      adminId INTEGER
    )
  `);
});

module.exports = db;
