<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// Основное приложение
</script>

<style>
#app {
  background: white;
  width: 100%;
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
/* Навигационные ссылки */
.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-decoration: none;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.nav-link-active {
  background: var(--primary-gradient);
  color: white !important;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.mobile-nav-link {
  display: block;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  text-decoration: none;
}

.mobile-nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

/* Кнопка уведомлений */
.notification-btn {
  position: relative;
  padding: 0.5rem;
  border-radius: 9999px;
  transition: background-color 0.3s ease;
  border: none;
  background: transparent;
  cursor: pointer;
}

.notification-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.notification-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  width: 1.25rem;
  height: 1.25rem;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

/* Профиль пользователя */
.profile-btn {
  padding: 0.5rem;
  border-radius: 9999px;
  transition: background-color 0.3s ease;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.profile-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.profile-menu {
  backdrop-filter: blur(20px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.menu-item {
  width: 100%;
  text-align: left;
  padding: 0.75rem;
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  border: none;
  background: transparent;
  cursor: pointer;
}

.menu-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

/* Плавающая кнопка помощи */
.help-fab {
  animation: floating 3s ease-in-out infinite;
}

.help-fab:hover {
  transform: translateY(-5px) scale(1.1);
}

/* Загрузочный спиннер */
.loading-spinner {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid var(--neon-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Элементы помощи */
.help-item {
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Уведомления */
.notification-item {
  transition: all 0.3s ease;
}

.notification-item:hover {
  transform: translateX(5px);
}

/* Адаптивность */
@media (max-width: 768px) {
  .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .help-fab {
    width: 3.5rem;
    height: 3.5rem;
    bottom: 1rem;
    right: 1rem;
  }
  
  .help-fab span {
    font-size: 1.25rem;
  }
}

/* Дополнительные утилиты */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.space-x-3 > * + * {
  margin-left: 0.75rem;
}

.space-x-4 > * + * {
  margin-left: 1rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.hidden {
  display: none;
}

@media (min-width: 768px) {
  .md\\:flex {
    display: flex;
  }
  
  .md\\:hidden {
    display: none;
  }
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.fixed {
  position: fixed;
}

.top-4 {
  top: 1rem;
}

.right-4 {
  right: 1rem;
}

.top-full {
  top: 100%;
}

.right-0 {
  right: 0;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-6 {
  margin-top: 1.5rem;
}

.pt-6 {
  padding-top: 1.5rem;
}

.border-t {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.w-48 {
  width: 12rem;
}

.w-80 {
  width: 20rem;
}

.p-3 {
  padding: 0.75rem;
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.font-bold {
  font-weight: 700;
}

.font-medium {
  font-weight: 500;
}

.text-white {
  color: white;
}

.text-white-70 {
  color: rgba(255, 255, 255, 0.7);
}

.text-white-60 {
  color: rgba(255, 255, 255, 0.6);
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.5);
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.z-50 {
  z-index: 50;
}

.z-40 {
  z-index: 40;
}

.z-10 {
  z-index: 10;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mt-4 {
  margin-top: 1rem;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.pb-8 {
  padding-bottom: 2rem;
}

.max-h-96 {
  max-height: 24rem;
}

.overflow-y-auto {
  overflow-y: auto;
}

.bottom-6 {
  bottom: 1.5rem;
}

.right-6 {
  right: 1.5rem;
}

.bottom-24 {
  bottom: 6rem;
}

.w-16 {
  width: 4rem;
}

.h-16 {
  height: 4rem;
}

.rounded-full {
  border-radius: 9999px;
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.top-20 {
  top: 5rem;
}

.max-w-4xl {
  max-width: 56rem;
}

.w-full {
  width: 100%;
}

.max-h-90vh {
  max-height: 90vh;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.bg-black-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.bg-black-80 {
  background-color: rgba(0, 0, 0, 0.8);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.group:hover .group-hover\\:scale-110 {
  transform: scale(1.1);
}

.transition-all {
  transition: all 0.3s ease;
}

.duration-300 {
  transition-duration: 0.3s;
}

.duration-500 {
  transition-duration: 0.5s;
}

.cursor-pointer {
  cursor: pointer;
}

.bg-white-10 {
  background-color: rgba(255, 255, 255, 0.1);
}

.bg-white-20 {
  background-color: rgba(255, 255, 255, 0.2);
}

.rounded-lg {
  border-radius: 0.5rem;
}

.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.m-4 {
  margin: 1rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.text-center {
  text-align: center;
}

.flex-1 {
  flex: 1;
}

.ml-4 {
  margin-left: 1rem;
}
</style>
