<template>
  <div class="project-detail">
    <div class="header">
      <button @click="goBack" class="back-btn">← Назад к проектам</button>
      <h1>{{ project.name }}</h1>
    </div>

    <div class="content-grid">
      <div class="main-info">
        <div class="info-card">
          <div class="card-header">
            <h2>📋 Информация о проекте</h2>
            <span class="status-badge" :class="project.status">
              {{ getStatusLabel(project.status) }}
            </span>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Описание:</span>
              <p class="value">{{ project.description }}</p>
            </div>
            
            <div class="info-row">
              <div class="info-item">
                <span class="label">Дата начала:</span>
                <span class="value">{{ project.startDate }}</span>
              </div>
              <div class="info-item">
                <span class="label">Дата окончания:</span>
                <span class="value">{{ project.endDate }}</span>
              </div>
            </div>

            <div class="info-item">
              <span class="label">Менеджер проекта:</span>
              <span class="value">{{ project.manager }}</span>
            </div>

            <div class="info-item">
              <span class="label">Локация:</span>
              <span class="value">{{ project.location }}</span>
            </div>
          </div>

          <div class="progress-section">
            <div class="progress-header">
              <span class="label">Прогресс выполнения:</span>
              <span class="progress-value">{{ project.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: project.progress + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="defects-card">
          <h2>🐛 Дефекты проекта</h2>
          <div class="defects-stats">
            <div class="stat-box">
              <span class="stat-number">{{ project.totalDefects }}</span>
              <span class="stat-label">Всего</span>
            </div>
            <div class="stat-box">
              <span class="stat-number open">{{ project.openDefects }}</span>
              <span class="stat-label">Открытых</span>
            </div>
            <div class="stat-box">
              <span class="stat-number resolved">{{ project.resolvedDefects }}</span>
              <span class="stat-label">Решённых</span>
            </div>
            <div class="stat-box">
              <span class="stat-number critical">{{ project.criticalDefects }}</span>
              <span class="stat-label">Критических</span>
            </div>
          </div>
          <button class="btn-view-defects" @click="viewDefects">
            Просмотреть все дефекты проекта
          </button>
        </div>
      </div>

      <div class="sidebar">
        <div class="actions-card">
          <h3>⚡ Действия</h3>
          <button class="action-btn edit" @click="editProject">
            ✏️ Редактировать проект
          </button>
          <button class="action-btn report" @click="generateReport">
            📊 Сформировать отчёт
          </button>
        </div>

        <div class="stats-card">
          <h3>📊 Статистика</h3>
          <div class="stat-item">
            <span class="stat-icon">👥</span>
            <div>
              <span class="stat-label">Участники</span>
              <span class="stat-value">{{ project.teamSize }}</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-icon">💰</span>
            <div>
              <span class="stat-label">Бюджет</span>
              <span class="stat-value">{{ project.budget }} ₽</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-icon">⏱️</span>
            <div>
              <span class="stat-label">Дней до дедлайна</span>
              <span class="stat-value">{{ project.daysLeft }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps(['id'])
const router = useRouter()

// ID текущего проекта
const projectId = props.id

// Демо-данные проекта (в реальном приложении загружались бы с сервера)
const projectData = {
  1: {
    name: 'Торговый центр "Мега"',
    description: 'Строительство торгового центра в центре города с современной инфраструктурой и парковкой на 500 мест',
    status: 'active',
    startDate: '01.03.2025',
    endDate: '30.12.2025',
    manager: 'Иванов Иван Иванович',
    location: 'г. Москва, ул. Центральная, д. 1',
    progress: 75,
    totalDefects: 12,
    openDefects: 5,
    resolvedDefects: 7,
    criticalDefects: 2,
    teamSize: 45,
    budget: '500 000 000',
    daysLeft: 84
  },
  2: {
    name: 'Жилой комплекс "Солнечный"',
    description: 'Строительство жилого комплекса на 500 квартир с детскими площадками и зонами отдыха',
    status: 'active',
    startDate: '15.01.2025',
    endDate: '15.06.2026',
    manager: 'Петров Петр Петрович',
    location: 'г. Санкт-Петербург, пр. Солнечный, д. 10',
    progress: 60,
    totalDefects: 8,
    openDefects: 3,
    resolvedDefects: 5,
    criticalDefects: 1,
    teamSize: 60,
    budget: '1 200 000 000',
    daysLeft: 250
  },
  3: {
    name: 'Офисный центр "Бизнес Плаза"',
    description: 'Строительство офисного центра класса А с конференц-залами и фитнес-центром',
    status: 'completed',
    startDate: '01.06.2024',
    endDate: '01.09.2025',
    manager: 'Сидорова Мария Александровна',
    location: 'г. Казань, ул. Деловая, д. 25',
    progress: 100,
    totalDefects: 3,
    openDefects: 0,
    resolvedDefects: 3,
    criticalDefects: 0,
    teamSize: 30,
    budget: '300 000 000',
    daysLeft: 0
  },
  4: {
    name: 'Спортивный комплекс',
    description: 'Строительство многофункционального спортивного комплекса с бассейном и тренажёрными залами',
    status: 'planning',
    startDate: '01.11.2025',
    endDate: '30.08.2026',
    manager: 'Козлов Алексей Викторович',
    location: 'г. Екатеринбург, ул. Спортивная, д. 5',
    progress: 15,
    totalDefects: 0,
    openDefects: 0,
    resolvedDefects: 0,
    criticalDefects: 0,
    teamSize: 35,
    budget: '450 000 000',
    daysLeft: 298
  }
}

const project = ref(projectData[props.id] || projectData[1])

const getStatusLabel = (status) => {
  const labels = {
    active: 'Активный',
    completed: 'Завершён',
    planning: 'Планирование',
    onhold: 'Приостановлен'
  }
  return labels[status] || status
}

const goBack = () => {
  router.push('/projects')
}

const editProject = () => {
  console.log('Редактирование проекта, ID:', projectId)
  console.log('Переход на:', `/projects/${projectId}/edit`)
  router.push(`/projects/${projectId}/edit`)
}

const generateReport = () => {
  router.push('/reports')
}

</script>

<style scoped>
.project-detail {
  width: 100%;
  height: 100%;
  padding: 2rem;
  overflow-y: auto;
}

.header {
  margin-bottom: 2.5rem;
}

.back-btn {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  margin-bottom: 1.5rem;
}

.back-btn:hover {
  background: linear-gradient(135deg, #764ba2, #f093fb);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(118, 75, 162, 0.4);
}

h1 {
  font-size: 2.8rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #43e97b, #38f9d7, #4facfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.main-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-card, .defects-card, .actions-card, .stats-card {
  background: white;
  border-radius: 25px;
  padding: 2.5rem;
  box-shadow: 0 15px 40px rgba(0,0,0,0.12);
  border: 3px solid transparent;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, #43e97b, #4facfe);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
  color: #333;
}

h3 {
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  color: #333;
}

.status-badge {
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.status-badge.active {
  background: linear-gradient(135deg, #dcfce7, #4ade80);
  color: #166534;
}

.status-badge.completed {
  background: linear-gradient(135deg, #dbeafe, #60a5fa);
  color: #1e40af;
}

.status-badge.planning {
  background: linear-gradient(135deg, #fef3c7, #fbbf24);
  color: #92400e;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
  margin: 0;
}

.progress-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(67, 233, 123, 0.05), rgba(79, 172, 254, 0.05));
  border-radius: 15px;
  border: 2px solid rgba(67, 233, 123, 0.1);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-value {
  font-size: 1.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #43e97b, #4facfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.progress-bar {
  height: 20px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #43e97b, #38f9d7, #4facfe);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.defects-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(67, 233, 123, 0.05), rgba(79, 172, 254, 0.05));
  border-radius: 15px;
  border: 2px solid rgba(67, 233, 123, 0.1);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #43e97b, #4facfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-number.open {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-number.resolved {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-number.critical {
  background: linear-gradient(135deg, #f87171, #ef4444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 0.5rem;
}

.btn-view-defects {
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
  border: none;
  border-radius: 15px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 6px 20px rgba(67, 233, 123, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-view-defects::before {
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

.btn-view-defects:hover::before {
  width: 400px;
  height: 400px;
}

.btn-view-defects:hover {
  background: linear-gradient(135deg, #38f9d7, #4facfe);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(67, 233, 123, 0.4);
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.action-btn {
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 15px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.action-btn:hover::before {
  width: 400px;
  height: 400px;
}

.action-btn.edit {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.action-btn.edit:hover {
  background: linear-gradient(135deg, #764ba2, #f093fb);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.action-btn.report {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.action-btn.report:hover {
  background: linear-gradient(135deg, #00f2fe, #43e97b);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(67, 233, 123, 0.05), rgba(79, 172, 254, 0.05));
  border-radius: 12px;
  margin-bottom: 1rem;
}

.stat-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.stat-item > div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.stat-item .stat-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
}

.stat-item .stat-value {
  font-size: 1.3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #43e97b, #4facfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .defects-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .project-detail {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  .info-card, .defects-card, .actions-card, .stats-card {
    padding: 1.5rem;
  }

  .info-row {
    grid-template-columns: 1fr;
  }

  .defects-stats {
    grid-template-columns: 1fr;
  }
}
</style>