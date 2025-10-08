<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Load user data if token exists
  if (authStore.token) {
    authStore.loadUser()
  }
})
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>
