#!/usr/bin/env node
const bcrypt = require('bcrypt');
const path = require('path');
const db = require('../db');

// usage: node scripts/seed-admin.js [email] [password]
const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@example.com';
const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'adminpass';

async function run() {
  try {
    db.get(`SELECT id FROM users WHERE email = ?`, [email], async (err, row) => {
      if (err) {
        console.error('DB error:', err);
        process.exit(1);
      }
      if (row) {
        console.log(`Admin user already exists: ${email}`);
        process.exit(0);
      }

      const hash = await bcrypt.hash(password, 10);
      const now = Date.now();
      db.run(
        `INSERT INTO users (email, passwordHash, displayName, avatarUrl, bio, role, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?)`,
        [email, hash, email.split('@')[0], '', '', 'admin', now, now],
        function (e) {
          if (e) {
            console.error('Failed to create admin user:', e);
            process.exit(1);
          }
          console.log(`Created admin user: ${email} (id=${this.lastID})`);
          process.exit(0);
        }
      );
    });
  } catch (e) {
    console.error('Unexpected error:', e);
    process.exit(1);
  }
}

run();
