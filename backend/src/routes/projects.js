import express from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Получить все проекты
router.get('/', async (req, res) => {
  try {
    const { status, manager, page = 1, limit = 20 } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (manager) filters.manager = manager;

    const projects = await Project.find(filters)
      .populate('manager', 'firstName lastName email role')
      .populate('engineers', 'firstName lastName email role')
      .populate('supervisors', 'firstName lastName email role')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(filters);

    res.json({
      success: true,
      data: projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении проектов'
    });
  }
});

// Создать новый проект
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      manager,
      engineers,
      supervisors,
      startDate,
      endDate,
      budget,
      priority
    } = req.body;

    const project = new Project({
      name,
      description,
      location,
      manager,
      engineers,
      supervisors,
      startDate,
      endDate,
      budget,
      priority
    });

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('manager', 'firstName lastName email role')
      .populate('engineers', 'firstName lastName email role')
      .populate('supervisors', 'firstName lastName email role');

    logger.info(`New project created: ${project._id}`);

    res.status(201).json({
      success: true,
      message: 'Проект успешно создан',
      data: populatedProject
    });
  } catch (error) {
    logger.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании проекта'
    });
  }
});

// Получить проект по ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('manager', 'firstName lastName email role position phone')
      .populate('engineers', 'firstName lastName email role position phone')
      .populate('supervisors', 'firstName lastName email role position phone');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Проект не найден'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    logger.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении проекта'
    });
  }
});

export default router;