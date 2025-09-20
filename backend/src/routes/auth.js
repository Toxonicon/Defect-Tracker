// routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email & password required' });
    const { rows } = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (rows.length) return res.status(400).json({ error: 'User exists' });
    const hash = await bcrypt.hash(password, 10);
    const r = await db.query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1,$2,$3,$4) RETURNING id,email,name,role',
      [email, hash, name || null, role || 'engineer']
    );
    const user = r.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { rows } = await db.query('SELECT id,email,password_hash,name,role FROM users WHERE email = $1', [email]);
    if (!rows.length) return res.status(400).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
