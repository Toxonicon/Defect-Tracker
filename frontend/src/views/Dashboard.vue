<template>
  <div class="dashboard">
    <h1>Добро пожаловать в Defect Tracker</h1>
    <div class="stats">
      <div class="stat-card">
        <h3>Общие дефекты</h3>
        <p class="number">42</p>
      </div>
      <div class="stat-card">
        <h3>Активные проекты</h3>
        <p class="number">8</p>
      </div>
      <div class="stat-card">
        <h3>Решенные дефекты</h3>
        <p class="number">156</p>
      </div>
    </div>
    <div class="actions">
      <button class="btn btn-primary">Создать дефект</button>
      <button class="btn btn-secondary">Просмотреть проекты</button>
    </div>
  </div>
</template>

<script setup>
// Простой дашборд
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-card h3 {
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.number {
  font-size: 2rem;
  font-weight: bold;
  color: #0891b2;
  margin: 0;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #0891b2;
  color: white;
}

.btn-primary:hover {
  background: #0e7490;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}
</style>
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-card h3 {
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.number {
  font-size: 2rem;
  font-weight: bold;
  color: #0891b2;
  margin: 0;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #0891b2;
  color: white;
}

.btn-primary:hover {
  background: #0e7490;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}
</style>

    <!-- Quick Stats -->
    <div class="stats-grid">
      <div class="stat-card stat-card-primary">
        <div class="stat-content">
          <div class="stat-info">
            <p class="stat-label">Всего дефектов</p>
            <p class="stat-value">{{ stats.total || 0 }}</p>
            <div class="stat-trend">
              <span class="trend-icon">▲</span>
              <span class="trend-text">Общий объем</span>
            </div>
          </div>
          <div class="stat-icon-container stat-icon-primary">
            <span class="stat-icon">�</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card-warning">
        <div class="stat-content">
          <div class="stat-info">
            <p class="stat-label">Открытые</p>
            <p class="stat-value">{{ stats.open || 0 }}</p>
            <div class="stat-trend">
              <span class="trend-icon">●</span>
              <span class="trend-text">Требуют внимания</span>
            </div>
          </div>
          <div class="stat-icon-container stat-icon-warning">
            <span class="stat-icon">⚠</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card-danger">
        <div class="stat-content">
          <div class="stat-info">
            <p class="stat-label">Критические</p>
            <p class="stat-value">{{ stats.critical || 0 }}</p>
            <div class="stat-trend">
              <span class="trend-icon">!</span>
              <span class="trend-text">Высокий приоритет</span>
            </div>
          </div>
          <div class="stat-icon-container stat-icon-danger">
            <span class="stat-icon">✕</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card-purple">
        <div class="stat-content">
          <div class="stat-info">
            <p class="stat-label">Просроченные</p>
            <p class="stat-value">{{ stats.overdue || 0 }}</p>
            <div class="stat-trend">
              <span class="trend-icon">!</span>
              <span class="trend-text">Срочное решение</span>
            </div>
          </div>
          <div class="stat-icon-container stat-icon-purple">
            <span class="stat-icon">⏱</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <!-- Status Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <span class="chart-icon">📊</span>
            Статусы дефектов
          </h3>
        </div>
        <div class="chart-body">
          <div v-if="stats.byStatus && stats.byStatus.length > 0" class="status-chart">
            <div v-for="item in stats.byStatus" :key="item._id" class="status-item">
              <div class="status-info">
                <div class="status-indicator" :class="getStatusColor(item._id)"></div>
                <span class="status-label">{{ getStatusLabel(item._id) }}</span>
              </div>
              <div class="status-count">
                <span class="count-number">{{ item.count }}</span>
                <div class="count-bar">
                  <div class="count-progress" :style="{ width: `${(item.count / stats.total) * 100}%` }" :class="getStatusColor(item._id)"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <span class="empty-icon">📊</span>
            <p class="empty-text">Нет данных для отображения</p>
          </div>
        </div>
      </div>

      <!-- Severity Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <span class="chart-icon">⚡</span>
            Критичность дефектов
          </h3>
        </div>
        <div class="chart-body">
          <div v-if="stats.bySeverity && stats.bySeverity.length > 0" class="severity-chart">
            <div v-for="item in stats.bySeverity" :key="item._id" class="severity-item">
              <div class="severity-info">
                <div class="severity-indicator" :class="getSeverityColor(item._id)"></div>
                <span class="severity-label">{{ getSeverityLabel(item._id) }}</span>
              </div>
              <div class="severity-count">
                <span class="count-number">{{ item.count }}</span>
                <div class="count-bar">
                  <div class="count-progress" :style="{ width: `${(item.count / stats.total) * 100}%` }" :class="getSeverityColor(item._id)"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <span class="empty-icon">⚡</span>
            <p class="empty-text">Нет данных для отображения</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="actions-card">
      <div class="actions-header">
        <h3 class="actions-title">
          <span class="actions-icon">⚡</span>
          Быстрые действия
        </h3>
      </div>
      <div class="actions-body">
        <div class="actions-grid">
          <router-link to="/defects/create" class="action-button action-primary">
            <span class="action-icon">+</span>
            <span class="action-text">Создать дефект</span>
          </router-link>
          <router-link to="/defects" class="action-button action-secondary">
            <span class="action-icon">≡</span>
            <span class="action-text">Все дефекты</span>
          </router-link>
          <router-link to="/projects" class="action-button action-tertiary">
            <span class="action-icon">▣</span>
            <span class="action-text">Проекты</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const authStore = useAuthStore()
const stats = ref({})

const getStatusColor = (status) => {
  const colors = {
    open: 'bg-yellow-400',
    assigned: 'bg-blue-400',
    'in-progress': 'bg-purple-400',
    testing: 'bg-orange-400',
    resolved: 'bg-green-400',
    closed: 'bg-gray-400',
    rejected: 'bg-red-400'
  }
  return colors[status] || 'bg-gray-400'
}

const getStatusLabel = (status) => {
  const labels = {
    open: 'Открыт',
    assigned: 'Назначен',
    'in-progress': 'В работе',
    testing: 'Тестирование',
    resolved: 'Решен',
    closed: 'Закрыт',
    rejected: 'Отклонен'
  }
  return labels[status] || status
}

const getSeverityColor = (severity) => {
  const colors = {
    low: 'bg-green-400',
    medium: 'bg-yellow-400',
    high: 'bg-orange-400',
    critical: 'bg-red-400'
  }
  return colors[severity] || 'bg-gray-400'
}

const getSeverityLabel = (severity) => {
  const labels = {
    low: 'Низкая',
    medium: 'Средняя',
    high: 'Высокая',
    critical: 'Критическая'
  }
  return labels[severity] || severity
}

const loadStats = async () => {
  try {
    const response = await api.get('/defects/stats/dashboard')
    if (response.data.success) {
      stats.value = response.data.data
    }
  } catch (error) {
    console.error('Error loading stats:', error)
    // Mock data for demo
    stats.value = {
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
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Welcome Section */
.welcome-section {
  background: linear-gradient(135deg, 
    #0891b2 0%, 
    #06b6d4 25%, 
    #0ea5e9 50%, 
    #3b82f6 75%, 
    #6366f1 100%);
  border-radius: 24px;
  padding: 32px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(8, 145, 178, 0.3);
}

.welcome-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
  pointer-events: none;
}

.welcome-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.welcome-text {
  flex: 1;
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.welcome-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
}

.welcome-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-icon {
  font-size: 48px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.stat-card {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(248, 250, 252, 0.8) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(148, 163, 184, 0.1);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card-primary::before {
  background: linear-gradient(90deg, #0891b2, #06b6d4);
}

.stat-card-warning::before {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.stat-card-danger::before {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

.stat-card-purple::before {
  background: linear-gradient(90deg, #8b5cf6, #a78bfa);
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 6px;
}

.trend-icon {
  font-size: 14px;
}

.trend-text {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.stat-icon-container {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-icon-primary {
  background: linear-gradient(135deg, #0891b2, #06b6d4);
}

.stat-icon-warning {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.stat-icon-danger {
  background: linear-gradient(135deg, #ef4444, #f87171);
}

.stat-icon-purple {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
}

.stat-icon {
  font-size: 28px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-card {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(248, 250, 252, 0.8) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(148, 163, 184, 0.1);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.chart-header {
  padding: 24px 24px 0 24px;
  border-bottom: 2px solid rgba(148, 163, 184, 0.1);
  background: linear-gradient(135deg, 
    rgba(8, 145, 178, 0.05) 0%, 
    rgba(255, 255, 255, 0.8) 100%);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.chart-icon {
  font-size: 20px;
}

.chart-body {
  padding: 24px;
}

.status-chart,
.severity-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-item,
.severity-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}

.status-info,
.severity-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.status-indicator,
.severity-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.status-label,
.severity-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.status-count,
.severity-count {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 80px;
}

.count-number {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  min-width: 32px;
  text-align: right;
}

.count-bar {
  width: 60px;
  height: 6px;
  background: rgba(148, 163, 184, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.count-progress {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* Status Colors */
.bg-yellow-400 { background-color: #fbbf24; }
.bg-blue-400 { background-color: #60a5fa; }
.bg-purple-400 { background-color: #a78bfa; }
.bg-orange-400 { background-color: #fb923c; }
.bg-green-400 { background-color: #4ade80; }
.bg-gray-400 { background-color: #9ca3af; }
.bg-red-400 { background-color: #f87171; }

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
  margin-bottom: 16px;
}

.empty-text {
  color: #64748b;
  font-size: 16px;
}

/* Actions Card */
.actions-card {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(248, 250, 252, 0.8) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(148, 163, 184, 0.1);
  border-radius: 20px;
  overflow: hidden;
}

.actions-header {
  padding: 24px 24px 0 24px;
  border-bottom: 2px solid rgba(148, 163, 184, 0.1);
  background: linear-gradient(135deg, 
    rgba(8, 145, 178, 0.05) 0%, 
    rgba(255, 255, 255, 0.8) 100%);
}

.actions-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.actions-icon {
  font-size: 20px;
}

.actions-body {
  padding: 24px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.action-button:hover::before {
  left: 100%;
}

.action-primary {
  background: linear-gradient(135deg, #0891b2, #06b6d4);
  color: white;
  box-shadow: 0 4px 15px rgba(8, 145, 178, 0.3);
}

.action-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(8, 145, 178, 0.4);
}

.action-secondary {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
  box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3);
}

.action-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(107, 114, 128, 0.4);
}

.action-tertiary {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.action-tertiary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

.action-icon {
  font-size: 18px;
}

.action-text {
  font-size: 14px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    gap: 24px;
  }
  
  .welcome-section {
    padding: 24px;
  }
  
  .welcome-title {
    font-size: 24px;
  }
  
  .welcome-subtitle {
    font-size: 16px;
  }
  
  .floating-icon {
    font-size: 60px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-value {
    font-size: 28px;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .chart-header,
  .chart-body,
  .actions-header,
  .actions-body {
    padding: 20px;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .welcome-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .stat-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }
  
  .status-item,
  .severity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .status-count,
  .severity-count {
    align-self: stretch;
    justify-content: space-between;
  }
}
</style>