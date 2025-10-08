<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-primary-500 to-cyan-600 rounded-xl p-6 text-white">
      <h1 class="text-2xl font-bold mb-2">
        Добро пожаловать, {{ authStore.user?.firstName }}! 👋
      </h1>
      <p class="text-primary-100">
        Панель управления дефектами строительных объектов
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">Всего дефектов</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">🐛</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">Открытые</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.open || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">Критические</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.critical || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">🚨</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">Просроченные</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.overdue || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">⏰</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Status Chart -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">Статусы дефектов</h3>
        </div>
        <div class="card-body">
          <div v-if="stats.byStatus && stats.byStatus.length > 0" class="space-y-3">
            <div v-for="item in stats.byStatus" :key="item._id" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full" :class="getStatusColor(item._id)"></div>
                <span class="text-sm text-gray-600">{{ getStatusLabel(item._id) }}</span>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ item.count }}</span>
            </div>
          </div>
          <div v-else class="text-center text-gray-500 py-8">
            Нет данных для отображения
          </div>
        </div>
      </div>

      <!-- Severity Chart -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">Критичность дефектов</h3>
        </div>
        <div class="card-body">
          <div v-if="stats.bySeverity && stats.bySeverity.length > 0" class="space-y-3">
            <div v-for="item in stats.bySeverity" :key="item._id" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full" :class="getSeverityColor(item._id)"></div>
                <span class="text-sm text-gray-600">{{ getSeverityLabel(item._id) }}</span>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ item.count }}</span>
            </div>
          </div>
          <div v-else class="text-center text-gray-500 py-8">
            Нет данных для отображения
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-gray-900">Быстрые действия</h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <router-link to="/defects/create" class="btn-primary">
            ➕ Создать дефект
          </router-link>
          <router-link to="/defects" class="btn-outline">
            📋 Все дефекты
          </router-link>
          <router-link to="/projects" class="btn-outline">
            🏗️ Проекты
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