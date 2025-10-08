<template>
  <!-- Частицы в фоне -->
  <div class="particles" ref="particlesContainer"></div>
  
  <div class="min-h-screen relative overflow-hidden">
    <!-- Супер красивый главный контейнер -->
    <div class="container mx-auto px-4 py-8 relative z-10">
      <!-- Магический заголовок -->
      <div class="text-center mb-12 floating">
        <h1 class="text-6xl font-black mb-6 neon-glow holographic">
          Defect Tracker Pro
        </h1>
        <p class="text-xl text-white-80 mb-8 max-w-2xl mx-auto">
          Революционная система управления дефектами с безумно красивым интерфейсом
        </p>
        
        <!-- 3D Flip карточка с общей статистикой -->
        <div class="flip-card max-w-md mx-auto mb-8">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <div class="animated-icon">📊</div>
              <h3 class="text-2xl font-bold text-white mt-4">Общая статистика</h3>
              <p class="text-white-70 mt-2">Наведите для деталей</p>
            </div>
            <div class="flip-card-back">
              <div class="text-white">
                <h3 class="text-xl font-bold mb-4">Активная статистика</h3>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div class="text-2xl font-bold">{{ stats.total }}</div>
                    <div>Всего дефектов</div>
                  </div>
                  <div>
                    <div class="text-2xl font-bold">{{ stats.active }}</div>
                    <div>Активных</div>
                  </div>
                  <div>
                    <div class="text-2xl font-bold">{{ stats.resolved }}</div>
                    <div>Решенных</div>
                  </div>
                  <div>
                    <div class="text-2xl font-bold">{{ stats.critical }}</div>
                    <div>Критических</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Быстрые действия с невероятными эффектами -->
      <div class="grid md-grid-cols-3 gap-8 mb-12">
        <div class="card pulse hover-scale-105 transition-all duration-500">
          <div class="card-body">
            <div class="animated-icon mb-4">🚀</div>
            <h3 class="text-2xl font-bold text-white mb-4">Создать дефект</h3>
            <p class="text-white-70 mb-6">
              Добавьте новый дефект с супер-быстрой формой
            </p>
            <router-link to="/defects/create" class="btn btn-primary">
              ✨ Создать
            </router-link>
          </div>
        </div>

        <div class="card pulse hover-scale-105 transition-all duration-500" style="animation-delay: 0.2s;">
          <div class="card-body">
            <div class="animated-icon mb-4">📋</div>
            <h3 class="text-2xl font-bold text-white mb-4">Все дефекты</h3>
            <p class="text-white-70 mb-6">
              Управляйте всеми дефектами в одном месте
            </p>
            <router-link to="/defects" class="btn btn-secondary">
              🔍 Просмотреть
            </router-link>
          </div>
        </div>

        <div class="card pulse hover-scale-105 transition-all duration-500" style="animation-delay: 0.4s;">
          <div class="card-body">
            <div class="animated-icon mb-4">📊</div>
            <h3 class="text-2xl font-bold text-white mb-4">Аналитика</h3>
            <p class="text-white-70 mb-6">
              Глубокая аналитика и красивые отчеты
            </p>
            <button class="btn btn-success" @click="showAnalytics = true">
              📈 Аналитика
            </button>
          </div>
        </div>
      </div>

      <!-- Последние дефекты с неоновыми эффектами -->
      <div class="card mb-8 container-3d">
        <div class="card-header">
          <h2 class="text-3xl font-bold text-white holographic">
            🔥 Последние дефекты
          </h2>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center py-12">
            <div class="loading-shimmer w-full h-64 rounded-lg"></div>
            <p class="text-white-70 mt-4">Загружаем магию...</p>
          </div>
          
          <div v-else-if="defects.length === 0" class="text-center py-12">
            <div class="animated-icon mb-4">🎭</div>
            <p class="text-white-70 text-xl">Дефектов пока нет - идеальное начало!</p>
          </div>
          
          <div v-else class="grid gap-6">
            <div 
              v-for="(defect, index) in defects.slice(0, 5)" 
              :key="defect.id"
              class="defect-card bg-white-10 backdrop-blur-lg rounded-2xl p-6 border border-white-20 hover-bg-white-20 transition-all duration-500 floating"
              :style="{ animationDelay: index * 0.1 + 's' }"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-4 mb-3">
                    <span 
                      class="badge"
                      :class="getPriorityClass(defect.priority)"
                    >
                      {{ getPriorityIcon(defect.priority) }} {{ defect.priority }}
                    </span>
                    <span 
                      class="badge"
                      :class="getStatusClass(defect.status)"
                    >
                      {{ getStatusIcon(defect.status) }} {{ defect.status }}
                    </span>
                  </div>
                  
                  <h3 class="text-xl font-bold text-white mb-2">{{ defect.title }}</h3>
                  <p class="text-white-70 mb-3">{{ defect.description }}</p>
                  
                  <div class="flex items-center gap-4 text-sm text-white-60">
                    <span>🏗️ {{ defect.location }}</span>
                    <span>👤 {{ defect.reported_by }}</span>
                    <span>📅 {{ formatDate(defect.created_at) }}</span>
                  </div>
                </div>
                
                <div class="ml-4">
                  <button 
                    class="btn btn-primary btn-sm"
                    @click="openDefectDetails(defect)"
                  >
                    👁️ Детали
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="defects.length > 5" class="text-center mt-8">
            <router-link to="/defects" class="btn btn-warning">
              🚀 Показать все дефекты
            </router-link>
          </div>
        </div>
      </div>

      <!-- Статистика по приоритетам -->
      <div class="grid md-grid-cols-4 gap-6 mb-8">
        <div 
          v-for="(priority, index) in priorityStats" 
          :key="priority.name"
          class="card text-center floating"
          :style="{ animationDelay: index * 0.15 + 's' }"
        >
          <div class="card-body">
            <div class="text-4xl mb-3">{{ priority.icon }}</div>
            <div class="text-3xl font-bold text-white mb-2 neon-glow">{{ priority.count }}</div>
            <div class="text-white-70">{{ priority.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно аналитики -->
    <div 
      v-if="showAnalytics" 
      class="fixed inset-0 bg-black-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click="showAnalytics = false"
    >
      <div class="card max-w-4xl w-full max-h-90vh overflow-y-auto" @click.stop>
        <div class="card-header">
          <h2 class="text-3xl font-bold text-white holographic">📊 Супер Аналитика</h2>
          <button 
            @click="showAnalytics = false"
            class="absolute top-4 right-4 text-white-70 hover-text-white text-2xl"
          >
            ✕
          </button>
        </div>
        <div class="card-body">
          <div class="grid md-grid-cols-2 gap-6 mb-6">
            <div class="bg-white-10 rounded-xl p-4">
              <h3 class="text-xl font-bold text-white mb-3">🎯 По статусам</h3>
              <div class="space-y-2">
                <div v-for="status in statusAnalytics" :key="status.name" class="flex justify-between">
                  <span class="text-white-70">{{ status.icon }} {{ status.name }}</span>
                  <span class="text-white font-bold">{{ status.count }}</span>
                </div>
              </div>
            </div>
            
            <div class="bg-white-10 rounded-xl p-4">
              <h3 class="text-xl font-bold text-white mb-3">⚡ По приоритетам</h3>
              <div class="space-y-2">
                <div v-for="priority in priorityStats" :key="priority.name" class="flex justify-between">
                  <span class="text-white-70">{{ priority.icon }} {{ priority.name }}</span>
                  <span class="text-white font-bold">{{ priority.count }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white-10 rounded-xl p-4">
            <h3 class="text-xl font-bold text-white mb-3">🏆 Топ локаций</h3>
            <div class="grid md-grid-cols-3 gap-4">
              <div v-for="location in topLocations" :key="location.name" class="text-center">
                <div class="text-2xl font-bold text-white neon-glow">{{ location.count }}</div>
                <div class="text-white-70">{{ location.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(true)
const defects = ref([])
const showAnalytics = ref(false)
const particlesContainer = ref(null)

// Статистика
const stats = computed(() => {
  const total = defects.value.length
  const active = defects.value.filter(d => d.status !== 'Resolved').length
  const resolved = defects.value.filter(d => d.status === 'Resolved').length
  const critical = defects.value.filter(d => d.priority === 'Critical').length
  
  return { total, active, resolved, critical }
})

// Статистика по приоритетам
const priorityStats = computed(() => {
  const priorities = ['Low', 'Medium', 'High', 'Critical']
  const icons = ['🟢', '🟡', '🟠', '🔴']
  
  return priorities.map((priority, index) => ({
    name: priority,
    icon: icons[index],
    count: defects.value.filter(d => d.priority === priority).length
  }))
})

// Статистика по статусам
const statusAnalytics = computed(() => {
  const statuses = ['Open', 'In Progress', 'Testing', 'Resolved']
  const icons = ['🆕', '⚡', '🔬', '✅']
  
  return statuses.map((status, index) => ({
    name: status,
    icon: icons[index],
    count: defects.value.filter(d => d.status === status).length
  }))
})

// Топ локаций
const topLocations = computed(() => {
  const locationCounts = {}
  defects.value.forEach(defect => {
    locationCounts[defect.location] = (locationCounts[defect.location] || 0) + 1
  })
  
  return Object.entries(locationCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
})

// Загрузка дефектов
const loadDefects = async () => {
  try {
    loading.value = true
    
    // Пробуем загрузить с сервера
    const response = await fetch('http://localhost:3000/api/defects')
    if (response.ok) {
      defects.value = await response.json()
    } else {
      throw new Error('Server not available')
    }
  } catch (error) {
    console.log('Используем демо-данные:', error.message)
    
    // Демо-данные для красоты
    defects.value = [
      {
        id: 1,
        title: 'Трещина в несущей стене',
        description: 'Обнаружена вертикальная трещина длиной 2 метра в несущей стене здания',
        priority: 'Critical',
        status: 'Open',
        location: 'Здание A, 3 этаж',
        reported_by: 'Иван Петров',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Протечка крыши',
        description: 'Протечка воды через кровлю в помещении склада',
        priority: 'High',
        status: 'In Progress',
        location: 'Склад B',
        reported_by: 'Мария Сидорова',
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        title: 'Неровность пола',
        description: 'Неровность пола в коридоре, создающая опасность для передвижения',
        priority: 'Medium',
        status: 'Testing',
        location: 'Коридор 1-го этажа',
        reported_by: 'Александр Козлов',
        created_at: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 4,
        title: 'Отслоение штукатурки',
        description: 'Отслоение декоративной штукатурки на фасаде здания',
        priority: 'Low',
        status: 'Resolved',
        location: 'Фасад здания C',
        reported_by: 'Елена Николаева',
        created_at: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: 5,
        title: 'Проблемы с электропроводкой',
        description: 'Перебои в подаче электричества в офисных помещениях',
        priority: 'High',
        status: 'Open',
        location: 'Офис 205',
        reported_by: 'Дмитрий Волков',
        created_at: new Date(Date.now() - 345600000).toISOString()
      }
    ]
  } finally {
    loading.value = false
  }
}

// Хелперы для стилей
const getPriorityClass = (priority) => {
  const classes = {
    'Low': 'badge-success',
    'Medium': 'badge-warning', 
    'High': 'badge-danger',
    'Critical': 'badge-danger'
  }
  return classes[priority] || 'badge-primary'
}

const getStatusClass = (status) => {
  const classes = {
    'Open': 'badge-danger',
    'In Progress': 'badge-warning',
    'Testing': 'badge-primary',
    'Resolved': 'badge-success'
  }
  return classes[status] || 'badge-primary'
}

const getPriorityIcon = (priority) => {
  const icons = {
    'Low': '🟢',
    'Medium': '🟡',
    'High': '🟠', 
    'Critical': '🔴'
  }
  return icons[priority] || '⚪'
}

const getStatusIcon = (status) => {
  const icons = {
    'Open': '🆕',
    'In Progress': '⚡',
    'Testing': '🔬',
    'Resolved': '✅'
  }
  return icons[status] || '❓'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const openDefectDetails = (defect) => {
  router.push(`/defects/${defect.id}`)
}

// Создание частиц
const createParticles = () => {
  if (!particlesContainer.value) return
  
  const container = particlesContainer.value
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    particle.style.left = Math.random() * 100 + '%'
    particle.style.width = Math.random() * 4 + 2 + 'px'
    particle.style.height = particle.style.width
    particle.style.animationDelay = Math.random() * 6 + 's'
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's'
    
    container.appendChild(particle)
  }
}

onMounted(() => {
  loadDefects()
  createParticles()
})
</script>

<style scoped>
.defect-card {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.defect-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.text-white-80 {
  color: rgba(255, 255, 255, 0.8);
}

.border-white-20 {
  border-color: rgba(255, 255, 255, 0.2);
}

.hover-bg-white-20:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.hover-text-white:hover {
  color: white;
}

.hover-scale-105:hover {
  transform: scale(1.05);
}

.md-grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.md-grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.md-grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md-grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .md-grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  .md-grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>