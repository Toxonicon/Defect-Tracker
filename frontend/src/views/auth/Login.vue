<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-20 w-20 bg-primary-500 rounded-full flex items-center justify-center mb-6">
          <span class="text-2xl text-white font-bold">🏗️</span>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Defect Tracker</h2>
        <p class="mt-2 text-sm text-gray-600">
          Система управления дефектами на строительных объектах
        </p>
      </div>

      <!-- Login Form -->
      <div class="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email адрес
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="form-input"
              placeholder="example@company.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="form-input"
              placeholder="••••••••"
            />
          </div>

          <!-- Error message -->
          <div v-if="errorMessage" class="bg-danger-50 border border-danger-200 rounded-lg p-3">
            <p class="text-sm text-danger-700">{{ errorMessage }}</p>
          </div>

          <div>
            <button
              type="submit"
              :disabled="authStore.loading"
              class="btn-primary w-full"
            >
              <span v-if="authStore.loading">Вход...</span>
              <span v-else>Войти в систему</span>
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Нет аккаунта?
              <router-link to="/auth/register" class="font-medium text-primary-600 hover:text-primary-500">
                Зарегистрироваться
              </router-link>
            </p>
          </div>
        </form>
      </div>

      <!-- Demo accounts -->
      <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 class="text-sm font-medium text-gray-900 mb-3">Демо аккаунты:</h3>
        <div class="space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-gray-600">👨‍💼 Менеджер:</span>
            <span class="font-mono">manager@demo.com / demo123</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">👷‍♂️ Инженер:</span>
            <span class="font-mono">engineer@demo.com / demo123</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">👁️ Наблюдатель:</span>
            <span class="font-mono">supervisor@demo.com / demo123</span>
          </div>
        </div>
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
  email: '',
  password: ''
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