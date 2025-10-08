<template>
  <div class="dashboard">
    <h1>Добро пожаловать в Defect Tracker</h1>
    <div class="stats">
      <div class="stat-card" @click="goToDefects">
        <h3>Общие дефекты</h3>
        <p class="number">42</p>
      </div>
      <div class="stat-card" @click="goToProjects">
        <h3>Активные проекты</h3>
        <p class="number">8</p>
      </div>
      <div class="stat-card" @click="goToDefects">
        <h3>Решенные дефекты</h3>
        <p class="number">156</p>
      </div>
      <div class="stat-card" @click="goToDefects">
        <h3>Просроченные</h3>
        <p class="number">3</p>
      </div>
    </div>
    <div class="actions">
      <button class="btn btn-primary" @click="createDefect">Создать дефект</button>
      <button class="btn btn-secondary" @click="goToProjects">Просмотреть проекты</button>
      <button class="btn btn-tertiary" @click="goToReports">Отчеты</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const createDefect = () => {
  router.push('/defects/create')
}

const goToProjects = () => {
  router.push('/projects')
}

const goToDefects = () => {
  router.push('/defects')
}

const goToReports = () => {
  router.push('/reports')
}
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
  text-align: center;
  margin: 0;
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #4facfe, #00f2fe, #43e97b);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: rainbow 3s linear infinite;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

@keyframes rainbow {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  flex: 1;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 180px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 3px solid transparent;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent,
    rgba(102, 126, 234, 0.3),
    transparent 30%,
    transparent 60%,
    rgba(240, 147, 251, 0.3),
    transparent 90%
  );
  animation: rotate 4s linear infinite;
  z-index: 0;
}

@keyframes rotate {
  100% { transform: rotate(1turn); }
}

.stat-card::after {
  content: '';
  position: absolute;
  inset: 3px;
  background: white;
  border-radius: 17px;
  z-index: 1;
}

.stat-card > * {
  position: relative;
  z-index: 2;
}

.stat-card:nth-child(1) {
  background-image: linear-gradient(white, white), linear-gradient(135deg, #667eea, #764ba2);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

.stat-card:nth-child(2) {
  background-image: linear-gradient(white, white), linear-gradient(135deg, #f093fb, #f5576c);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

.stat-card:nth-child(3) {
  background-image: linear-gradient(white, white), linear-gradient(135deg, #4facfe, #00f2fe);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

.stat-card:nth-child(4) {
  background-image: linear-gradient(white, white), linear-gradient(135deg, #43e97b, #38f9d7);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

.stat-card:hover {
  transform: translateY(-10px) scale(1.05) rotate(2deg);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);
}

.stat-card h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.number {
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card:nth-child(2) .number {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-card:nth-child(3) .number {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-card:nth-child(4) .number {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  padding: 1.2rem 2.5rem;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #764ba2 0%, #f093fb 100%);
  transform: translateY(-4px) scale(1.08);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #f5576c 0%, #4facfe 100%);
  transform: translateY(-4px) scale(1.08);
  box-shadow: 0 10px 30px rgba(245, 87, 108, 0.4);
}

.btn-tertiary {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.btn-tertiary:hover {
  background: linear-gradient(135deg, #00f2fe 0%, #43e97b 100%);
  transform: translateY(-4px) scale(1.08);
  box-shadow: 0 10px 30px rgba(79, 172, 254, 0.4);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.2rem;
  }
  
  .stats {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1.5rem;
    min-height: 150px;
  }
  
  .number {
    font-size: 3rem;
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
    font-size: 2rem;
  }
  
  .number {
    font-size: 2.5rem;
  }
}
</style>