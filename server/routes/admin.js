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

// request DJ role (authenticated)
router.post('/request-dj', express.json(), (req, res) => {
  getSessionUser(req, (u) => {
    if (!u) return res.status(401).json({ error: 'Not authenticated' });
    const createdAt = Date.now();
    db.run(`INSERT INTO dj_requests (userId, status, createdAt) VALUES (?,?,?)`, [u.id, 'pending', createdAt], function (err) {
      if (err) return res.status(500).json({ error: 'Failed to create request' });
      res.json({ ok: true, requestId: this.lastID });
    });
  });
});

// admin: list requests
router.get('/requests', (req, res) => {
  getSessionUser(req, (u) => {
    if (!u) return res.status(401).json({ error: 'Not authenticated' });
    if (u.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    db.all(`SELECT r.id, r.userId, r.status, r.createdAt, r.processedAt, r.adminId, u.email, u.displayName FROM dj_requests r JOIN users u ON u.id = r.userId ORDER BY r.createdAt DESC`, [], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to list requests' });
      res.json({ requests: rows });
    });
  });
});

// admin: approve request (body: { requestId })
router.post('/approve', express.json(), (req, res) => {
  const { requestId } = req.body;
  if (!requestId) return res.status(400).json({ error: 'Missing requestId' });
  getSessionUser(req, (u) => {
    if (!u) return res.status(401).json({ error: 'Not authenticated' });
    if (u.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const processedAt = Date.now();
    // find request
    db.get(`SELECT id, userId FROM dj_requests WHERE id = ?`, [requestId], (err, row) => {
      if (err || !row) return res.status(404).json({ error: 'Request not found' });
      db.run(`UPDATE dj_requests SET status = ?, processedAt = ?, adminId = ? WHERE id = ?`, ['approved', processedAt, u.id, requestId], function (e) {
        if (e) return res.status(500).json({ error: 'Failed to update request' });
        // grant dj role to user
        db.run(`UPDATE users SET role = ? WHERE id = ?`, ['dj', row.userId], function (e2) {
          if (e2) return res.status(500).json({ error: 'Failed to grant role' });
          res.json({ ok: true });
        });
      });
    });
  });
});

module.exports = router;
