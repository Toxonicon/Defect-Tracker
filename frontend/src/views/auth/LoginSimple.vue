<template>
  <div class="login-page">
    <div class="floating-shapes">
      <div class="shape"></div>
      <div class="shape"></div>
      <div class="shape"></div>
      <div class="shape"></div>
    </div>
    <div class="login-card">
      <h1>✨ Defect Tracker ✨</h1>
      <p class="subtitle">Система управления дефектами</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">📧 Email:</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="test@example.com"
          />
        </div>
        
        <div class="form-group">
          <label for="password">🔒 Пароль:</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="password"
          />
        </div>
        
        <div v-if="errorMessage" class="error">
          {{ errorMessage }}
        </div>
        
        <button type="submit" :disabled="authStore.loading" class="btn-login">
          <span v-if="authStore.loading">Вход...</span>
          <span v-else>🚀 Войти</span>
        </button>
      </form>
      
      <div class="demo-info">
        <p>💡 Для демо используйте любые данные:</p>
        <p><strong>Email:</strong> test@example.com</p>
        <p><strong>Пароль:</strong> password</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: 'test@example.com',
  password: 'password'
})

const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  
  const result = await authStore.login(form)
  
  if (result.success) {
    router.push('/dashboard')
  } else {
    errorMessage.value = result.message
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  position: relative;
  overflow: hidden;
  padding: 1rem;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.login-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
  animation: floatShape 20s infinite ease-in-out;
}

.shape:nth-child(1) {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape:nth-child(2) {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  top: 60%;
  right: 10%;
  animation-delay: -7s;
}

.shape:nth-child(3) {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  bottom: 10%;
  left: 30%;
  animation-delay: -14s;
}

.shape:nth-child(4) {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  top: 30%;
  right: 25%;
  animation-delay: -3s;
}

@keyframes floatShape {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(30px, -30px) rotate(90deg);
  }
  50% {
    transform: translate(-20px, 20px) rotate(180deg);
  }
  75% {
    transform: translate(40px, 10px) rotate(270deg);
  }
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  padding: 3rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 100px rgba(102, 126, 234, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  width: 100%;
  max-width: 450px;
  backdrop-filter: blur(20px);
  border: 3px solid transparent;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)),
    linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  position: relative;
  z-index: 1;
  animation: cardFloat 3s ease-in-out infinite;
}

@keyframes cardFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

h1 {
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #4facfe);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: rainbow 3s linear infinite;
}

@keyframes rainbow {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 1.8rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.6rem;
  color: #333;
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 3px solid transparent;
  border-radius: 15px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, #667eea, #764ba2);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, #f093fb, #4facfe);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

.btn-login {
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 200% auto;
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 1.2rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

.btn-login::before {
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

.btn-login:hover::before {
  width: 400px;
  height: 400px;
}

.btn-login:hover:not(:disabled) {
  background-position: right center;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 35px rgba(118, 75, 162, 0.5);
}

.btn-login:active {
  transform: translateY(-1px) scale(0.98);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
  color: white;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.demo-info {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(240, 147, 251, 0.1));
  border-radius: 15px;
  font-size: 0.95rem;
  border: 2px solid rgba(102, 126, 234, 0.2);
  text-align: center;
}

.demo-info p {
  margin: 0.5rem 0;
  color: #333;
}

.demo-info strong {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

@media (max-width: 768px) {
  .login-card {
    padding: 2rem;
    max-width: 90%;
    border-radius: 20px;
  }

  h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .shape {
    display: none;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 1.8rem;
  }
}
</style>