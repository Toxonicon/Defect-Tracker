<template>
  <div class="layout">
    <!-- Простая навигация -->
    <nav class="navbar">
      <div class="nav-content">
        <h1 class="logo">Defect Tracker</h1>
        <div class="nav-links">
          <router-link to="/dashboard" class="nav-link">Дашборд</router-link>
          <router-link to="/projects" class="nav-link">Проекты</router-link>
          <router-link to="/defects" class="nav-link">Дефекты</router-link>
          <button @click="logout" class="logout-btn">Выйти</button>
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
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.navbar {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 0;
  flex-shrink: 0;
  width: 100%;
}

.nav-content {
  width: 100%;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  color: #0891b2;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #0891b2;
  background: #f0f9ff;
}

.logout-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #dc2626;
}

.main-content {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>