import { defineConfig } from 'vite'

export default defineConfig({
  base: '/memory-game/',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ``
      }
    }
  }
})