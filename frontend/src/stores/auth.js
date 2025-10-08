import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'))
  const user = ref(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials) => {
    loading.value = true
    try {
      const response = await api.post('/auth/login', credentials)
      
      if (response.data.success) {
        token.value = response.data.token
        user.value = response.data.user
        localStorage.setItem('token', token.value)
        api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        return { success: true }
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Ошибка при входе'
      }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    try {
      const response = await api.post('/auth/register', userData)
      
      if (response.data.success) {
        token.value = response.data.token
        user.value = response.data.user
        localStorage.setItem('token', token.value)
        api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        return { success: true }
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Ошибка при регистрации'
      }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }

  const loadUser = async () => {
    if (!token.value) return

    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      const response = await api.get('/auth/profile')
      
      if (response.data.success) {
        user.value = response.data.user
      } else {
        logout()
      }
    } catch (error) {
      logout()
    }
  }

  // Initialize auth state
  if (token.value) {
    loadUser()
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    loadUser
  }
})