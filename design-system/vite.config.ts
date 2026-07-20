/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react(), dts({ include: ['src'], rollupTypes: true })],
  build: {
    cssMinify: false,
    lib: {
      entry: r('./src/index.ts'),
      name: 'PhantomUI',
      fileName: 'phantom-ui',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // react/jsx-runtime is intentionally NOT external: bundling the thin
      // automatic-runtime wrapper (it defers to the external `react` global)
      // keeps the UMD build self-contained for JSX under a plain <script>.
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: (assetInfo) =>
          assetInfo.name && assetInfo.name.endsWith('.css')
            ? 'phantom-ui.css'
            : '[name]-[hash][extname]',
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
});
