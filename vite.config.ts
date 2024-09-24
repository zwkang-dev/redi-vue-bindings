import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// 写一个 vite vue 包的配置文件
export default defineConfig({
  plugins: [dts({
    copyDtsFiles: true,
  }), vue()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'redi-vue-binding',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@vueuse/core', '@wendellhu/redi'],
    },
  },
})
