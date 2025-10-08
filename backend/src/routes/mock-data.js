// Mock data routes for development without database
import express from 'express';

const router = express.Router();

// Mock users data
const mockUsers = [
  {
    id: 1,
    email: 'engineer@example.com',
    firstName: 'Иван',
    lastName: 'Инженеров',
    fullName: 'Иван Инженеров',
    role: 'engineer',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: 'manager@example.com', 
    firstName: 'Анна',
    lastName: 'Менеджерова',
    fullName: 'Анна Менеджерова',
    role: 'manager',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    email: 'supervisor@example.com',
    firstName: 'Петр',
    lastName: 'Супервайзеров',
    fullName: 'Петр Супервайзеров',
    role: 'supervisor',
    createdAt: new Date().toISOString()
  }
];

// Mock defect statistics
const mockStats = {
  total: 156,
  open: 28,
  critical: 12,
  overdue: 5,
  byStatus: [
    { _id: 'open', count: 28 },
    { _id: 'in-progress', count: 45 },
    { _id: 'resolved', count: 67 },
    { _id: 'closed', count: 16 }
  ],
  bySeverity: [
    { _id: 'low', count: 45 },
    { _id: 'medium', count: 67 },
    { _id: 'high', count: 32 },
    { _id: 'critical', count: 12 }
  ]
};

// Mock projects
const mockProjects = [
  {
    id: 1,
    name: 'ЖК "Солнечный"',
    description: 'Многоэтажный жилой комплекс',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Торговый центр "Галерея"',
    description: 'Современный торгово-развлекательный центр',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

// Mock defects
const mockDefects = [
  {
    id: 1,
    title: 'Трещина в стене',
    description: 'Обнаружена трещина в несущей стене',
    severity: 'high',
    status: 'open',
    projectId: 1,
    assignedToId: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Протечка в потолке',
    description: 'Вода капает с потолка в квартире',
    severity: 'critical',
    status: 'in-progress',
    projectId: 1,
    assignedToId: 2,
    createdAt: new Date().toISOString()
  }
];

// Auth routes
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock authentication
  const user = mockUsers.find(u => u.email === email);
  
  if (user && password === 'password') {
    const token = 'mock_jwt_token_' + Date.now();
    res.json({
      success: true,
      data: {
        user,
        token
      },
      message: 'Успешный вход'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Неверные учетные данные'
    });
  }
});

router.get('/auth/me', (req, res) => {
  // Return first user as current user for demo
  res.json({
    success: true,
    data: mockUsers[0],
    message: 'Пользователь получен'
  });
});

// Defects routes
router.get('/defects/stats/dashboard', (req, res) => {
  res.json({
    success: true,
    data: mockStats,
    message: 'Статистика получена'
  });
});

router.get('/defects', (req, res) => {
  res.json({
    success: true,
    data: mockDefects,
    message: 'Дефекты получены'
  });
});

// Projects routes
router.get('/projects', (req, res) => {
  res.json({
    success: true,
    data: mockProjects,
    message: 'Проекты получены'
  });
});

export default router;