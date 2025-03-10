import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://10.250.251.192:8888', // 目标接口域名
        changeOrigin: true, // 是否启用虚拟主机名
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径，去掉路径前面的'/api'
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
