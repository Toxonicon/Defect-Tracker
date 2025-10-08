<template>
  <div class="layout">
    <!-- Плавающие цветные частицы -->
    <div class="floating-particles">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>

    <!-- Радужная навигация -->
    <nav class="navbar">
      <div class="nav-content">
        <h1 class="logo rainbow-text">✨ Defect Tracker</h1>
        <div class="nav-links">
          <router-link to="/dashboard" class="nav-link">
            <span class="icon">🏠</span> Дашборд
          </router-link>
          <router-link to="/projects" class="nav-link">
            <span class="icon">📁</span> Проекты
          </router-link>
          <router-link to="/defects" class="nav-link">
            <span class="icon">🐛</span> Дефекты
          </router-link>
          <button @click="logout" class="logout-btn">
            <span class="icon">👋</span> Выйти
          </button>
        </div>
      </div>
    </nav>

    <!-- Основной контент -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  router.push('/auth/login')
}
</script>

<style scoped>
.layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.navbar {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  backdrop-filter: blur(20px);
  border-bottom: 3px solid transparent;
  background-image: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85)),
    linear-gradient(90deg, #667eea, #764ba2, #f093fb, #4facfe);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  padding: 1rem 0;
  flex-shrink: 0;
  width: 100%;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
  z-index: 100;
  position: relative;
}

.nav-content {
  width: 100%;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transition: left 0.5s;
}

.nav-link:hover::before {
  left: 100%;
}

.nav-link:hover {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, #f093fb, #4facfe);
  color: white;
  border-color: white;
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
}

.icon {
  font-size: 1.2rem;
}

.logout-btn {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.3);
}

.logout-btn:hover {
  background: linear-gradient(135deg, #f5576c, #ff006e);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 0, 110, 0.4);
}

.main-content {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }

  .logo {
    font-size: 1.5rem;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }

  .nav-link, .logout-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>