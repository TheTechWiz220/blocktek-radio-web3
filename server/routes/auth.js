const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const router = express.Router();

function setSession(res, token) {
  // 7 days
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  res.cookie('session', token, { httpOnly: true, sameSite: 'lax', maxAge });
}

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  const createdAt = Date.now();
  try {
    const hash = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO users (email, passwordHash, displayName, avatarUrl, bio, role, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?)`,
      [email, hash, email.split('@')[0], '', '', 'listener', createdAt, createdAt],
      function (err) {
        if (err) return res.status(400).json({ error: 'Email already registered' });
        const userId = this.lastID;
        const token = uuidv4();
        const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
        db.run(`INSERT INTO sessions (token, userId, expires) VALUES (?,?,?)`, [token, userId, expires]);
        setSession(res, token);
        return res.json({ ok: true });
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  db.get(`SELECT id, passwordHash FROM users WHERE email = ?`, [email], async (err, row) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!row) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, row.passwordHash);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = uuidv4();
    const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
    db.run(`INSERT INTO sessions (token, userId, expires) VALUES (?,?,?)`, [token, row.id, expires]);
    setSession(res, token);
    res.json({ ok: true });
  });
});

router.post('/logout', (req, res) => {
  const token = req.cookies.session;
  if (token) db.run(`DELETE FROM sessions WHERE token = ?`, [token]);
  res.clearCookie('session');
  res.json({ ok: true });
});

module.exports = router;
