// vite.config.ts 파일
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    // 프록시 설정
    proxy: {
      '/api' : {
        target: 'http://192.168.30.51:8080',  // (port) 서버 주소
        changeOrigin: true,               // 요청헤더의 Host 도 변경
        secure: false,                    // https 지원 여부
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // 이미지 업로드 경로 프록시 추가
      '/upload': {
        target: 'http://192.168.30.51:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/upload/, '/upload'), // /upload 경로를 유지
      }
    }
  }
})

