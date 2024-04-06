import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env': {}
  },
  server: {
    port: 3000
  },
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
    ],
  },
});
