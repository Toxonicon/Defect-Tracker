<template>
  <div style="max-width:500px">
    <h2>Login</h2>
    <form @submit.prevent="submit">
      <div><input v-model="email" placeholder="email" required /></div>
      <div><input v-model="password" type="password" placeholder="password" required /></div>
      <button type="submit">Login</button>
    </form>
    <p>Demo accounts: manager@example.com / engineer@example.com (password123)</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useApi from '~/composables/useApi';
const email = ref('');
const password = ref('');
const api = useApi();
const router = useRouter();

async function submit(){
  const r = await api.post('/auth/login', { email: email.value, password: password.value });
  if (r.token) {
    localStorage.setItem('token', r.token);
    // redirect to defects
    router.push('/defects');
  } else {
    alert(r.error || 'Login failed');
  }
}
</script>
