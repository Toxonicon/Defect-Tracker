import axios from 'axios'
import mockApi from './mockApi.js'

const USE_MOCK_API = false // Переключатель для использования Mock API

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если бэкенд недоступен, переключаемся на Mock API
    if (USE_MOCK_API || error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.warn('Backend недоступен, использую Mock API')
      return mockApi[error.config.method](error.config.url.replace('/api', ''), error.config.data)
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Прокси для методов с автоматическим переключением на Mock API
const apiProxy = {
  async get(url, config = {}) {
    if (USE_MOCK_API) {
      return mockApi.get(url)
    }
    try {
      return await api.get(url, config)
    } catch (error) {
      console.warn('Переключаюсь на Mock API из-за ошибки:', error.message)
      return mockApi.get(url)
    }
  },

  async post(url, data = {}, config = {}) {
    if (USE_MOCK_API) {
      return mockApi.post(url, data)
    }
    try {
      return await api.post(url, data, config)
    } catch (error) {
      console.warn('Переключаюсь на Mock API из-за ошибки:', error.message)
      return mockApi.post(url, data)
    }
  },

  async put(url, data = {}, config = {}) {
    if (USE_MOCK_API) {
      return mockApi.put(url, data)
    }
    try {
      return await api.put(url, data, config)
    } catch (error) {
      console.warn('Переключаюсь на Mock API из-за ошибки:', error.message)
      return mockApi.put(url, data)
    }
  },

  async delete(url, config = {}) {
    if (USE_MOCK_API) {
      return mockApi.delete(url)
    }
    try {
      return await api.delete(url, config)
    } catch (error) {
      console.warn('Переключаюсь на Mock API из-за ошибки:', error.message)
      return mockApi.delete(url)
    }
  }
}

export default apiProxy