<template>
  <form @submit.prevent="submit" style="display:flex;flex-direction:column;gap:8px;max-width:600px">
    <input v-model="title" placeholder="Title" required />
    <textarea v-model="description" placeholder="Description"></textarea>
    <input v-model="projectId" placeholder="Project ID (optional)" />
    <select v-model="priority">
      <option value="low">low</option>
      <option value="medium">medium</option>
      <option value="high">high</option>
      <option value="critical">critical</option>
    </select>
    <input v-model="assigneeId" placeholder="Assignee ID (optional)" />
    <input type="date" v-model="dueDate" />
    <input type="file" ref="file" multiple />
    <button type="submit">Create</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import useApi from '~/composables/useApi';
const title = ref('');
const description = ref('');
const projectId = ref('');
const priority = ref('medium');
const assigneeId = ref('');
const dueDate = ref('');
const file = ref(null);
const emit = defineEmits(['created']);
const api = useApi();

async function submit(){
  const form = new FormData();
  form.append('title', title.value);
  form.append('description', description.value);
  if (projectId.value) form.append('projectId', projectId.value);
  if (priority.value) form.append('priority', priority.value);
  if (assigneeId.value) form.append('assigneeId', assigneeId.value);
  if (dueDate.value) form.append('dueDate', dueDate.value);
  const files = file.value?.files;
  if (files) for (const f of files) form.append('attachments', f);
  const r = await api.postForm('/defects', form);
  if (r && r.id) {
    alert('Created');
    emit('created');
  } else {
    alert(r.error || 'Error');
  }
}
</script>
