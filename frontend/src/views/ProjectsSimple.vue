<template>
  <div class="projects-page">
    <div class="page-header">
      <h1>Проекты</h1>
      <button class="btn btn-primary" @click="createProject">Создать проект</button>
    </div>

    <div class="projects-grid">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <div class="project-header">
          <h3>{{ project.name }}</h3>
          <span class="project-status" :class="project.status">
            {{ getStatusLabel(project.status) }}
          </span>
        </div>
        <p class="project-description">{{ project.description }}</p>
        <div class="project-stats">
          <div class="stat">
            <span class="stat-label">Дефекты:</span>
            <span class="stat-value">{{ project.defects }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Прогресс:</span>
            <span class="stat-value">{{ project.progress }}%</span>
          </div>
        </div>
        <div class="project-actions">
          <button class="btn btn-secondary" @click="openProject(project.id)">Открыть</button>
          <button class="btn btn-outline" @click="editProject(project.id)">Редактировать</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const projects = ref([
  {
    id: 1,
    name: 'Торговый центр "Мега"',
    description: 'Строительство торгового центра в центре города',
    status: 'active',
    defects: 12,
    progress: 75
  },
  {
    id: 2,
    name: 'Жилой комплекс "Солнечный"',
    description: 'Строительство жилого комплекса на 500 квартир',
    status: 'active',
    defects: 8,
    progress: 60
  },
  {
    id: 3,
    name: 'Офисный центр "Бизнес Плаза"',
    description: 'Строительство офисного центра класса А',
    status: 'completed',
    defects: 3,
    progress: 100
  },
  {
    id: 4,
    name: 'Спортивный комплекс',
    description: 'Строительство многофункционального спортивного комплекса',
    status: 'planning',
    defects: 0,
    progress: 15
  }
])

const getStatusLabel = (status) => {
  const labels = {
    active: 'Активный',
    completed: 'Завершен',
    planning: 'Планирование',
    onhold: 'Приостановлен'
  }
  return labels[status] || status
}

const createProject = () => {
  router.push('/projects/create')
}

const openProject = (id) => {
  console.log('Открытие проекта:', id)
  router.push(`/projects/${id}`)
}

const editProject = (id) => {
  console.log('Редактирование проекта:', id)
  router.push(`/projects/${id}/edit`)
}
</script>

<style scoped>
.projects-page {
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
  margin-bottom: 1rem;
}

.page-header h1 {
  margin: 0;
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #43e97b, #38f9d7, #4facfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  flex: 1;
  overflow-y: auto;
  align-items: start;
  grid-auto-rows: max-content;
}

.project-card {
  background: white;
  border: 3px solid transparent;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  transition: all 0.3s ease;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, #43e97b, #4facfe);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent,
    rgba(67, 233, 123, 0.15),
    transparent 30%
  );
  animation: rotate 6s linear infinite;
  opacity: 0;
  transition: opacity 0.3s;
}

.project-card:hover::before {
  opacity: 1;
}

@keyframes rotate {
  100% { transform: rotate(1turn); }
}

.project-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 40px rgba(67, 233, 123, 0.25);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.project-header h3 {
  color: #333;
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  flex: 1;
}

.project-status {
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-left: 1rem;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
}

.project-status:hover {
  transform: scale(1.1);
}

.project-status.active {
  background: linear-gradient(135deg, #dcfce7, #4ade80);
  color: #166534;
}

.project-status.completed {
  background: linear-gradient(135deg, #dbeafe, #60a5fa);
  color: #1e40af;
}

.project-status.planning {
  background: linear-gradient(135deg, #fef3c7, #fbbf24);
  color: #92400e;
}

.project-status.onhold {
  background: linear-gradient(135deg, #fee2e2, #f87171);
  color: #991b1b;
}

.project-description {
  color: #555;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 1.05rem;
  position: relative;
  z-index: 1;
}

.project-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
  padding: 1.2rem;
  background: linear-gradient(135deg, rgba(67, 233, 123, 0.05), rgba(79, 172, 254, 0.05));
  border-radius: 15px;
  border: 2px solid rgba(67, 233, 123, 0.1);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #43e97b, #4facfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.project-actions {
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
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #38f9d7, #4facfe);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(67, 233, 123, 0.4);
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
  color: #43e97b;
  border: 3px solid #43e97b;
}

.btn-outline:hover {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
  border-color: transparent;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(67, 233, 123, 0.4);
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

  .btn-primary {
    width: 100%;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-stats {
    gap: 1rem;
  }

  .project-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>