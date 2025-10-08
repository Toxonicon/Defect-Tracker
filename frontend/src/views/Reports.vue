<template>
  <div class="reports">
    <div class="header">
      <h1>Отчеты и аналитика</h1>
      <button @click="goBack" class="back-btn">← Назад к дашборду</button>
    </div>

    <div class="reports-grid">
      <div class="report-card">
        <div class="report-icon">📊</div>
        <h3>Статистика дефектов</h3>
        <p>Общая статистика по всем дефектам в системе</p>
        <div class="stats-mini">
          <div class="stat-item">
            <span class="label">Всего:</span>
            <span class="value">42</span>
          </div>
          <div class="stat-item">
            <span class="label">Открытых:</span>
            <span class="value">15</span>
          </div>
          <div class="stat-item">
            <span class="label">Решенных:</span>
            <span class="value">27</span>
          </div>
        </div>
        <button class="btn-view">Подробнее</button>
      </div>

      <div class="report-card">
        <div class="report-icon">👥</div>
        <h3>По исполнителям</h3>
        <p>Распределение дефектов по исполнителям</p>
        <div class="stats-mini">
          <div class="stat-item">
            <span class="label">Иван П.:</span>
            <span class="value">8</span>
          </div>
          <div class="stat-item">
            <span class="label">Мария С.:</span>
            <span class="value">12</span>
          </div>
          <div class="stat-item">
            <span class="label">Алексей И.:</span>
            <span class="value">6</span>
          </div>
        </div>
        <button class="btn-view">Подробнее</button>
      </div>

      <div class="report-card">
        <div class="report-icon">📁</div>
        <h3>По проектам</h3>
        <p>Статистика дефектов по проектам</p>
        <div class="stats-mini">
          <div class="stat-item">
            <span class="label">Alpha:</span>
            <span class="value">18</span>
          </div>
          <div class="stat-item">
            <span class="label">Beta:</span>
            <span class="value">10</span>
          </div>
          <div class="stat-item">
            <span class="label">Gamma:</span>
            <span class="value">14</span>
          </div>
        </div>
        <button class="btn-view">Подробнее</button>
      </div>

      <div class="report-card">
        <div class="report-icon">⚠️</div>
        <h3>По приоритетам</h3>
        <p>Распределение по уровню приоритета</p>
        <div class="stats-mini">
          <div class="stat-item">
            <span class="label">Критический:</span>
            <span class="value">3</span>
          </div>
          <div class="stat-item">
            <span class="label">Высокий:</span>
            <span class="value">8</span>
          </div>
          <div class="stat-item">
            <span class="label">Средний:</span>
            <span class="value">22</span>
          </div>
        </div>
        <button class="btn-view">Подробнее</button>
      </div>

      <div class="report-card">
        <div class="report-icon">📅</div>
        <h3>Временная статистика</h3>
        <p>Дефекты за последние периоды</p>
        <div class="stats-mini">
          <div class="stat-item">
            <span class="label">За неделю:</span>
            <span class="value">7</span>
          </div>
          <div class="stat-item">
            <span class="label">За месяц:</span>
            <span class="value">28</span>
          </div>
          <div class="stat-item">
            <span class="label">За год:</span>
            <span class="value">198</span>
          </div>
        </div>
        <button class="btn-view">Подробнее</button>
      </div>

      <div class="report-card">
        <div class="report-icon">⏱️</div>
        <h3>Просроченные</h3>
        <p>Дефекты с превышением сроков</p>
        <div class="stats-mini">
          <div class="stat-item">
            <span class="label">Всего:</span>
            <span class="value critical">3</span>
          </div>
          <div class="stat-item">
            <span class="label">Критические:</span>
            <span class="value critical">1</span>
          </div>
          <div class="stat-item">
            <span class="label">Высокие:</span>
            <span class="value critical">2</span>
          </div>
        </div>
        <button class="btn-view danger">Подробнее</button>
      </div>
    </div>

    <div class="export-section">
      <h2>Экспорт отчетов</h2>
      <div class="export-buttons">
        <button class="btn-export" @click="exportExcel">
          <span class="icon">📊</span>
          Экспорт в Excel
        </button>
        <button class="btn-export" @click="exportPDF">
          <span class="icon">📄</span>
          Экспорт в PDF
        </button>
        <button class="btn-export" @click="exportCSV">
          <span class="icon">📋</span>
          Экспорт в CSV
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/dashboard')
}

const exportExcel = () => {
  console.log('Экспорт в Excel')
  alert('Экспорт в Excel выполнен!')
}

const exportPDF = () => {
  console.log('Экспорт в PDF')
  alert('Экспорт в PDF выполнен!')
}

const exportCSV = () => {
  console.log('Экспорт в CSV')
  alert('Экспорт в CSV выполнен!')
}
</script>

<style scoped>
.reports {
  width: 100%;
  height: 100%;
  padding: 2rem;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

h1 {
  font-size: 2.8rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #f093fb, #f5576c, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
}

.back-btn:hover {
  background: linear-gradient(135deg, #764ba2, #f093fb);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(118, 75, 162, 0.4);
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  align-items: start;
  grid-auto-rows: max-content;
}

.report-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 3px solid transparent;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, #f093fb, #fbbf24);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  position: relative;
  overflow: hidden;
}

.report-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent,
    rgba(240, 147, 251, 0.1),
    transparent 30%
  );
  animation: rotate 6s linear infinite;
  opacity: 0;
  transition: opacity 0.3s;
}

.report-card:hover::before {
  opacity: 1;
}

@keyframes rotate {
  100% { transform: rotate(1turn); }
}

.report-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 40px rgba(240, 147, 251, 0.3);
}

.report-icon {
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  position: relative;
  z-index: 1;
}

.report-card h3 {
  color: #333;
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0;
  position: relative;
  z-index: 1;
}

.report-card p {
  color: #555;
  font-size: 1.05rem;
  margin: 0;
  flex: 1;
  line-height: 1.5;
  position: relative;
  z-index: 1;
}

.stats-mini {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.05), rgba(251, 191, 36, 0.05));
  border-radius: 15px;
  border: 2px solid rgba(240, 147, 251, 0.1);
  position: relative;
  z-index: 1;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-item .label {
  color: #666;
  font-size: 0.95rem;
  font-weight: 600;
}

.stat-item .value {
  font-weight: 900;
  font-size: 1.3rem;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-item .value.critical {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
}

.btn-view {
  padding: 1rem;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
  border: none;
  border-radius: 15px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.btn-view::before {
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

.btn-view:hover::before {
  width: 300px;
  height: 300px;
}

.btn-view:hover {
  background: linear-gradient(135deg, #f5576c, #4facfe);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4);
}

.btn-view.danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.btn-view.danger:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.export-section {
  background: white;
  border-radius: 25px;
  padding: 3rem;
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  border: 3px solid transparent;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, #4facfe, #00f2fe);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

.export-section h2 {
  font-size: 2rem;
  font-weight: 900;
  margin: 0 0 2rem 0;
  background: linear-gradient(135deg, #4facfe, #00f2fe, #43e97b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.export-buttons {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem 2.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-export::before {
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

.btn-export:hover::before {
  width: 400px;
  height: 400px;
}

.btn-export:hover {
  background: linear-gradient(135deg, #764ba2, #f093fb);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(118, 75, 162, 0.4);
}

.btn-export:nth-child(2) {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.btn-export:nth-child(2):hover {
  background: linear-gradient(135deg, #f5576c, #4facfe);
  box-shadow: 0 8px 25px rgba(245, 87, 108, 0.4);
}

.btn-export:nth-child(3) {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.btn-export:nth-child(3):hover {
  background: linear-gradient(135deg, #00f2fe, #43e97b);
  box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4);
}

.btn-export .icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

@media (max-width: 768px) {
  .reports {
    padding: 1rem;
  }
  
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .reports-grid {
    grid-template-columns: 1fr;
  }
  
  .export-section {
    padding: 2rem 1.5rem;
  }
  
  .export-buttons {
    flex-direction: column;
  }
  
  .btn-export {
    width: 100%;
    justify-content: center;
  }
}
</style>