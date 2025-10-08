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
      <div class="stat-card">
        <h3>Просроченные</h3>
        <p class="number">3</p>
      </div>
    </div>
    <div class="actions">
      <button class="btn btn-primary">Создать дефект</button>
      <button class="btn btn-secondary">Просмотреть проекты</button>
      <button class="btn btn-tertiary">Отчеты</button>
    </div>
  </div>
</template>

<script setup>
// Простой дашборд
</script>

<style scoped>
.dashboard {
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

h1 {
  color: #333;
  text-align: center;
  margin: 0;
  font-size: 2.5rem;
  font-weight: bold;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  flex: 1;
}

.stat-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 150px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.2);
}

.stat-card h3 {
  color: #666;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.number {
  font-size: 3rem;
  font-weight: bold;
  color: #0891b2;
  margin: 0;
  line-height: 1;
}

.actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 1rem;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 180px;
}

.btn-primary {
  background: #0891b2;
  color: white;
}

.btn-primary:hover {
  background: #0e7490;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
  transform: translateY(-2px);
}

.btn-tertiary {
  background: #8b5cf6;
  color: white;
}

.btn-tertiary:hover {
  background: #7c3aed;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  
  .stats {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1.5rem;
    min-height: 120px;
  }
  
  .number {
    font-size: 2.5rem;
  }
  
  .actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .stats {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 1.8rem;
  }
}
</style>