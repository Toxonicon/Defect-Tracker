<template>
  <div class="defects-page">
    <div class="page-header">
      <h1>Дефекты</h1>
      <button class="btn btn-primary">Создать дефект</button>
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
      <div v-for="defect in filteredDefects" :key="defect.id" class="defect-card">
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

        <div class="defect-actions">
          <button class="btn btn-secondary">Открыть</button>
          <button class="btn btn-outline">Редактировать</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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
  color: #333;
  margin: 0;
  font-size: 2.5rem;
}

.filters {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
}

.filter-select:focus {
  outline: none;
  border-color: #0891b2;
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
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.defect-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.defect-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.defect-info h3 {
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
}

.defect-project {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.defect-badges {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.status-badge, .severity-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.open {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.in-progress {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.resolved {
  background: #dcfce7;
  color: #166534;
}

.status-badge.closed {
  background: #f3f4f6;
  color: #374151;
}

.severity-badge.low {
  background: #dcfce7;
  color: #166534;
}

.severity-badge.medium {
  background: #fef3c7;
  color: #92400e;
}

.severity-badge.high {
  background: #fed7aa;
  color: #c2410c;
}

.severity-badge.critical {
  background: #fee2e2;
  color: #991b1b;
}

.defect-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.defect-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.meta-value {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.meta-value.priority.low {
  color: #166534;
}

.meta-value.priority.medium {
  color: #92400e;
}

.meta-value.priority.high {
  color: #c2410c;
}

.meta-value.priority.critical {
  color: #991b1b;
}

.defect-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
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

.btn-outline {
  background: transparent;
  color: #0891b2;
  border: 1px solid #0891b2;
}

.btn-outline:hover {
  background: #0891b2;
  color: white;
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
}
</style>