// Mock API Service для демонстрации без реального бэкенда
class MockApiService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api'
    this.token = localStorage.getItem('auth_token')
    
    // Mock данные
    this.mockUsers = [
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
    ]

    this.mockStats = {
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
    }

    this.mockProjects = [
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
    ]

    this.mockDefects = [
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
    ]
  }

  // Имитация задержки сети
  delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Mock успешный ответ
  mockResponse(data, success = true) {
    return {
      data: {
        success,
        data,
        message: success ? 'Операция выполнена успешно' : 'Произошла ошибка'
      }
    }
  }

  // Аутентификация
  async login(credentials) {
    await this.delay(800)
    
    const user = this.mockUsers.find(u => u.email === credentials.email)
    
    if (user && credentials.password === 'password') {
      const token = 'mock_jwt_token_' + Date.now()
      localStorage.setItem('auth_token', token)
      this.token = token
      
      return this.mockResponse({
        user,
        token
      })
    }
    
    throw new Error('Неверные учетные данные')
  }

  async logout() {
    await this.delay(200)
    localStorage.removeItem('auth_token')
    this.token = null
    return this.mockResponse(null)
  }

  async getCurrentUser() {
    await this.delay(300)
    
    if (!this.token) {
      throw new Error('Не авторизован')
    }
    
    // Возвращаем первого пользователя как текущего
    return this.mockResponse(this.mockUsers[0])
  }

  // Статистика
  async get(endpoint) {
    await this.delay(400)
    
    if (endpoint === '/defects/stats/dashboard') {
      return this.mockResponse(this.mockStats)
    }
    
    if (endpoint === '/projects') {
      return this.mockResponse(this.mockProjects)
    }
    
    if (endpoint === '/defects') {
      return this.mockResponse(this.mockDefects)
    }
    
    return this.mockResponse([])
  }

  async post(endpoint, data) {
    await this.delay(600)
    
    if (endpoint === '/auth/login') {
      return this.login(data)
    }
    
    return this.mockResponse({ id: Date.now(), ...data })
  }

  async put(endpoint, data) {
    await this.delay(500)
    return this.mockResponse({ ...data, updatedAt: new Date().toISOString() })
  }

  async delete(endpoint) {
    await this.delay(400)
    return this.mockResponse(null)
  }
}

export default new MockApiService()