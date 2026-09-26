<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import HubIcon from "./HubIcon.vue";
const route = useRoute(),
  router = useRouter(),
  query = ref(""),
  searchOpen = ref(false);
watch(
  () => route.query.q,
  (q) => {
    query.value = typeof q === "string" ? q : "";
  },
  { immediate: true },
);
function search() {
  router.push({
    path: "/library",
    query: query.value.trim() ? { q: query.value.trim() } : {},
  });
  searchOpen.value = false;
}
</script>
<template>
  <header class="topnav">
    <div class="container">
      <div class="nav-inner">
        <router-link to="/" class="logo" aria-label="游戏大全首页"
          ><b>游戏大全</b><span>GAME<br />HUB</span></router-link
        >
        <nav aria-label="主导航">
          <router-link to="/">发现</router-link
          ><router-link to="/library">游戏库</router-link
          ><router-link to="/create">AI 创作<small>演示</small></router-link>
        </nav>
        <div class="nav-tools">
          <button
            class="search-toggle"
            :aria-label="searchOpen ? '关闭搜索' : '搜索游戏'"
            :aria-expanded="searchOpen"
            aria-controls="site-search"
            @click="searchOpen = !searchOpen"
          >
            <HubIcon :name="searchOpen ? 'close' : 'search'" :size="20" /><span
              >搜索</span
            ></button
          ><router-link
            to="/settings"
            class="settings-link"
            title="AI 服务配置"
            aria-label="AI 服务配置"
            ><HubIcon name="settings" :size="18"
          /></router-link>
        </div>
      </div>
      <form
        v-if="searchOpen"
        id="site-search"
        class="nav-search"
        role="search"
        @submit.prevent="search"
      >
        <label for="nav-q">找一款游戏</label
        ><input
          id="nav-q"
          v-model="query"
          type="search"
          placeholder="搜索名称或玩法，例如：贪吃蛇"
          aria-label="搜索游戏"
        /><button class="btn btn-primary">
          搜索<HubIcon name="arrow" :size="16" />
        </button>
      </form>
    </div>
  </header>
</template>
<style scoped>
.topnav {
  background: #f3f2ecf7;
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(12px);
}
.nav-inner {
  display: flex;
  align-items: center;
  gap: 35px;
  height: 78px;
  border-bottom: 1px solid var(--ink);
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
}
.logo b {
  font-size: 29px;
  letter-spacing: -1.5px;
  font-weight: 900;
  -webkit-text-stroke: 0.35px currentColor;
}
.logo span {
  font: 800 10px/1.05 var(--mono);
  letter-spacing: 0.5px;
}
nav {
  display: flex;
  align-items: stretch;
  align-self: stretch;
  gap: 43px;
  margin-left: 68px;
}
nav > a {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  font-size: 14px;
  font-weight: 650;
  white-space: nowrap;
}
nav > a.router-link-exact-active::after {
  content: "";
  position: absolute;
  bottom: 16px;
  height: 3px;
  background: var(--blue);
  width: 100%;
}
nav small {
  font-size: 9px;
  padding: 3px 5px;
  background: var(--blue);
  color: white;
  border-radius: 2px;
  font-weight: 500;
  align-self: center;
  transform: translateY(-7px);
}
.nav-tools {
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 18px;
}
.search-toggle {
  display: flex;
  align-items: center;
  gap: 16px;
  background: none;
  border: 0;
  padding: 8px 0;
}
.search-toggle span {
  font-size: 12px;
  border-left: 1px solid #afb6b4;
  padding-left: 16px;
}
.settings-link {
  display: grid;
  place-items: center;
  color: var(--muted);
  padding: 5px;
}
.search-toggle:hover,
.settings-link:hover {
  color: var(--blue);
}
.nav-search {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px 0;
  border-bottom: var(--border);
}
.nav-search label {
  font-size: 12px;
  font-weight: 650;
}
.nav-search input {
  flex: 1;
  min-width: 0;
  background: #faf9f5;
  border: var(--border);
  padding: 12px;
  font-size: 13px;
}
.nav-search .btn {
  min-height: 40px;
  padding: 10px 20px;
}
@media (max-width: 950px) {
  nav {
    margin-left: 25px;
    gap: 28px;
  }
  .logo b {
    font-size: 25px;
  }
  .nav-inner {
    gap: 20px;
  }
  .nav-tools {
    gap: 14px;
  }
}
@media (max-width: 680px) {
  .nav-inner {
    height: 69px;
    gap: 14px;
  }
  .logo b {
    font-size: 23px;
  }
  .logo span {
    font-size: 8px;
  }
  .logo {
    gap: 7px;
  }
  nav {
    margin-left: auto;
    gap: 20px;
  }
  nav > a {
    font-size: 12px;
  }
  .nav-tools {
    margin-left: 0;
    gap: 0;
  }
  .search-toggle span,
  .settings-link {
    display: none;
  }
  nav small {
    display: none;
  }
  .nav-search label {
    display: none;
  }
  .nav-search {
    gap: 10px;
  }
  .nav-search input {
    font-size: 12px;
  }
  .nav-search .btn {
    padding: 10px 14px;
  }
}
@media (max-width: 390px) {
  .logo b {
    font-size: 20px;
  }
  .logo span {
    display: none;
  }
  nav {
    gap: 16px;
  }
  .nav-inner {
    gap: 12px;
  }
}
</style>
