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

    // Support pagination and filtering via query params
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize || '20')));
    const status = req.query.status ? String(req.query.status) : null;
    const q = req.query.q ? String(req.query.q).trim() : null;

    const whereClauses = [];
    const params = [];

    if (status && status !== 'all') {
      whereClauses.push('r.status = ?');
      params.push(status);
    }

    if (q) {
      whereClauses.push('(u.email LIKE ? OR u.displayName LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }

    const whereSql = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';

    const countSql = `SELECT COUNT(*) as count FROM dj_requests r JOIN users u ON u.id = r.userId ${whereSql}`;
    db.get(countSql, params, (err, countRow) => {
      if (err) return res.status(500).json({ error: 'Failed to count requests' });
      const total = countRow?.count || 0;

      const offset = (page - 1) * pageSize;
      const listSql = `SELECT r.id, r.userId, r.status, r.createdAt, r.processedAt, r.adminId, u.email, u.displayName FROM dj_requests r JOIN users u ON u.id = r.userId ${whereSql} ORDER BY r.createdAt DESC LIMIT ? OFFSET ?`;
      const listParams = params.concat([pageSize, offset]);

      db.all(listSql, listParams, (err2, rows) => {
        if (err2) return res.status(500).json({ error: 'Failed to list requests' });
        res.json({ requests: rows, total, page, pageSize });
      });
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
            // return the updated request record
            db.get(`SELECT r.id, r.userId, r.status, r.createdAt, r.processedAt, r.adminId, u.email, u.displayName FROM dj_requests r JOIN users u ON u.id = r.userId WHERE r.id = ?`, [requestId], (err3, updated) => {
              if (err3 || !updated) return res.status(500).json({ error: 'Failed to load updated request' });
              res.json({ request: updated });
            });
        });
      });
    });
  });
});

// admin: reject request (body: { requestId })
router.post('/reject', express.json(), (req, res) => {
  const { requestId } = req.body;
  if (!requestId) return res.status(400).json({ error: 'Missing requestId' });
  getSessionUser(req, (u) => {
    if (!u) return res.status(401).json({ error: 'Not authenticated' });
    if (u.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const processedAt = Date.now();
    db.get(`SELECT id, userId FROM dj_requests WHERE id = ?`, [requestId], (err, row) => {
      if (err || !row) return res.status(404).json({ error: 'Request not found' });
      db.run(`UPDATE dj_requests SET status = ?, processedAt = ?, adminId = ? WHERE id = ?`, ['rejected', processedAt, u.id, requestId], function (e) {
        if (e) return res.status(500).json({ error: 'Failed to update request' });
          // return the updated request
          db.get(`SELECT r.id, r.userId, r.status, r.createdAt, r.processedAt, r.adminId, u.email, u.displayName FROM dj_requests r JOIN users u ON u.id = r.userId WHERE r.id = ?`, [requestId], (err2, updated) => {
            if (err2 || !updated) return res.status(500).json({ error: 'Failed to load updated request' });
            res.json({ request: updated });
          });
      });
    });
  });
});

module.exports = router;

// get single request details
router.get('/requests/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  getSessionUser(req, (u) => {
    if (!u) return res.status(401).json({ error: 'Not authenticated' });
    if (u.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    // Use LEFT JOIN so request is returned even if the user row is missing
    db.get(`SELECT r.id, r.userId, r.status, r.createdAt, r.processedAt, r.adminId,
                   u.email AS userEmail, u.displayName AS userDisplayName, u.avatarUrl AS avatarUrl, u.bio AS bio
            FROM dj_requests r LEFT JOIN users u ON u.id = r.userId WHERE r.id = ?`, [id], (err, row) => {
      if (err) {
        console.error('DB error fetching request details', err);
        return res.status(500).json({ error: 'Failed to load request' });
      }
      if (!row) return res.status(404).json({ error: 'Request not found' });
      // normalize fields to old shape for the client
      const out = {
        id: row.id,
        userId: row.userId,
        status: row.status,
        createdAt: row.createdAt,
        processedAt: row.processedAt,
        adminId: row.adminId,
        email: row.userEmail || null,
        displayName: row.userDisplayName || null,
        avatarUrl: row.avatarUrl || null,
        bio: row.bio || null,
      };
      res.json({ request: out });
    });
  });
});
