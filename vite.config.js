// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      formats: ['cjs', 'es', 'umd'],
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'nodeToDataURL',
      fileName: 'html-element-to-image',
    }
  },
})