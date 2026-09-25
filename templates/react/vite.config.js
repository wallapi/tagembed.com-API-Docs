import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development Vite serves the app and passes /api to the Express server.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:3001' },
  },
});
