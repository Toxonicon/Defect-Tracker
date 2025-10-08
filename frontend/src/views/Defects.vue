<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Дефекты</h2>
      <router-link to="/defects/create" class="btn-primary">
        ➕ Создать дефект
      </router-link>
    </div>
    
    <div class="text-center py-12">
      <div class="text-6xl mb-4">🐛</div>
      <p class="text-gray-500">Список дефектов будет здесь</p>
    </div>
  </div>
</template>