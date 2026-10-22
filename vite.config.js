import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Keep both independent app entries available in the same build.
export default defineConfig({
  plugins: [react()],
  build: { rollupOptions: { input: ['index.html', 'react.html'] } },
});
