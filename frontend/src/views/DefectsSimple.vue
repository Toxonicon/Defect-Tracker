<template>
  <div class="defects-page">
    <div class="page-header">
      <h1>Дефекты</h1>
      <button class="btn btn-primary" @click="createDefect">Создать дефект</button>
    </div>

    <div class="filters">
      <select v-model="selectedStatus" class="filter-select">
        <option value="">Все статусы</option>
        <option value="open">Открыт</option>
        <option value="in-progress">В работе</option>
        <option value="resolved">Решен</option>
        <option value="closed">Закрыт</option>
      </select>

      <select v-model="selectedSeverity" class="filter-select">
        <option value="">Все уровни</option>
        <option value="low">Низкий</option>
        <option value="medium">Средний</option>
        <option value="high">Высокий</option>
        <option value="critical">Критический</option>
      </select>
    </div>

    <div class="defects-list">
      <div 
        v-for="defect in filteredDefects" 
        :key="defect.id" 
        class="defect-card"
        @click="openDefect(defect.id)"
      >
        <div class="defect-header">
          <div class="defect-info">
            <h3>{{ defect.title }}</h3>
            <p class="defect-project">{{ defect.project }}</p>
          </div>
          <div class="defect-badges">
            <span class="status-badge" :class="defect.status">
              {{ getStatusLabel(defect.status) }}
            </span>
            <span class="severity-badge" :class="defect.severity">
              {{ getSeverityLabel(defect.severity) }}
            </span>
          </div>
        </div>

        <p class="defect-description">{{ defect.description }}</p>

        <div class="defect-meta">
          <div class="meta-item">
            <span class="meta-label">Создан:</span>
            <span class="meta-value">{{ formatDate(defect.createdAt) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Назначен:</span>
            <span class="meta-value">{{ defect.assignee || 'Не назначен' }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Приоритет:</span>
            <span class="meta-value priority" :class="defect.priority">
              {{ getPriorityLabel(defect.priority) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedStatus = ref('')
const selectedSeverity = ref('')

const defects = ref([
  {
    id: 1,
    title: 'Трещина в стене на 5 этаже',
    description: 'Обнаружена трещина в несущей стене размером 30см',
    project: 'Торговый центр "Мега"',
    status: 'open',
    severity: 'high',
    priority: 'high',
    assignee: 'Иванов И.И.',
    createdAt: '2024-10-01'
  },
  {
    id: 2,
    title: 'Неправильная установка окон',
    description: 'Окна установлены с нарушением технологии',
    project: 'Жилой комплекс "Солнечный"',
    status: 'in-progress',
    severity: 'medium',
    priority: 'medium',
    assignee: 'Петров П.П.',
    createdAt: '2024-10-03'
  },
  {
    id: 3,
    title: 'Протечка кровли',
    description: 'Протечка в районе кровельного покрытия',
    project: 'Офисный центр "Бизнес Плаза"',
    status: 'resolved',
    severity: 'critical',
    priority: 'critical',
    assignee: 'Сидоров С.С.',
    createdAt: '2024-09-28'
  },
  {
    id: 4,
    title: 'Неровность пола',
    description: 'Перепад высот пола превышает норму',
    project: 'Торговый центр "Мега"',
    status: 'open',
    severity: 'low',
    priority: 'low',
    assignee: null,
    createdAt: '2024-10-05'
  },
  {
    id: 5,
    title: 'Дефект фасадной плитки',
    description: 'Отслоение плитки на фасаде здания',
    project: 'Жилой комплекс "Солнечный"',
    status: 'closed',
    severity: 'medium',
    priority: 'medium',
    assignee: 'Козлов К.К.',
    createdAt: '2024-09-25'
  }
])

const filteredDefects = computed(() => {
  return defects.value.filter(defect => {
    const statusMatch = !selectedStatus.value || defect.status === selectedStatus.value
    const severityMatch = !selectedSeverity.value || defect.severity === selectedSeverity.value
    return statusMatch && severityMatch
  })
})

const getStatusLabel = (status) => {
  const labels = {
    open: 'Открыт',
    'in-progress': 'В работе',
    resolved: 'Решен',
    closed: 'Закрыт'
  }
  return labels[status] || status
}

const getSeverityLabel = (severity) => {
  const labels = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    critical: 'Критический'
  }
  return labels[severity] || severity
}

const getPriorityLabel = (priority) => {
  const labels = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    critical: 'Критический'
  }
  return labels[priority] || priority
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

// Функции для кнопок
const createDefect = () => {
  router.push('/defects/create')
}

const openDefect = (id) => {
  console.log('Открытие дефекта:', id)
  router.push(`/defects/${id}`)
}

const editDefect = (id) => {
  console.log('Редактирование дефекта:', id)
  // Можно перейти на страницу редактирования или открыть модальное окно
  alert(`Редактирование дефекта #${id}`)
}
</script>

<style scoped>
.defects-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  margin: 0;
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.filters {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.8rem 1.2rem;
  border: 3px solid transparent;
  border-radius: 15px;
  background: white;
  font-size: 1rem;
  font-weight: 600;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, #667eea, #764ba2);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.filter-select:focus {
  outline: none;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, #f093fb, #4facfe);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.defects-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.defect-card {
  background: white;
  border: 3px solid transparent;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  transition: all 0.3s ease;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, #667eea, #f093fb);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.defect-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);
  background-image: 
    linear-gradient(rgba(255,255,255,0.97), rgba(255,255,255,0.97)),
    linear-gradient(135deg, #667eea, #f093fb, #43e97b);
}

.defect-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent,
    rgba(102, 126, 234, 0.1),
    transparent 30%
  );
  animation: rotate 6s linear infinite;
  opacity: 0;
  transition: opacity 0.3s;
}

.defect-card:hover::before {
  opacity: 1;
}

@keyframes rotate {
  100% { transform: rotate(1turn); }
}

.defect-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.25);
}

.defect-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.defect-info h3 {
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1.4rem;
  font-weight: 800;
  transition: color 0.3s ease;
}

.defect-card:hover .defect-info h3 {
  color: #667eea;
}

.defect-project {
  color: #666;
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

.defect-badges {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.status-badge, .severity-badge {
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
}

.status-badge:hover, .severity-badge:hover {
  transform: scale(1.1);
}

.status-badge.open {
  background: linear-gradient(135deg, #fef3c7, #fde047);
  color: #92400e;
}

.status-badge.in-progress {
  background: linear-gradient(135deg, #dbeafe, #60a5fa);
  color: #1e40af;
}

.status-badge.resolved {
  background: linear-gradient(135deg, #dcfce7, #4ade80);
  color: #166534;
}

.status-badge.closed {
  background: linear-gradient(135deg, #f3f4f6, #9ca3af);
  color: #374151;
}

.severity-badge.low {
  background: linear-gradient(135deg, #dcfce7, #4ade80);
  color: #166534;
}

.severity-badge.medium {
  background: linear-gradient(135deg, #fef3c7, #fbbf24);
  color: #92400e;
}

.severity-badge.high {
  background: linear-gradient(135deg, #fed7aa, #fb923c);
  color: #c2410c;
}

.severity-badge.critical {
  background: linear-gradient(135deg, #fee2e2, #f87171);
  color: #991b1b;
}

.defect-description {
  color: #555;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 1.05rem;
  position: relative;
  z-index: 1;
}

.defect-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(240, 147, 251, 0.05));
  border-radius: 15px;
  border: 2px solid rgba(102, 126, 234, 0.1);
  position: relative;
  z-index: 1;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.meta-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-value {
  font-size: 1rem;
  color: #333;
  font-weight: 600;
}

.meta-value.priority.low {
  color: #16a34a;
  text-shadow: 0 0 10px rgba(22, 163, 74, 0.3);
}

.meta-value.priority.medium {
  color: #ca8a04;
  text-shadow: 0 0 10px rgba(202, 138, 4, 0.3);
}

.meta-value.priority.high {
  color: #ea580c;
  text-shadow: 0 0 10px rgba(234, 88, 12, 0.3);
}

.meta-value.priority.critical {
  color: #dc2626;
  text-shadow: 0 0 10px rgba(220, 38, 38, 0.3);
}

.defect-actions {
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:hover::before {
  width: 300px;
  height: 300px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #764ba2, #f093fb);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #f5576c, #4facfe);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(245, 87, 108, 0.4);
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 3px solid #667eea;
}

.btn-outline:hover {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .filters {
    flex-direction: column;
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }

  .defect-header {
    flex-direction: column;
    gap: 1rem;
  }

  .defect-badges {
    align-self: flex-start;
  }

  .defect-meta {
    grid-template-columns: 1fr;
  }

  .defect-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>