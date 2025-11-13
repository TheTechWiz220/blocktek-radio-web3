const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { verifyMessage } = require('ethers');

const router = express.Router();

function getSessionUser(req, callback) {
  const token = req.cookies.session;
  if (!token) return callback(null);
  db.get(`SELECT userId FROM sessions WHERE token = ? AND expires > ?`, [token, Date.now()], (err, row) => {
    if (err || !row) return callback(null);
    db.get(`SELECT id,email FROM users WHERE id = ?`, [row.userId], (e, u) => {
      if (e || !u) return callback(null);
      callback(u);
    });
  });
}

// create a nonce for the authenticated user
router.post('/nonce', (req, res) => {
  getSessionUser(req, (u) => {
    if (!u) return res.status(401).json({ error: 'Not authenticated' });
    const nonce = uuidv4();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
    db.run(`INSERT INTO nonces (nonce, userId, expires) VALUES (?,?,?)`, [nonce, u.id, expires], function (err) {
      if (err) return res.status(500).json({ error: 'Failed to create nonce' });
      res.json({ nonce });
    });
  });
});

// link wallet by verifying signature
router.post('/link', express.json(), (req, res) => {
  const { signature, nonce } = req.body;
  if (!signature || !nonce) return res.status(400).json({ error: 'Missing fields' });

  getSessionUser(req, (u) => {
    if (!u) return res.status(401).json({ error: 'Not authenticated' });
    db.get(`SELECT nonce, userId, expires FROM nonces WHERE nonce = ?`, [nonce], (err, row) => {
      if (err || !row) return res.status(400).json({ error: 'Invalid nonce' });
      if (row.userId !== u.id) return res.status(400).json({ error: 'Nonce does not belong to user' });
      if (row.expires < Date.now()) return res.status(400).json({ error: 'Nonce expired' });

      // message that should have been signed
      const message = `Link wallet to BlockTek Radio account (${u.email})\n\nNonce: ${nonce}`;
      let recovered;
      try {
        recovered = verifyMessage(message, signature);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid signature' });
      }

      // store link
      const linkedAt = Date.now();
      db.run(`INSERT INTO wallet_links (userId, address, verified, linkedAt) VALUES (?,?,?,?)`, [u.id, recovered.toLowerCase(), 1, linkedAt], function (err2) {
        if (err2) return res.status(500).json({ error: 'Failed to store link' });
        // delete nonce
        db.run(`DELETE FROM nonces WHERE nonce = ?`, [nonce]);
        res.json({ ok: true, address: recovered.toLowerCase(), linkedAt });
      });
    });
  });
});

// unlink wallet for authenticated user (provide address in body)
router.post('/unlink', express.json(), (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: 'Missing address' });
  getSessionUser(req, (u) => {
    if (!u) return res.status(401).json({ error: 'Not authenticated' });
    db.run(`DELETE FROM wallet_links WHERE userId = ? AND address = ?`, [u.id, address.toLowerCase()], function (err) {
      if (err) return res.status(500).json({ error: 'Failed to unlink' });
      if (this.changes === 0) return res.status(404).json({ error: 'Link not found' });
      res.json({ ok: true });
    });
  });
});

module.exports = router;
