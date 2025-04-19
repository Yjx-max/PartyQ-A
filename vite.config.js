import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import { VarletImportResolver } from '@varlet/import-resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    components({
      resolvers: [VarletImportResolver(), ElementPlusResolver()]
    }),
    autoImport({
      resolvers: [VarletImportResolver({ autoImport: true }), ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/aut': {
        target: 'https://pass.sdu.edu.cn/cas',
        changeOrigin: true, //改变请求源
        secure: false,  // 不验证 HTTPS 证书
        rewrite: (path) => path.replace(/^\/aut/, '') //重写路径
      },
    },
  }
})
