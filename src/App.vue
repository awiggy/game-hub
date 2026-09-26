<script setup>
import TopNav from "./components/TopNav.vue";
function focusMain() {
  document.getElementById("main-content")?.focus();
}
</script>
<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content" @click.prevent="focusMain"
      >跳到主要内容</a
    ><TopNav />
    <main id="main-content" tabindex="-1" class="app-main">
      <router-view />
    </main>
    <footer class="app-footer container">
      <div class="footer-inner">
        <span><b>GAME HUB</b> — 即点即玩</span
        ><span class="footer-middle">留一点时间，给无用而美好的快乐。</span
        ><router-link to="/create">AI 创作 · 演示模式 ↗</router-link>
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
  padding: 18px 0 34px;
}
.footer-inner {
  border-top: 1px solid var(--ink);
  padding: 18px 0 22px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  font-size: 10px;
  color: var(--muted);
}
.footer-inner b {
  font: 700 10px var(--mono);
  letter-spacing: 1px;
  color: var(--ink);
}
.footer-inner a:hover {
  color: var(--blue);
}
.skip-link {
  position: fixed;
  z-index: 100;
  top: -70px;
  left: 16px;
  background: var(--blue);
  color: white;
  padding: 12px;
}
.skip-link:focus {
  top: 10px;
}
@media (max-width: 680px) {
  .app-main {
    padding-top: 16px;
  }
  .footer-middle {
    display: none;
  }
  .footer-inner {
    font-size: 9px;
    gap: 10px;
  }
}
</style>
