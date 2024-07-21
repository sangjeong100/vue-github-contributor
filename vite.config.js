import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // .env 파일에서 환경 변수를 로드합니다.
  define: {
    'process.env': process.env,
  },
})
