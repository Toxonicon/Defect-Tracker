const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../services/db');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Настройка хранилища файлов для аватаров
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../../uploads', new Date().toISOString().slice(0, 7));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

/**
 * @route GET /api/users/profile
 * @desc Получение профиля текущего пользователя
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await db.query(
      `SELECT id, email, first_name, last_name, role, created_at 
       FROM users 
       WHERE id = $1`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }
    
    res.json({
      success: true,
      profile: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

/**
 * @route PUT /api/users/profile
 * @desc Обновление профиля пользователя
 */
router.put('/profile', authMiddleware, [
  body('first_name').optional().isString().trim().isLength({ max: 100 }),
  body('last_name').optional().isString().trim().isLength({ max: 100 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации данных',
        errors: errors.array()
      });
    }
    
    const userId = req.user.id;
    const { first_name, last_name } = req.body;
    
    let updateFields = [];
    let queryParams = [];
    let paramIndex = 1;
    
    if (first_name !== undefined) {
      updateFields.push(`first_name = $${paramIndex}`);
      queryParams.push(first_name);
      paramIndex++;
    }
    
    if (last_name !== undefined) {
      updateFields.push(`last_name = $${paramIndex}`);
      queryParams.push(last_name);
      paramIndex++;
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Не переданы данные для обновления'
      });
    }
    
    queryParams.push(userId);
    
    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, first_name, last_name, role, created_at
    `;
    
    const result = await db.query(updateQuery, queryParams);
    
    res.json({
      success: true,
      message: 'Профиль успешно обновлен',
      profile: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

/**
 * @route PUT /api/users/change-password
 * @desc Изменение пароля пользователя
 */
router.put('/change-password', authMiddleware, [
  body('currentPassword').notEmpty().withMessage('Текущий пароль обязателен'),
  body('newPassword').isLength({ min: 6 }).withMessage('Новый пароль должен быть не менее 6 символов')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации данных',
        errors: errors.array()
      });
    }
    
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    const userResult = await db.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }
    
    const isPasswordValid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Текущий пароль неверен'
      });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, userId]);
    
    res.json({
      success: true,
      message: 'Пароль успешно обновлен'
    });
  } catch (error) {
    console.error('Ошибка при обновлении пароля:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

/**
 * @route POST /api/users/avatar
 * @desc Загрузка аватара пользователя (функция отключена, т.к. нет поля avatar в БД)
 */
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    return res.status(501).json({
      success: false,
      message: 'Функция загрузки аватара временно недоступна'
    });
  } catch (error) {
    console.error('Ошибка при загрузке аватара:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

/**
 * @route GET /api/users
 * @desc Получение всех пользователей
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Параметры пагинации и сортировки
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'desc';

    // Параметры фильтрации
    const { search, role } = req.query;
    
    // Построение запроса с фильтрами (только существующие поля)
    let query = `
      SELECT id, email, first_name, last_name, role, position, department, created_at, updated_at
      FROM users
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;
    
    if (search) {
      query += ` AND (email ILIKE $${paramIndex} OR first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }
    
    if (role) {
      query += ` AND role = $${paramIndex}`;
      queryParams.push(role);
      paramIndex++;
    }
    
    // Валидация полей сортировки
    const validSortColumns = ['created_at', 'email', 'first_name', 'last_name', 'role'];
    const validSortDirections = ['asc', 'desc'];
    
    const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = validSortDirections.includes(sortOrder.toLowerCase()) ? sortOrder : 'desc';
    
    query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);
    
    const result = await db.query(query, queryParams);
    
    // Запрос для получения общего количества
    let countQuery = `SELECT COUNT(*) AS total FROM users WHERE 1=1`;
    const countParams = [];
    
    if (search) {
      countQuery += ` AND (email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1)`;
      countParams.push(`%${search}%`);
    }
    
    if (role) {
      countQuery += search ? ` AND role = $2` : ` AND role = $1`;
      countParams.push(role);
    }
    
    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Ошибка при получении списка пользователей:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении пользователей',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/users
 * @desc Создание нового пользователя (только для админа)
 */
router.post('/', authMiddleware, [
  body('email').isEmail().withMessage('Введите корректный email'),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов'),
  body('first_name').optional().isString().trim().isLength({ max: 100 }),
  body('last_name').optional().isString().trim().isLength({ max: 100 }),
  body('role').isIn(['admin', 'manager', 'engineer', 'observer']).withMessage('Некорректная роль'),
], async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'У вас нет прав для создания пользователей'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации данных',
        errors: errors.array()
      });
    }
    
    const { email, password, first_name, last_name, role } = req.body;
    
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким email уже существует'
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.query(
      `INSERT INTO users 
       (email, password_hash, first_name, last_name, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, first_name, last_name, role, created_at`,
      [email, hashedPassword, first_name, last_name, role]
    );
    
    res.status(201).json({
      success: true,
      message: 'Пользователь успешно создан',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

/**
 * @route GET /api/users/:id
 * @desc Получение информации о пользователе по ID
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный ID пользователя'
      });
    }
    
    if (req.user.role !== 'admin' && req.user.role !== 'manager' && req.user.id !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'У вас нет прав для просмотра этой информации' 
      });
    }
    
    const result = await db.query(
      'SELECT id, email, first_name, last_name, role, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Пользователь не найден' 
      });
    }
    
    res.json({
      success: true,
      user: result.rows[0]
    });
    
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

/**
 * @route PUT /api/users/:id
 * @desc Обновление пользователя (только для админа)
 */
router.put('/:id', authMiddleware, [
  body('email').optional().isEmail().withMessage('Введите корректный email'),
  body('password').optional().isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов'),
  body('first_name').optional().isString().trim().isLength({ max: 100 }),
  body('last_name').optional().isString().trim().isLength({ max: 100 }),
  body('role').optional().isIn(['admin', 'manager', 'engineer', 'observer']).withMessage('Некорректная роль'),
], async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'У вас нет прав для обновления пользователей'
      });
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации данных',
        errors: errors.array()
      });
    }
    
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный ID пользователя'
      });
    }
    
    const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }
    
    const { email, password, first_name, last_name, role } = req.body;
    
    let updateFields = [];
    let queryParams = [];
    let paramIndex = 1;
    
    if (email !== undefined) {
      const emailCheck = await db.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, userId]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Пользователь с таким email уже существует'
        });
      }
      
      updateFields.push(`email = $${paramIndex}`);
      queryParams.push(email);
      paramIndex++;
    }
    
    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push(`password_hash = $${paramIndex}`);
      queryParams.push(hashedPassword);
      paramIndex++;
    }
    
    if (first_name !== undefined) {
      updateFields.push(`first_name = $${paramIndex}`);
      queryParams.push(first_name);
      paramIndex++;
    }
    
    if (last_name !== undefined) {
      updateFields.push(`last_name = $${paramIndex}`);
      queryParams.push(last_name);
      paramIndex++;
    }
    
    if (role !== undefined) {
      updateFields.push(`role = $${paramIndex}`);
      queryParams.push(role);
      paramIndex++;
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Не переданы данные для обновления'
      });
    }
    
    queryParams.push(userId);
    
    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, email, first_name, last_name, role, created_at, updated_at
    `;
    
    const result = await db.query(updateQuery, queryParams);
    
    res.json({
      success: true,
      message: 'Пользователь успешно обновлен',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

/**
 * @route DELETE /api/users/:id
 * @desc Удаление пользователя (только для админа)
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'У вас нет прав для удаления пользователей'
      });
    }
    
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный ID пользователя'
      });
    }
    
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Вы не можете удалить свой собственный аккаунт'
      });
    }
    
    const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }
    
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
    
    res.json({
      success: true,
      message: 'Пользователь успешно удален'
    });
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

module.exports = router;