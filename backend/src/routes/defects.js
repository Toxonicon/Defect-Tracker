// routes/defects.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: path.join(__dirname, '../../uploads/'),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

// List defects (filtering)
router.get('/', async (req, res) => {
  try {
    const { status, priority, project } = req.query;
    const q = `
      SELECT d.*, p.title as project_title,
        rep.email as reporter_email, assignee.email as assignee_email
      FROM defects d
      LEFT JOIN projects p ON p.id = d.project_id
      LEFT JOIN users rep ON rep.id = d.reporter_id
      LEFT JOIN users assignee ON assignee.id = d.assignee_id
      WHERE ($1::text IS NULL OR d.status = $1)
        AND ($2::text IS NULL OR d.priority = $2)
        AND ($3::int IS NULL OR d.project_id = $3)
      ORDER BY d.created_at DESC
      LIMIT 100
    `;
    const params = [status || null, priority || null, project ? Number(project) : null];
    const { rows } = await db.query(q, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Create defect (with files)
router.post('/', upload.array('attachments'), async (req, res) => {
  try {
    const { title, description, projectId, priority, assigneeId, dueDate } = req.body;
    if (!title) return res.status(400).json({ error: 'title required' });

    const insertQ = `INSERT INTO defects
      (project_id, title, description, priority, reporter_id, assignee_id, due_date)
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    const params = [
      projectId ? Number(projectId) : null,
      title,
      description || null,
      priority || 'medium',
      req.user ? req.user.id : null,
      assigneeId ? Number(assigneeId) : null,
      dueDate ? dueDate : null
    ];
    const { rows } = await db.query(insertQ, params);
    const defect = rows[0];

    // attachments
    if (req.files && req.files.length) {
      for (const f of req.files) {
        const url = `/uploads/${f.filename}`;
        await db.query(
          'INSERT INTO attachments (defect_id, filename, original_name, url, uploaded_by) VALUES ($1,$2,$3,$4,$5)',
          [defect.id, f.filename, f.originalname, url, req.user ? req.user.id : null]
        );
      }
    }

    res.status(201).json(defect);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Get detail
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { rows } = await db.query('SELECT * FROM defects WHERE id = $1', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const defect = rows[0];
    const { rows: atts } = await db.query('SELECT * FROM attachments WHERE defect_id = $1', [id]);
    const { rows: comments } = await db.query(
      'SELECT c.*, u.email, u.name FROM comments c LEFT JOIN users u ON u.id = c.user_id WHERE c.defect_id = $1 ORDER BY c.created_at ASC',
      [id]
    );
    res.json({ ...defect, attachments: atts, comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Add comment
router.post('/:id/comments', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content required' });
    const { rows } = await db.query(
      'INSERT INTO comments (defect_id, user_id, content) VALUES ($1,$2,$3) RETURNING *',
      [id, req.user ? req.user.id : null, content]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
