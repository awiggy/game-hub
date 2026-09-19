<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import gamesData from '../data/games.json'
import { CATEGORIES, catName } from '../game-meta'
import GameCard from '../components/GameCard.vue'

const route = useRoute()
const router = useRouter()

const search = ref('')
const sortBy = ref('new')

const activeCat = computed(() => route.query.cat || '')

const catCounts = computed(() => {
  const counts = {}
  for (const g of gamesData) {
    for (const c of g.categories) counts[c] = (counts[c] || 0) + 1
  }
  return counts
})

const filtered = computed(() => {
  let list = [...gamesData]
  if (activeCat.value) {
    list = list.filter((g) => g.categories.includes(activeCat.value))
  }
  const kw = search.value.trim().toLowerCase()
  if (kw) {
    list = list.filter((g) =>
      [g.name, g.summary, ...g.tags].join(' ').toLowerCase().includes(kw),
    )
  }
  if (sortBy.value === 'new') {
    list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } else if (sortBy.value === 'plays') {
    list.sort((a, b) => b.plays - a.plays)
  } else if (sortBy.value === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name, 'zh'))
  }
  return list
})

function selectCat(id) {
  router.push({ query: id ? { cat: id } : {} })
}
</script>

<template>
  <div class="container library-layout">
    <!-- 侧栏：分类筛选 -->
    <aside class="filter-panel card">
      <div class="filter-head">
        <b>筛选</b>
        <button v-if="activeCat" class="filter-clear" @click="selectCat('')">清除</button>
      </div>

      <div class="filter-group">
        <p class="filter-label">游戏分类</p>
        <button
          class="filter-item"
          :class="{ active: !activeCat }"
          @click="selectCat('')"
        >
          全部 <span class="count">{{ gamesData.length }}</span>
        </button>
        <button
          v-for="c in CATEGORIES"
          :key="c.id"
          class="filter-item"
          :class="{ active: activeCat === c.id }"
          @click="selectCat(c.id)"
        >
          {{ c.emoji }} {{ c.name }}
          <span class="count">{{ catCounts[c.id] || 0 }}</span>
        </button>
      </div>

      <div class="filter-group">
        <p class="filter-label">试玩方式</p>
        <span class="filter-item static">▶ 在线试玩</span>
      </div>
    </aside>

    <!-- 主区：工具栏 + 游戏网格 -->
    <div class="library-main">
      <div class="toolbar card">
        <div class="toolbar-left">
          <h1 class="toolbar-title">
            {{ activeCat ? catName(activeCat) : '全部' }}游戏
            <span class="count-pill">{{ filtered.length }}</span>
          </h1>
        </div>
        <div class="toolbar-right">
          <input v-model="search" class="search" type="search" placeholder="搜索游戏 / 标签…" />
          <select v-model="sortBy" class="sort">
            <option value="new">最新发布</option>
            <option value="plays">最多游玩</option>
            <option value="name">名称</option>
          </select>
        </div>
      </div>

      <div v-if="filtered.length" class="game-grid">
        <GameCard v-for="g in filtered" :key="g.id" :game="g" />
      </div>

      <div v-else class="empty card">
        <span class="empty-emoji">🕳️</span>
        <p>没有找到符合条件的游戏</p>
        <button class="btn btn-primary" @click="selectCat(''); search = ''">
          查看全部游戏
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.library-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 20px;
  align-items: start;
}

.filter-panel {
  position: sticky;
  top: 84px;
  padding: 16px;
}

.filter-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: var(--border);
  font-size: 15px;
  font-weight: 900;
}

.filter-clear {
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  color: var(--blue);
  background: none;
  border: 0;
  cursor: pointer;
  padding: 0;
}

.filter-group {
  margin-top: 16px;
}

.filter-label {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 900;
  color: var(--muted);
  letter-spacing: 1px;
}

.filter-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  margin-bottom: 4px;
  padding: 7px 10px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
  background: none;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
}

.filter-item:hover {
  background: var(--paper);
}

.filter-item.active {
  background: var(--blue);
  color: #fff;
  border-color: var(--ink);
  box-shadow: 2px 2px 0 rgba(20, 22, 31, 0.9);
}

.filter-item.static {
  cursor: default;
  color: var(--muted);
}

.count {
  font-size: 11px;
  opacity: 0.75;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  padding: 14px 16px;
  margin-bottom: 18px;
}

.toolbar-title {
  margin: 0;
  font-size: 20px;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 10px;
}

.count-pill {
  padding: 2px 10px;
  background: var(--yellow);
  border: 2px solid var(--ink);
  border-radius: 999px;
  font-size: 13px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.search,
.sort {
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  padding: 8px 12px;
  border: var(--border);
  border-radius: 6px;
  background: #fff;
  color: var(--ink);
}

.search {
  width: 200px;
}

.search:focus {
  outline: 2px solid var(--blue);
  outline-offset: -2px;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 18px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 60px 20px;
}

.empty-emoji {
  font-size: 44px;
}

.empty p {
  margin: 0;
  font-weight: 700;
  color: var(--muted);
}

@media (max-width: 860px) {
  .library-layout {
    grid-template-columns: 1fr;
  }

  .filter-panel {
    position: static;
  }

  .filter-group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .filter-item {
    width: auto;
    margin-bottom: 0;
  }
}
</style>
