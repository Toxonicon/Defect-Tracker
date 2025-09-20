<template>
  <div style="max-width:700px">
    <h2>Create defect</h2>
    <DefectForm @created="onCreated" />
  </div>
</template>

<script setup>
import DefectForm from '~/components/DefectForm.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
function onCreated(){ router.push('/defects'); }
</script>
