// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false, // SPA mode to simplify CORS / client requests
  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || 'http://localhost:3000/api'
    }
  },
  vite: {
    server: {
      host: true
    }
  }
});
