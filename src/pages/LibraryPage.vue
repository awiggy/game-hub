<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import games from "../data/games.json";
import { CATEGORIES, catName } from "../game-meta";
import GameCard from "../components/GameCard.vue";
import HubIcon from "../components/HubIcon.vue";
const route = useRoute(),
  router = useRouter();
const activeCat = computed(() =>
  CATEGORIES.some((c) => c.id === route.query.cat) ? route.query.cat : "",
);
const search = computed({
  get: () => (typeof route.query.q === "string" ? route.query.q : ""),
  set: (q) => router.replace({ query: { ...route.query, q: q || undefined } }),
});
const sortBy = computed({
  get: () => (route.query.sort === "name" ? "name" : "new"),
  set: (sort) => router.replace({ query: { ...route.query, sort } }),
});
const counts = computed(() =>
  Object.fromEntries(
    CATEGORIES.map((c) => [
      c.id,
      games.filter((g) => g.categories.includes(c.id)).length,
    ]),
  ),
);
const filtered = computed(() => {
  const list = games.filter(
    (g) =>
      (!activeCat.value || g.categories.includes(activeCat.value)) &&
      [g.name, g.summary, ...g.tags]
        .join(" ")
        .toLowerCase()
        .includes(search.value.trim().toLowerCase()),
  );
  return list.sort(
    sortBy.value === "name"
      ? (a, b) => a.name.localeCompare(b.name, "zh")
      : (a, b) => b.createdAt.localeCompare(a.createdAt),
  );
});
function selectCat(cat) {
  router.push({ query: { ...route.query, cat: cat || undefined } });
}
function randomGame() {
  const pool = filtered.value.length ? filtered.value : games;
  router.push("/game/" + pool[Math.floor(Math.random() * pool.length)].id);
}
function clear() {
  router.replace({ query: {} });
}
</script>
<template>
  <div class="container library-page">
    <header class="library-header">
      <div>
        <p class="eyebrow">THE GAME COLLECTION / {{ games.length }} GAMES</p>
        <h1>下一局，玩什么？</h1>
        <p>熟悉的经典，偶遇的新鲜。把喜欢的游戏慢慢找出来。</p>
      </div>
      <button class="btn btn-primary" @click="randomGame">
        <HubIcon name="shuffle" :size="17" />随机开一局
      </button>
    </header>
    <nav class="filter-tabs" aria-label="游戏分类">
      <button
        :class="{ active: !activeCat }"
        :aria-pressed="!activeCat"
        @click="selectCat('')"
      >
        全部<small>{{ games.length }}</small></button
      ><button
        v-for="c in CATEGORIES"
        :key="c.id"
        :class="{ active: activeCat === c.id }"
        :aria-pressed="activeCat === c.id"
        @click="selectCat(c.id)"
      >
        {{ c.name }}<small>{{ counts[c.id] }}</small>
      </button>
    </nav>
    <section aria-label="游戏列表">
      <div class="toolbar">
        <h2>
          {{ activeCat ? catName(activeCat) : "全部" }}游戏<span>{{
            filtered.length
          }}</span>
        </h2>
        <div class="toolbar-controls">
          <label class="search-field"
            ><HubIcon name="search" :size="17" /><input
              v-model="search"
              type="search"
              placeholder="搜索游戏 / 玩法"
              aria-label="在游戏库中搜索" /></label
          ><select v-model="sortBy" aria-label="游戏排序">
            <option value="new">最新加入</option>
            <option value="name">按名称</option>
          </select>
        </div>
      </div>
      <div v-if="search" class="search-summary" aria-live="polite">
        “{{ search }}” 的搜索结果<button @click="search = ''">
          清除搜索<HubIcon name="close" :size="13" />
        </button>
      </div>
      <div v-if="filtered.length" class="game-grid">
        <GameCard v-for="(g, i) in filtered" :key="g.id" :game="g" :index="i" />
      </div>
      <div v-else class="empty">
        <HubIcon name="search" :size="35" />
        <h3>还没找到这款游戏。</h3>
        <p>换个关键词，或看看其他分类吧。</p>
        <button class="btn btn-primary" @click="clear">看看全部游戏</button>
      </div>
      <p v-if="filtered.length" class="shelf-end">
        END OF COLLECTION / {{ filtered.length }} GAMES
      </p>
    </section>
  </div>
</template>
<style scoped>
.library-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: 17px 0 30px;
}
.library-header h1 {
  font-size: 43px;
  letter-spacing: -2px;
  line-height: 1.25;
  font-weight: 900;
  margin: 0 0 13px;
}
.library-header p:last-child {
  font-size: 13px;
  color: var(--muted);
  margin: 0;
  line-height: 1.8;
}
.library-header .eyebrow {
  color: #558179;
  font-size: 10px;
  margin-bottom: 15px;
}
.filter-tabs {
  display: flex;
  gap: 0;
  align-items: center;
  overflow-x: auto;
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--ink);
  scrollbar-width: thin;
  margin-bottom: 27px;
}
.filter-tabs button {
  border: 0;
  background: none;
  white-space: nowrap;
  padding: 17px 19px;
  position: relative;
  font-size: 12px;
  color: var(--muted);
  flex: 1;
}
.filter-tabs button:first-child {
  padding-left: 12px;
}
.filter-tabs button small {
  font: 9px var(--mono);
  margin-left: 8px;
  opacity: 0.65;
}
.filter-tabs button.active {
  color: var(--ink);
  font-weight: 750;
  background: #e7ede4;
}
.filter-tabs button.active::after {
  content: "";
  position: absolute;
  height: 3px;
  bottom: 0;
  left: 15px;
  right: 15px;
  background: var(--blue);
}
.filter-tabs button:hover {
  color: var(--blue);
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px;
}
.toolbar h2 {
  font-size: 24px;
  letter-spacing: -0.7px;
  margin: 0;
}
.toolbar h2 span {
  font: 11px var(--mono);
  color: var(--muted);
  margin-left: 12px;
  vertical-align: middle;
}
.toolbar-controls {
  display: flex;
  gap: 13px;
  align-items: center;
}
.search-field {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #a3ada9;
  padding: 8px 0;
  color: var(--muted);
}
.search-field:focus-within {
  border-color: var(--blue);
}
.search-field input {
  border: 0;
  background: none;
  outline: none;
  min-width: 0;
  width: 195px;
  font-size: 12px;
}
.toolbar select {
  font-size: 12px;
  padding: 9px 7px;
  border: var(--border);
  border-radius: 0;
  background: transparent;
}
.search-summary {
  display: flex;
  align-items: center;
  gap: 13px;
  margin: -6px 0 22px;
  color: var(--muted);
  font-size: 12px;
}
.search-summary button {
  display: flex;
  align-items: center;
  gap: 5px;
  border: 0;
  background: none;
  font-size: 11px;
  color: var(--blue);
}
.empty {
  text-align: center;
  padding: 65px 15px;
}
.empty svg {
  color: #448a7a;
}
.empty h3 {
  font-size: 24px;
  margin: 20px 0 8px;
}
.empty p {
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 25px;
}
.shelf-end {
  font: 9px var(--mono);
  letter-spacing: 1.5px;
  color: var(--muted);
  text-align: center;
  margin: 45px 0 0;
}
@media (max-width: 1050px) {
  .filter-tabs button {
    padding: 16px 15px;
  }
  .filter-tabs button small {
    margin-left: 5px;
  }
  .library-header h1 {
    font-size: 38px;
  }
}
@media (max-width: 680px) {
  .library-header {
    padding: 7px 0 24px;
    gap: 20px;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  .library-header h1 {
    font-size: 33px;
    letter-spacing: -1.3px;
  }
  .library-header .eyebrow {
    font-size: 8px;
    letter-spacing: 1px;
  }
  .library-header p:last-child {
    font-size: 11px;
  }
  .library-header .btn {
    font-size: 12px;
    padding: 10px 18px;
    min-height: 40px;
  }
  .filter-tabs {
    margin-bottom: 22px;
  }
  .filter-tabs button {
    padding: 14px 15px;
  }
  .filter-tabs button small {
    display: none;
  }
  .toolbar {
    flex-wrap: wrap;
    gap: 17px;
  }
  .toolbar h2 {
    font-size: 23px;
  }
  .toolbar-controls {
    width: 100%;
  }
  .search-field {
    flex: 1;
  }
  .search-field input {
    width: 100%;
  }
  .toolbar select {
    font-size: 11px;
  }
  .game-grid :deep(.game-index) {
    display: none;
  }
}
</style>
