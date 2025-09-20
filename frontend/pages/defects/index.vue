<template>
  <div>
    <h2>Defects</h2>
    <p><NuxtLink to="/defects/create">+ Create defect</NuxtLink></p>
    <div v-if="loading">Loading…</div>
    <div v-else>
      <div v-if="defects.length === 0">No defects</div>
      <div v-for="d in defects" :key="d.id">
        <DefectCard :defect="d" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useApi from '~/composables/useApi';
import DefectCard from '~/components/DefectCard.vue';

const api = useApi();
const defects = ref([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  const r = await api.get('/defects');
  defects.value = r || [];
  loading.value = false;
}

onMounted(()=> load());
</script>
