<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <div class="flex h-16 items-center justify-center border-b border-gray-200">
        <h1 class="text-xl font-bold text-gray-900">Defect Tracker</h1>
      </div>
      
      <nav class="mt-8 px-4">
        <div class="space-y-2">
          <router-link
            to="/dashboard"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="$route.name === 'Dashboard' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'"
          >
            📊 Панель управления
          </router-link>
          
          <router-link
            to="/projects"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="$route.name === 'Projects' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'"
          >
            🏗️ Проекты
          </router-link>
          
          <router-link
            to="/defects"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="$route.name === 'Defects' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'"
          >
            🐛 Дефекты
          </router-link>
          
          <router-link
            v-if="['manager', 'supervisor'].includes(authStore.user?.role)"
            to="/reports"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="$route.name === 'Reports' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'"
          >
            📈 Отчеты
          </router-link>
        </div>
      </nav>
    </div>

    <!-- Main content -->
    <div class="ml-64">
      <!-- Top bar -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="flex h-16 items-center justify-between px-6">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ getPageTitle() }}
          </h2>
          
          <div class="flex items-center space-x-4">
            <!-- User menu -->
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                  {{ authStore.user?.firstName?.charAt(0) }}{{ authStore.user?.lastName?.charAt(0) }}
                </div>
                <span class="text-sm font-medium text-gray-700">
                  {{ authStore.user?.fullName }}
                </span>
              </button>
              
              <!-- Dropdown menu -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  👤 Профиль
                </router-link>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  🚪 Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-6">
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