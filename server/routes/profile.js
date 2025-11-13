const express = require('express');
const db = require('../db');

const router = express.Router();

function getSessionUser(req, callback) {
  const token = req.cookies.session;
  if (!token) return callback(null);
  db.get(`SELECT userId FROM sessions WHERE token = ? AND expires > ?`, [token, Date.now()], (err, row) => {
    if (err || !row) return callback(null);
    db.get(`SELECT id,email,displayName,avatarUrl,bio,role,createdAt,updatedAt FROM users WHERE id = ?`, [row.userId], (e, u) => {
      if (e || !u) return callback(null);
      callback(u);
    });
  });
}

router.get('/me', (req, res) => {
  getSessionUser(req, (u) => {
    if (!u) return res.status(401).json({ error: 'Not authenticated' });
    // fetch linked wallets for the user
    db.all(`SELECT id,address,verified,linkedAt FROM wallet_links WHERE userId = ?`, [u.id], (err, links) => {
      if (err) {
        console.error('Failed to load wallet links', err);
        return res.json({ profile: u, wallet_links: [] });
      }
      res.json({ profile: u, wallet_links: links || [] });
    });
  });
});

router.patch('/me', express.json(), (req, res) => {
  getSessionUser(req, (u) => {
    if (!u) return res.status(401).json({ error: 'Not authenticated' });
    const { displayName, bio } = req.body;
    const updatedAt = Date.now();
    db.run(`UPDATE users SET displayName = ?, bio = ?, updatedAt = ? WHERE id = ?`, [displayName || u.displayName, bio || u.bio, updatedAt, u.id], function (err) {
      if (err) return res.status(500).json({ error: 'Failed to update' });
      db.get(`SELECT id,email,displayName,avatarUrl,bio,role,createdAt,updatedAt FROM users WHERE id = ?`, [u.id], (e, up) => {
        if (e) return res.status(500).json({ error: 'Server error' });
        res.json({ profile: up });
      });
    });
  });
});

module.exports = router;
