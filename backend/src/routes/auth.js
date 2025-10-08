import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Регистрация пользователя
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, position, phone } = req.body;

    // Проверяем существует ли пользователь
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким email уже существует'
      });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 12);

    // Создаем пользователя
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      position,
      phone
    });

    await user.save();

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        position: user.position,
        phone: user.phone
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при регистрации пользователя'
    });
  }
});

// Авторизация
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Находим пользователя
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Неверный email или пароль'
      });
    }

    // Проверяем пароль
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Неверный email или пароль'
      });
    }

    // Обновляем время последнего входа
    user.lastLogin = new Date();
    await user.save();

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Авторизация успешна',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        position: user.position,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при авторизации'
    });
  }
});

// Получение профиля пользователя
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Токен не предоставлен'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        position: user.position,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (error) {
    logger.error('Profile error:', error);
    res.status(401).json({
      success: false,
      message: 'Недействительный токен'
    });
  }
});

export default router;