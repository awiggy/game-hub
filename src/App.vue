<script setup>
import TopNav from './components/TopNav.vue'
</script>

<template>
  <div class="app-shell">
    <TopNav />
    <main class="app-main">
      <router-view />
    </main>
    <footer class="app-footer">
      <div class="container footer-inner">
        <span>🎮 游戏大全 GAME HUB</span>
        <span class="muted">AI 时代的开源小游戏平台 · 即点即玩</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding: 32px 0 48px;
}

.app-footer {
  border-top: var(--border);
  background: var(--card);
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding: 18px 24px;
  font-size: 13px;
  font-weight: 700;
}
</style>
