// composables/useApi.ts
export default function useApi() {
  const config = useRuntimeConfig();
  const base = config.public.apiBase.replace(/\/$/, '');

  function tokenHeader() {
    if (process.client) {
      const t = localStorage.getItem('token');
      return t ? { Authorization: `Bearer ${t}` } : {};
    }
    return {};
  }

  async function get(path: string) {
    const res = await fetch(base + path, {
      headers: { 'Content-Type': 'application/json', ...tokenHeader() }
    });
    return res.json();
  }

  async function post(path: string, body: any) {
    const res = await fetch(base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...tokenHeader() },
      body: JSON.stringify(body)
    });
    return res.json();
  }

  async function postForm(path: string, form: FormData) {
    const res = await fetch(base + path, {
      method: 'POST',
      headers: { ...tokenHeader() }, // don't set Content-Type (browser will set boundary)
      body: form
    });
    return res.json();
  }

  return { get, post, postForm };
}
