import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Начинаем всегда с пустого состояния для демонстрации окна входа
  const token = ref(null)
  const user = ref(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials) => {
    loading.value = true
    
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    try {
      // Простая проверка - любые данные считаются валидными
      if (credentials.email && credentials.password) {
        const mockUser = {
          id: 1,
          email: credentials.email,
          firstName: 'Тест',
          lastName: 'Пользователь',
          fullName: 'Тест Пользователь',
          role: 'engineer'
        }
        
        const mockToken = 'demo-token-' + Date.now()
        
        token.value = mockToken
        user.value = mockUser
        localStorage.setItem('token', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))
        
        return { success: true }
      } else {
        return {
          success: false,
          message: 'Введите email и пароль'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка при входе'
      }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    login,
    logout
  }
})