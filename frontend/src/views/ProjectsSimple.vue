<template>
  <div class="projects-page">
    <div class="page-header">
      <h1>Проекты</h1>
      <button class="btn btn-primary">Создать проект</button>
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
          <button class="btn btn-secondary">Открыть</button>
          <button class="btn btn-outline">Редактировать</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
  color: #333;
  margin: 0;
  font-size: 2.5rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  flex: 1;
  overflow-y: auto;
}

.project-card {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  height: fit-content;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.project-header h3 {
  color: #333;
  margin: 0;
  font-size: 1.3rem;
  flex: 1;
}

.project-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 1rem;
}

.project-status.active {
  background: #dcfce7;
  color: #166534;
}

.project-status.completed {
  background: #dbeafe;
  color: #1e40af;
}

.project-status.planning {
  background: #fef3c7;
  color: #92400e;
}

.project-status.onhold {
  background: #fee2e2;
  color: #991b1b;
}

.project-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.project-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #0891b2;
}

.project-actions {
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

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-stats {
    gap: 1rem;
  }

  .project-actions {
    flex-direction: column;
  }
}
</style>