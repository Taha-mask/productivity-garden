import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// One application; react.html remains a lightweight bookmark redirect.
export default defineConfig({
  plugins: [react()],
  build: { rollupOptions: { input: ['index.html', 'react.html'] } },
});
