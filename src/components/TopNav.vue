<template>
  <header class="topnav">
    <div class="container topnav-inner">
      <router-link to="/" class="logo">
        <span class="logo-box">🎮</span>
        <span class="logo-text">
          <b>游戏大全</b>
          <i>GAME HUB</i>
        </span>
      </router-link>

      <nav class="nav-links">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/library" class="nav-link">游戏库</router-link>
        <router-link to="/create" class="nav-link nav-ai">⚡ AI 创作</router-link>
        <router-link to="/settings" class="nav-gear" title="AI 服务配置">⚙️</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.topnav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--card);
  border-bottom: var(--border);
}

.topnav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-box {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  font-size: 20px;
  background: var(--blue);
  border: var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.logo-text b {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 2px;
}

.logo-text i {
  font-style: normal;
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--blue);
  font-weight: 700;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-link {
  padding: 8px 14px;
  border-radius: var(--radius);
  font-size: 15px;
  font-weight: 700;
  border: 2px solid transparent;
}

.nav-link:hover {
  background: var(--paper);
}

.nav-link.router-link-exact-active {
  background: var(--yellow);
  border: var(--border);
  box-shadow: var(--shadow-sm);
}

.nav-ai {
  background: var(--blue);
  color: #fff;
  border: var(--border);
  box-shadow: var(--shadow-sm);
}

.nav-ai:hover {
  background: var(--blue-deep);
}

.nav-ai.router-link-exact-active {
  background: var(--blue-deep);
  color: #fff;
}

.nav-gear {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 2px solid transparent;
  border-radius: var(--radius);
  font-size: 17px;
}

.nav-gear:hover {
  background: var(--paper);
  border-color: var(--ink);
}
</style>
