import express from 'express';
import Defect from '../models/Defect.js';
import Project from '../models/Project.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Получить все дефекты с фильтрацией
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      severity, 
      category, 
      project, 
      assignee, 
      page = 1, 
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (severity) filters.severity = severity;
    if (category) filters.category = category;
    if (project) filters.project = project;
    if (assignee) filters.assignee = assignee;

    const defects = await Defect.find(filters)
      .populate('project', 'name location')
      .populate('reporter', 'firstName lastName email role')
      .populate('assignee', 'firstName lastName email role')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Defect.countDocuments(filters);

    res.json({
      success: true,
      data: defects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get defects error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении дефектов'
    });
  }
});

// Получить дефект по ID
router.get('/:id', async (req, res) => {
  try {
    const defect = await Defect.findById(req.params.id)
      .populate('project', 'name location manager')
      .populate('reporter', 'firstName lastName email role avatar')
      .populate('assignee', 'firstName lastName email role avatar')
      .populate('comments.author', 'firstName lastName email role avatar')
      .populate('statusHistory.changedBy', 'firstName lastName email role');

    if (!defect) {
      return res.status(404).json({
        success: false,
        message: 'Дефект не найден'
      });
    }

    res.json({
      success: true,
      data: defect
    });
  } catch (error) {
    logger.error('Get defect error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении дефекта'
    });
  }
});

// Создать новый дефект
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      severity,
      priority,
      project,
      reporter,
      location,
      estimatedHours,
      dueDate
    } = req.body;

    // Проверяем существование проекта
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: 'Проект не найден'
      });
    }

    const defect = new Defect({
      title,
      description,
      category,
      severity,
      priority,
      project,
      reporter,
      location,
      estimatedHours,
      dueDate
    });

    // Добавляем в историю статусов
    defect.statusHistory.push({
      status: 'open',
      changedBy: reporter,
      comment: 'Дефект создан'
    });

    await defect.save();

    const populatedDefect = await Defect.findById(defect._id)
      .populate('project', 'name location')
      .populate('reporter', 'firstName lastName email role');

    logger.info(`New defect created: ${defect._id} by ${reporter}`);

    res.status(201).json({
      success: true,
      message: 'Дефект успешно создан',
      data: populatedDefect
    });
  } catch (error) {
    logger.error('Create defect error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании дефекта'
    });
  }
});

// Обновить дефект
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { userId } = req.body; // ID пользователя, вносящего изменения

    const defect = await Defect.findById(id);
    if (!defect) {
      return res.status(404).json({
        success: false,
        message: 'Дефект не найден'
      });
    }

    // Если изменяется статус, добавляем в историю
    if (updates.status && updates.status !== defect.status) {
      defect.statusHistory.push({
        status: updates.status,
        changedBy: userId,
        comment: updates.statusComment || 'Статус изменен'
      });

      // Если статус "resolved", устанавливаем дату решения
      if (updates.status === 'resolved') {
        updates.resolvedDate = new Date();
      }
    }

    // Обновляем дефект
    Object.keys(updates).forEach(key => {
      if (key !== 'statusComment' && key !== 'userId') {
        defect[key] = updates[key];
      }
    });

    await defect.save();

    const updatedDefect = await Defect.findById(id)
      .populate('project', 'name location')
      .populate('reporter', 'firstName lastName email role')
      .populate('assignee', 'firstName lastName email role');

    logger.info(`Defect updated: ${id} by ${userId}`);

    res.json({
      success: true,
      message: 'Дефект успешно обновлен',
      data: updatedDefect
    });
  } catch (error) {
    logger.error('Update defect error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении дефекта'
    });
  }
});

// Добавить комментарий к дефекту
router.post('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, author, isInternal = false } = req.body;

    const defect = await Defect.findById(id);
    if (!defect) {
      return res.status(404).json({
        success: false,
        message: 'Дефект не найден'
      });
    }

    defect.comments.push({
      content,
      author,
      isInternal
    });

    await defect.save();

    const updatedDefect = await Defect.findById(id)
      .populate('comments.author', 'firstName lastName email role avatar');

    logger.info(`Comment added to defect: ${id} by ${author}`);

    res.json({
      success: true,
      message: 'Комментарий добавлен',
      data: updatedDefect.comments[updatedDefect.comments.length - 1]
    });
  } catch (error) {
    logger.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при добавлении комментария'
    });
  }
});

// Статистика дефектов
router.get('/stats/dashboard', async (req, res) => {
  try {
    const { project } = req.query;
    const filters = project ? { project } : {};

    const stats = await Promise.all([
      // Статусы
      Defect.aggregate([
        { $match: filters },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      // Приоритеты
      Defect.aggregate([
        { $match: filters },
        { $group: { _id: '$severity', count: { $sum: 1 } } }
      ]),
      // Категории
      Defect.aggregate([
        { $match: filters },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      // Общая статистика
      Defect.countDocuments(filters),
      Defect.countDocuments({ ...filters, status: 'open' }),
      Defect.countDocuments({ ...filters, severity: 'critical' }),
      Defect.countDocuments({ 
        ...filters, 
        dueDate: { $lt: new Date() }, 
        status: { $nin: ['resolved', 'closed'] } 
      })
    ]);

    res.json({
      success: true,
      data: {
        byStatus: stats[0],
        bySeverity: stats[1],
        byCategory: stats[2],
        total: stats[3],
        open: stats[4],
        critical: stats[5],
        overdue: stats[6]
      }
    });
  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении статистики'
    });
  }
});

export default router;