// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const authRouter = require('./routes/auth');
const defectsRouter = require('./routes/defects');
const { authMiddleware } = require('./middleware/auth');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static uploads
const uploadsPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
app.use('/uploads', express.static(uploadsPath));

// routes
app.use('/api/auth', authRouter);

// protect defects routes
app.use('/api/defects', authMiddleware, defectsRouter);

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// seed default users & example project if DB empty
async function seed() {
  try {
    const { rows } = await db.query('SELECT COUNT(*)::int AS cnt FROM users');
    const cnt = rows[0].cnt;
    if (cnt === 0) {
      const bcrypt = require('bcryptjs');
      const hash1 = await bcrypt.hash('password123', 10);
      const hash2 = await bcrypt.hash('password123', 10);
      const m = await db.query(
        'INSERT INTO users (email, password_hash, name, role) VALUES ($1,$2,$3,$4) RETURNING id',
        ['manager@example.com', hash1, 'Manager', 'manager']
      );
      const e = await db.query(
        'INSERT INTO users (email, password_hash, name, role) VALUES ($1,$2,$3,$4) RETURNING id',
        ['engineer@example.com', hash2, 'Engineer', 'engineer']
      );
      const managerId = m.rows[0].id;
      await db.query('INSERT INTO projects (title, description, created_by) VALUES ($1,$2,$3)', [
        'Demo Project',
        'Project created by seed',
        managerId
      ]);
      console.log('Seeded default users: manager@example.com / engineer@example.com (password123)');
    }
  } catch (err) {
    console.error('Seed error', err);
  }
}

app.listen(PORT, async () => {
  console.log(`Backend listening on http://0.0.0.0:${PORT}`);
  await seed();
});
