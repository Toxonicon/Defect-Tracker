<template>
  <div class="min-h-screen dashboard-container">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 sidebar">
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-icon">DT</div>
          <h1 class="logo-text">Defect Tracker</h1>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-section">
          <router-link
            to="/dashboard"
            class="nav-item"
            :class="{ 'nav-item-active': $route.name === 'Dashboard' }"
          >
            <span class="nav-icon">⚡</span>
            <span class="nav-text">Панель управления</span>
          </router-link>
          
          <router-link
            to="/projects"
            class="nav-item"
            :class="{ 'nav-item-active': $route.name === 'Projects' }"
          >
            <span class="nav-icon">📋</span>
            <span class="nav-text">Проекты</span>
          </router-link>
          
          <router-link
            to="/defects"
            class="nav-item"
            :class="{ 'nav-item-active': $route.name === 'Defects' }"
          >
            <span class="nav-icon">⚠</span>
            <span class="nav-text">Дефекты</span>
          </router-link>
          
          <router-link
            v-if="['manager', 'supervisor'].includes(authStore.user?.role)"
            to="/reports"
            class="nav-item"
            :class="{ 'nav-item-active': $route.name === 'Reports' }"
          >
            <span class="nav-icon">�</span>
            <span class="nav-text">Отчеты</span>
          </router-link>
        </div>
      </nav>
    </div>

    <!-- Main content -->
    <div class="main-content">
      <!-- Top bar -->
      <header class="topbar">
        <div class="topbar-content">
          <h2 class="page-title">
            {{ getPageTitle() }}
          </h2>
          
          <div class="topbar-actions">
            <!-- User menu -->
            <div class="user-menu-container">
              <button
                @click="showUserMenu = !showUserMenu"
                class="user-menu-trigger"
              >
                <div class="user-avatar">
                  {{ authStore.user?.firstName?.charAt(0) }}{{ authStore.user?.lastName?.charAt(0) }}
                </div>
                <span class="user-name">
                  {{ authStore.user?.fullName }}
                </span>
                <svg class="chevron-icon" :class="{ 'rotate-180': showUserMenu }" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <!-- Dropdown menu -->
              <transition name="dropdown">
                <div
                  v-if="showUserMenu"
                  class="user-dropdown"
                >
                  <router-link
                    to="/profile"
                    class="dropdown-item"
                    @click="showUserMenu = false"
                  >
                    <span class="dropdown-icon">👤</span>
                    <span>Профиль</span>
                  </router-link>
                  <button
                    @click="logout"
                    class="dropdown-item logout-item"
                  >
                    <span class="dropdown-icon">⚡</span>
                    <span>Выйти</span>
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)

const getPageTitle = () => {
  const titles = {
    Dashboard: 'Панель управления',
    Projects: 'Проекты',
    Defects: 'Дефекты',
    Reports: 'Отчеты',
    Profile: 'Профиль'
  }
  return titles[router.currentRoute.value.name] || 'Defect Tracker'
}

const logout = () => {
  authStore.logout()
  router.push('/auth/login')
}

// Close user menu on outside click
const closeMenuOnOutsideClick = (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenuOnOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenuOnOutsideClick)
})
</script>

<style scoped>
.dashboard-container {
  background: linear-gradient(135deg, 
    rgba(248, 250, 252, 1) 0%, 
    rgba(241, 245, 249, 1) 100%);
}

/* Sidebar Styles */
.sidebar {
  background: linear-gradient(180deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(248, 250, 252, 0.95) 100%);
  backdrop-filter: blur(20px);
  border-right: 2px solid rgba(148, 163, 184, 0.1);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid rgba(148, 163, 184, 0.1);
  background: linear-gradient(135deg, 
    rgba(8, 145, 178, 0.05) 0%, 
    rgba(255, 255, 255, 0.8) 100%);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 24px;
  font-weight: 700;
  color: #0891b2;
  text-shadow: 0 2px 4px rgba(8, 145, 178, 0.3);
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sidebar-nav {
  padding: 24px 16px;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #0891b2, #06b6d4);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.nav-item:hover {
  background: linear-gradient(135deg, 
    rgba(8, 145, 178, 0.1) 0%, 
    rgba(59, 130, 246, 0.05) 100%);
  color: #0891b2;
  transform: translateX(4px);
}

.nav-item:hover::before {
  transform: scaleY(1);
}

.nav-item-active {
  background: linear-gradient(135deg, 
    rgba(8, 145, 178, 0.15) 0%, 
    rgba(59, 130, 246, 0.1) 100%);
  color: #0891b2;
  box-shadow: 0 4px 12px rgba(8, 145, 178, 0.2);
}

.nav-item-active::before {
  transform: scaleY(1);
}

.nav-icon {
  font-size: 20px;
  transition: transform 0.3s ease;
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

.nav-text {
  font-size: 14px;
}

/* Main Content */
.main-content {
  margin-left: 256px;
  min-height: 100vh;
}

/* Topbar */
.topbar {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(248, 250, 252, 0.9) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 2px solid rgba(148, 163, 184, 0.1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 40;
}

.topbar-content {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* User Menu */
.user-menu-container {
  position: relative;
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.8) 0%, 
    rgba(248, 250, 252, 0.8) 100%);
  border: 2px solid rgba(148, 163, 184, 0.2);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-menu-trigger:hover {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 1) 0%, 
    rgba(248, 250, 252, 1) 100%);
  border-color: rgba(8, 145, 178, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(8, 145, 178, 0.15);
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  transition: transform 0.3s ease;
}

.chevron-icon.rotate-180 {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 200px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(248, 250, 252, 0.95) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(148, 163, 184, 0.2);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  padding: 8px;
  z-index: 50;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  background: none;
  cursor: pointer;
}

.dropdown-item:hover {
  background: linear-gradient(135deg, 
    rgba(8, 145, 178, 0.1) 0%, 
    rgba(59, 130, 246, 0.05) 100%);
  color: #0891b2;
}

.logout-item:hover {
  background: linear-gradient(135deg, 
    rgba(239, 68, 68, 0.1) 0%, 
    rgba(248, 113, 113, 0.05) 100%);
  color: #dc2626;
}

.dropdown-icon {
  font-size: 16px;
}

/* Page Content */
.page-content {
  padding: 32px;
  min-height: calc(100vh - 80px);
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
  }
  
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .topbar-content {
    padding: 0 16px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .page-content {
    padding: 16px;
  }
  
  .user-name {
    display: none;
  }
}

@media (max-width: 480px) {
  .user-dropdown {
    width: 180px;
    right: -16px;
  }
  
  .page-content {
    padding: 12px;
  }
}
</style>