<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-20 w-20 bg-primary-500 rounded-full flex items-center justify-center mb-6">
          <span class="text-2xl text-white font-bold">🏗️</span>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Регистрация</h2>
        <p class="mt-2 text-sm text-gray-600">
          Создайте аккаунт для доступа к системе
        </p>
      </div>

      <!-- Registration Form -->
      <div class="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                Имя
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                class="form-input"
                placeholder="Иван"
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                Фамилия
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                class="form-input"
                placeholder="Иванов"
              />
            </div>
          </div>

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
            <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
              Роль
            </label>
            <select
              id="role"
              v-model="form.role"
              required
              class="form-select"
            >
              <option value="">Выберите роль</option>
              <option value="engineer">👷‍♂️ Инженер</option>
              <option value="manager">👨‍💼 Менеджер</option>
              <option value="supervisor">👁️ Наблюдатель/Руководитель</option>
            </select>
          </div>

          <div>
            <label for="position" class="block text-sm font-medium text-gray-700 mb-2">
              Должность (необязательно)
            </label>
            <input
              id="position"
              v-model="form.position"
              type="text"
              class="form-input"
              placeholder="Главный инженер"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Телефон (необязательно)
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="form-input"
              placeholder="+7 (999) 123-45-67"
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
              <span v-if="authStore.loading">Регистрация...</span>
              <span v-else>Создать аккаунт</span>
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Уже есть аккаунт?
              <router-link to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
                Войти
              </router-link>
            </p>
          </div>
        </form>
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
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  position: '',
  phone: '',
  password: ''
})

const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  
  const result = await authStore.register(form)
  
  if (result.success) {
    router.push('/dashboard')
  } else {
    errorMessage.value = result.message
  }
}
</script>