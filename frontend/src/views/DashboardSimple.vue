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