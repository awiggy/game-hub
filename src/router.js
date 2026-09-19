import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import LibraryPage from './pages/LibraryPage.vue'
import GameDetailPage from './pages/GameDetailPage.vue'
import CreatePage from './pages/CreatePage.vue'
import SettingsPage from './pages/SettingsPage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage, meta: { title: '游戏大全 · GAME HUB' } },
    { path: '/library', name: 'library', component: LibraryPage, meta: { title: '游戏库 · 游戏大全' } },
    { path: '/game/:id', name: 'game', component: GameDetailPage, meta: { title: '游戏详情 · 游戏大全' } },
    { path: '/create', name: 'create', component: CreatePage, meta: { title: 'AI 创作 · 游戏大全' } },
    { path: '/settings', name: 'settings', component: SettingsPage, meta: { title: 'AI 服务配置 · 游戏大全' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = to.meta.title || '游戏大全 · GAME HUB'
})

export default router
