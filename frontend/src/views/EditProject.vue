<template>
  <div class="edit-project">
    <div class="header">
      <button @click="goBack" class="back-btn">← Назад</button>
      <h1>Редактировать проект</h1>
    </div>
    
    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="project-form">
        <div class="form-group">
          <label for="name">Название проекта *</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Введите название проекта"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="description">Описание *</label>
          <textarea
            id="description"
            v-model="form.description"
            required
            rows="5"
            placeholder="Подробное описание проекта"
            class="form-input"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="status">Статус *</label>
            <select id="status" v-model="form.status" required class="form-input">
              <option value="planning">Планирование</option>
              <option value="active">Активный</option>
              <option value="onhold">Приостановлен</option>
              <option value="completed">Завершен</option>
            </select>
          </div>

          <div class="form-group">
            <label for="progress">Прогресс (%)</label>
            <input
              id="progress"
              v-model.number="form.progress"
              type="number"
              min="0"
              max="100"
              placeholder="0"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="startDate">Дата начала</label>
            <input
              id="startDate"
              v-model="form.startDate"
              type="text"
              placeholder="01.01.2025"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="endDate">Дата окончания</label>
            <input
              id="endDate"
              v-model="form.endDate"
              type="text"
              placeholder="31.12.2025"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="manager">Менеджер проекта</label>
          <select id="manager" v-model="form.manager" class="form-input">
            <option value="">Не назначен</option>
            <option value="Иванов Иван Иванович">Иванов Иван Иванович</option>
            <option value="Петров Петр Петрович">Петров Петр Петрович</option>
            <option value="Сидорова Мария Александровна">Сидорова Мария Александровна</option>
            <option value="Козлов Алексей Викторович">Козлов Алексей Викторович</option>
          </select>
        </div>

        <div class="form-group">
          <label for="location">Локация</label>
          <input
            id="location"
            v-model="form.location"
            type="text"
            placeholder="Адрес или местоположение проекта"
            class="form-input"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="teamSize">Размер команды</label>
            <input
              id="teamSize"
              v-model.number="form.teamSize"
              type="number"
              placeholder="0"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="budget">Бюджет</label>
            <input
              id="budget"
              v-model="form.budget"
              type="text"
              placeholder="0"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="goBack" class="btn btn-cancel">
            Отмена
          </button>
          <button type="submit" class="btn btn-submit">
            Сохранить изменения
          </button>
        </div>
      </form>

    </div>

    <!-- Уведомление об успехе -->
    <Transition name="notification">
      <div v-if="showSuccess" class="success-notification">
        <div class="notification-content">
          <div class="notification-icon">✅</div>
          <div class="notification-text">
            <div class="notification-title">Успешно!</div>
            <div class="notification-message">Проект успешно обновлён</div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const showSuccess = ref(false)

const projectId = route.params.id

// Демо-данные проектов
const projectsData = {
  1: {
    name: 'Торговый центр "Мега"',
    description: 'Строительство торгового центра в центре города с современной инфраструктурой и парковкой на 500 мест',
    status: 'active',
    startDate: '01.03.2025',
    endDate: '30.12.2025',
    manager: 'Иванов Иван Иванович',
    location: 'г. Москва, ул. Центральная, д. 1',
    progress: 75,
    teamSize: 45,
    budget: '500 000 000'
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
    teamSize: 60,
    budget: '1 200 000 000'
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
    teamSize: 30,
    budget: '300 000 000'
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
    teamSize: 35,
    budget: '450 000 000'
  }
}

const form = reactive({
  name: '',
  description: '',
  status: 'planning',
  progress: 0,
  startDate: '',
  endDate: '',
  manager: '',
  location: '',
  teamSize: 0,
  budget: ''
})

// Загружаем данные проекта при монтировании
onMounted(() => {
  const projectData = projectsData[projectId]
  if (projectData) {
    Object.assign(form, projectData)
  }
})

const goBack = () => {
  router.push(`/projects/${projectId}`)
}

const handleSubmit = () => {
  console.log('Обновление проекта:', form)
  
  // Показываем сообщение об успехе
  showSuccess.value = true
  
  // Через 2 секунды перенаправляем на страницу проекта
  setTimeout(() => {
    router.push(`/projects/${projectId}`)
  }, 2000)
}
</script>

<style scoped>
.edit-project {
  width: 100%;
  height: 100%;
  padding: 2rem;
  overflow-y: auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
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
}

.back-btn:hover {
  background: linear-gradient(135deg, #764ba2, #f093fb);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(118, 75, 162, 0.4);
}

h1 {
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 25px;
  padding: 3rem;
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  border: 3px solid transparent;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, #667eea, #f093fb);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

.project-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

label {
  color: #333;
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
  padding: 1rem 1.2rem;
  border: 3px solid transparent;
  border-radius: 15px;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, #667eea, #764ba2);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  font-weight: 500;
}

.form-input:focus {
  outline: none;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, #f093fb, #4facfe);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

textarea.form-input {
  resize: vertical;
  min-height: 150px;
  font-family: inherit;
  line-height: 1.6;
}

select.form-input {
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 2rem;
  border-top: 3px solid;
  border-image: linear-gradient(90deg, #667eea, #764ba2, #f093fb) 1;
}

.btn {
  padding: 1.2rem 2.5rem;
  border: none;
  border-radius: 25px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
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

.btn-cancel {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #4b5563, #374151);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(107, 114, 128, 0.4);
}

.btn-submit {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #fbbf24 100%);
  background-size: 200% auto;
  color: white;
}

.btn-submit:hover {
  background-position: right center;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 10px 30px rgba(240, 147, 251, 0.5);
}

/* Уведомление об успехе */
.success-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
  color: white;
  padding: 2.5rem 3rem;
  border-radius: 30px;
  box-shadow: 0 25px 60px rgba(16, 185, 129, 0.6),
              0 0 0 1px rgba(255, 255, 255, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
  z-index: 10000;
  backdrop-filter: blur(10px);
  min-width: 400px;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.notification-icon {
  font-size: 3.5rem;
  animation: bounceIcon 0.6s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

@keyframes bounceIcon {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.notification-text {
  flex: 1;
}

.notification-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.3rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.notification-message {
  font-size: 1.1rem;
  font-weight: 500;
  opacity: 0.95;
}

/* Анимация появления/исчезновения */
.notification-enter-active {
  animation: notificationIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.notification-leave-active {
  animation: notificationOut 0.3s ease-in;
}

@keyframes notificationIn {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes notificationOut {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .edit-project {
    padding: 1rem;
  }
  
  .form-container {
    padding: 2rem 1.5rem;
    border-radius: 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn {
    width: 100%;
  }

  .success-notification {
    min-width: 90%;
    max-width: 90%;
    padding: 2rem;
  }

  .notification-icon {
    font-size: 2.5rem;
  }

  .notification-title {
    font-size: 1.2rem;
  }

  .notification-message {
    font-size: 1rem;
  }
  .success-message {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    text-align: center;
  }
}
</style>
