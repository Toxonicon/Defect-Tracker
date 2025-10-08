<template>
  <div class="create-project">
    <div class="header">
      <button @click="goBack" class="back-btn">← Назад</button>
      <h1>Создать новый проект</h1>
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
            <label for="budget">Бюджет</label>
            <input
              id="budget"
              v-model="form.budget"
              type="number"
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
              type="date"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="endDate">Дата окончания</label>
            <input
              id="endDate"
              v-model="form.endDate"
              type="date"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="manager">Менеджер проекта</label>
          <select id="manager" v-model="form.manager" class="form-input">
            <option value="">Не назначен</option>
            <option value="user1">Иван Петров</option>
            <option value="user2">Мария Сидорова</option>
            <option value="user3">Алексей Иванов</option>
            <option value="user4">Ольга Смирнова</option>
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

        <div class="form-actions">
          <button type="button" @click="goBack" class="btn btn-cancel">
            Отмена
          </button>
          <button type="submit" class="btn btn-submit">
            Создать проект
          </button>
        </div>
      </form>

      <div v-if="showSuccess" class="success-message">
        ✅ Проект успешно создан!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showSuccess = ref(false)

const form = reactive({
  name: '',
  description: '',
  status: 'planning',
  budget: '',
  startDate: '',
  endDate: '',
  manager: '',
  location: ''
})

const goBack = () => {
  router.push('/projects')
}

const handleSubmit = () => {
  console.log('Создание проекта:', form)
  
  // Показываем сообщение об успехе
  showSuccess.value = true
  
  // Через 2 секунды перенаправляем на список проектов
  setTimeout(() => {
    router.push('/projects')
  }, 2000)
}
</script>

<style scoped>
.create-project {
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
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 50%, #4facfe 100%);
  background-size: 200% auto;
  color: white;
}

.btn-submit:hover {
  background-position: right center;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 10px 30px rgba(67, 233, 123, 0.5);
}

.success-message {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 1.5rem 2.5rem;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4);
  font-weight: 700;
  font-size: 1.1rem;
  animation: slideIn 0.3s ease;
  z-index: 1000;
  border: 3px solid rgba(255, 255, 255, 0.3);
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
  .create-project {
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
  
  .success-message {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    text-align: center;
  }
}
</style>
