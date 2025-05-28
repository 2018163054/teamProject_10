import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    root: '.',              // index.html 위치
    base: './',             // 상대경로 배포용
    build: {
    outDir: 'dist',       // 빌드 산출물
  },
});
