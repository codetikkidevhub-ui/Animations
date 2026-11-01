import { copyFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'three/index': 'src/three/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'motion', 'three', '@react-three/fiber', '@react-three/drei'],
  onSuccess: async () => {
    copyFileSync('src/styles.css', 'dist/styles.css');
  },
});
