<template>
  <div class="auth-layout">
    <router-view />
  </div>
</template>

<script setup>
// Layout для страниц авторизации
</script>

<style scoped>
.auth-layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}
</style>