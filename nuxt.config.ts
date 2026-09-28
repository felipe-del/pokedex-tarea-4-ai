// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],
  content: {
    // Usa el SQLite integrado de Node (node:sqlite, Node >= 22.5):
    // evita instalar/compilar better-sqlite3 (requiere Visual Studio en Windows)
    experimental: { sqliteConnector: 'native' }
  },
  css: ['~/assets/main.css']
})
