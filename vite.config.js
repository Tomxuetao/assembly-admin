import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import { svgBuilder } from './src/utils/svg-builder'

const { resolve } = require('path')

export default defineConfig({
  server: {
    proxy: {
      '/proxyGatewayApi': {
        target: 'http://10.32.186.227:8081',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/proxyGatewayApi/, '')
      },
      '/proxyMainApi': {
        target: 'http://10.32.186.227:8082',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/proxyMainApi/, '')
      },
      '/proxyConfigApi': {
        target: 'http://10.32.186.227:8083',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/proxyConfigApi/, '/yh-event-allocative-center/')
      }
    },
    host: '127.0.0.1',
    port: 3001
  },
  plugins: [
    vue(),
    ElementPlus({
      importStyle: 'sass',
      useSource: true
    }),
    svgBuilder('./src/icons/svg/', '')
  ],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') }
    ]
  },
  optimizeDeps: {
    include: ['lodash']
  },
  build: {
    target: 'chrome80',
    outDir: 'comp-admin',
    minify: 'terser',
    assetsInlineLimit: 5210
  }
})
