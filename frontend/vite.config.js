import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://patient-management-system-sgri.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
