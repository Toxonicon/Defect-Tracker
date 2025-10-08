<template>
  <div class="defect-detail">
    <div class="header">
      <button @click="goBack" class="back-btn">← Назад к списку</button>
      <div class="header-actions">
        <button @click="editDefect" class="btn btn-secondary">Редактировать</button>
        <button @click="deleteDefect" class="btn btn-danger">Удалить</button>
      </div>
    </div>

    <div class="defect-content">
      <div class="main-info">
        <div class="title-section">
          <h1>{{ defect.title }}</h1>
          <div class="badges">
            <span class="status-badge" :class="defect.status">
              {{ getStatusLabel(defect.status) }}
            </span>
            <span class="severity-badge" :class="defect.severity">
              {{ getSeverityLabel(defect.severity) }}
            </span>
            <span class="priority-badge" :class="defect.priority">
              Приоритет: {{ getPriorityLabel(defect.priority) }}
            </span>
          </div>
        </div>

        <div class="description-section">
          <h2>Описание</h2>
          <p>{{ defect.description }}</p>
        </div>

        <div class="details-grid">
          <div class="detail-card">
            <div class="detail-label">Проект</div>
            <div class="detail-value">{{ defect.project }}</div>
          </div>

          <div class="detail-card">
            <div class="detail-label">Создан</div>
            <div class="detail-value">{{ formatDate(defect.createdAt) }}</div>
          </div>

          <div class="detail-card">
            <div class="detail-label">Исполнитель</div>
            <div class="detail-value">{{ defect.assignee || 'Не назначен' }}</div>
          </div>

          <div class="detail-card">
            <div class="detail-label">Срок</div>
            <div class="detail-value">{{ defect.dueDate ? formatDate(defect.dueDate) : 'Не установлен' }}</div>
          </div>

          <div class="detail-card">
            <div class="detail-label">Автор</div>
            <div class="detail-value">{{ defect.reporter }}</div>
          </div>

          <div class="detail-card">
            <div class="detail-label">ID</div>
            <div class="detail-value">#{{ defect.id }}</div>
          </div>
        </div>

        <div class="additional-info">
          <h2>Дополнительная информация</h2>
          <div class="info-list">
            <div class="info-item">
              <strong>Категория:</strong> {{ defect.category }}
            </div>
            <div class="info-item">
              <strong>Версия:</strong> {{ defect.version }}
            </div>
            <div class="info-item">
              <strong>Среда:</strong> {{ defect.environment }}
            </div>
            <div class="info-item">
              <strong>Последнее обновление:</strong> {{ formatDate(defect.updatedAt) }}
            </div>
          </div>
        </div>
      </div>

      <div class="sidebar">
        <div class="sidebar-section">
          <h3>Действия</h3>
          <div class="action-buttons">
            <button @click="changeStatus('in-progress')" class="action-btn">
              ▶️ Взять в работу
            </button>
            <button @click="changeStatus('resolved')" class="action-btn">
              ✅ Отметить решенным
            </button>
            <button @click="changeStatus('closed')" class="action-btn">
              🔒 Закрыть
            </button>
            <button @click="assignToMe" class="action-btn">
              👤 Назначить на меня
            </button>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>Активность</h3>
          <div class="activity-list">
            <div v-for="activity in activities" :key="activity.id" class="activity-item">
              <div class="activity-icon">{{ activity.icon }}</div>
              <div class="activity-content">
                <div class="activity-text">{{ activity.text }}</div>
                <div class="activity-date">{{ formatDate(activity.date) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps(['id'])
const router = useRouter()

// Демо-данные дефекта
const defect = ref({
  id: props.id,
  title: 'Трещина в стене на 5 этаже',
  description: 'Обнаружена трещина в несущей стене размером 30см. Требуется срочное обследование и принятие мер по укреплению конструкции. Трещина расположена в зоне высокой нагрузки.',
  project: 'Торговый центр "Мега"',
  status: 'open',
  severity: 'high',
  priority: 'high',
  assignee: 'Иванов И.И.',
  reporter: 'Петров П.П.',
  createdAt: '2024-10-01',
  updatedAt: '2024-10-07',
  dueDate: '2024-10-15',
  category: 'Конструктивные дефекты',
  version: 'v1.0',
  environment: 'Производство'
})

const activities = ref([
  {
    id: 1,
    icon: '📝',
    text: 'Дефект создан',
    date: '2024-10-01'
  },
  {
    id: 2,
    icon: '👤',
    text: 'Назначен исполнитель: Иванов И.И.',
    date: '2024-10-02'
  },
  {
    id: 3,
    icon: '💬',
    text: 'Добавлен комментарий',
    date: '2024-10-05'
  },
  {
    id: 4,
    icon: '📎',
    text: 'Добавлено вложение',
    date: '2024-10-06'
  }
])

const goBack = () => {
  router.push('/defects')
}

const editDefect = () => {
  alert('Редактирование дефекта #' + props.id)
}

const deleteDefect = () => {
  if (confirm('Вы уверены, что хотите удалить этот дефект?')) {
    alert('Дефект удален!')
    router.push('/defects')
  }
}

const changeStatus = (newStatus) => {
  defect.value.status = newStatus
  alert(`Статус изменен на: ${getStatusLabel(newStatus)}`)
}

const assignToMe = () => {
  defect.value.assignee = 'Я (Текущий пользователь)'
  alert('Дефект назначен на вас!')
}

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
.defect-detail {
  width: 100%;
  height: 100%;
  padding: 2rem;
  overflow-y: auto;
  background: #f9fafb;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.defect-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.main-info {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.title-section {
  margin-bottom: 2rem;
}

h1 {
  color: #333;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
}

.badges {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.status-badge, .severity-badge, .priority-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
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

.priority-badge {
  background: #e0e7ff;
  color: #3730a3;
}

.description-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.description-section h2 {
  color: #333;
  font-size: 1.3rem;
  margin: 0 0 1rem 0;
}

.description-section p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.detail-card {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.detail-label {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.detail-value {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.additional-info h2 {
  color: #333;
  font-size: 1.3rem;
  margin: 0 0 1rem 0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  color: #666;
  line-height: 1.5;
}

.info-item strong {
  color: #333;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.sidebar-section h3 {
  color: #333;
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 0.75rem;
}

.activity-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: #333;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.activity-date {
  color: #9ca3af;
  font-size: 0.8rem;
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

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

@media (max-width: 1024px) {
  .defect-content {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    order: -1;
  }
}

@media (max-width: 768px) {
  .defect-detail {
    padding: 1rem;
  }
  
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>