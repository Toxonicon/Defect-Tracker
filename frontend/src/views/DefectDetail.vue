<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Детали дефекта</h2>
    <div class="text-center py-12">
      <div class="text-6xl mb-4">🐛</div>
      <p class="text-gray-500">Детали дефекта {{ id }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps(['id'])
</script>