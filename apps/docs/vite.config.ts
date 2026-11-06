import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Serve the library from source so demos always reflect the latest code
      '@codetikki/animations/styles.css': fileURLToPath(
        new URL('../../packages/animations/src/styles.css', import.meta.url),
      ),
      '@codetikki/animations/three': fileURLToPath(
        new URL('../../packages/animations/src/three/index.ts', import.meta.url),
      ),
      '@codetikki/animations': fileURLToPath(
        new URL('../../packages/animations/src/index.ts', import.meta.url),
      ),
      'animations-src': fileURLToPath(new URL('../../packages/animations/src', import.meta.url)),
    },
  },
});
