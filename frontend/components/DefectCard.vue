<template>
  <div style="border:1px solid #ddd;padding:12px;margin:8px 0;border-radius:6px;">
    <h3>{{ defect.title }} <small>({{ defect.status }})</small></h3>
    <div><strong>Project:</strong> {{ defect.project_title || '—' }}</div>
    <div><strong>Priority:</strong> {{ defect.priority }}</div>
    <div><strong>Reporter:</strong> {{ defect.reporter_email }}</div>
    <div style="margin-top:8px">{{ defect.description }}</div>
  </div>
</template>

<script setup>
defineProps({ defect: Object });
</script>
