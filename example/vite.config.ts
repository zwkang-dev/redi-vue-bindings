import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [(monacoEditorPlugin as any).default({}), vue()],
  resolve: {
    alias: {
      '@zwkang-dev/redi-vue-binding': path.resolve(__dirname, '../src/index.ts'),
    },
  },
})
