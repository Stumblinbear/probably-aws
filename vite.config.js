import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import ViteRadar from 'vite-plugin-radar'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    Components({
      directoryAsNamespace: true
    }),
    ViteRadar({
      enableDev: true,
      
      analytics: {
        id: 'G-H5BP13WS65',
      },
    })
  ]
})
