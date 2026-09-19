import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// publicDir 指向 games/：每个子文件夹是一个自包含小游戏，
// 开发时直接以 /snake/index.html 这样的路径访问，构建时整体拷入 dist。
// base 用相对路径：同一份构建可跑在 localhost、GitHub Pages 子路径或任意域名下。
export default defineConfig({
  plugins: [vue()],
  base: './',
  publicDir: 'games',
  server: { port: 5173 },
})
