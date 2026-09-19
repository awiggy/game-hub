<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import gamesData from '../data/games.json'
import { catName, catEmoji, catGradient } from '../game-meta'
import GameFrame from '../components/GameFrame.vue'
import GameCard from '../components/GameCard.vue'

const route = useRoute()

const game = computed(() => gamesData.find((g) => g.id === route.params.id))

const related = computed(() => {
  if (!game.value) return []
  const main = game.value.categories[0]
  return gamesData
    .filter((g) => g.id !== game.value.id && g.categories.includes(main))
    .slice(0, 3)
})

const infoRows = computed(() => {
  if (!game.value) return []
  const g = game.value
  return [
    ['分类', g.categories.map(catName).join(' / ')],
    ['平台', g.platform],
    ['试玩方式', g.playMode === 'online' ? '在线试玩' : g.playMode],
    ['价格', g.price],
    ['更新时间', g.createdAt],
  ]
})
</script>

<template>
  <div v-if="game" class="container">
    <!-- 头部信息 -->
    <div class="detail-head card">
      <div class="head-cover" :style="{ background: catGradient(game.categories[0]) }">
        {{ game.emoji }}
      </div>
      <div class="head-info">
        <h1>{{ game.name }}</h1>
        <p class="head-summary">{{ game.summary }}</p>
        <div class="head-tags">
          <span v-for="c in game.categories" :key="c" class="chip chip-blue">
            {{ catEmoji(c) }} {{ catName(c) }}
          </span>
          <span v-for="t in game.tags" :key="t" class="chip">{{ t }}</span>
        </div>
      </div>
      <div class="head-price">
        <b>{{ game.price }}</b>
        <span>免登录试玩</span>
      </div>
    </div>

    <div class="detail-layout">
      <!-- 主区：试玩 + 介绍 -->
      <div class="detail-main">
        <GameFrame :game="game" />

        <section class="detail-section card">
          <h2 class="section-title">游戏介绍</h2>
          <p class="desc">{{ game.description }}</p>
        </section>

        <section class="detail-section card">
          <h2 class="section-title">玩法说明</h2>
          <p class="desc how">{{ game.howToPlay }}</p>
        </section>
      </div>

      <!-- 侧栏：信息 + 相关推荐 -->
      <aside class="detail-aside">
        <div class="info-card card">
          <h2 class="section-title">游戏信息</h2>
          <dl>
            <template v-for="row in infoRows" :key="row[0]">
              <dt>{{ row[0] }}</dt>
              <dd>{{ row[1] }}</dd>
            </template>
          </dl>
        </div>

        <div v-if="related.length" class="info-card card">
          <h2 class="section-title">同类推荐</h2>
          <div class="related-grid">
            <GameCard v-for="g in related" :key="g.id" :game="g" />
          </div>
        </div>
      </aside>
    </div>
  </div>

  <!-- 未找到 -->
  <div v-else class="container">
    <div class="empty card">
      <span class="empty-emoji">🎮</span>
      <p>没有找到这款游戏，可能已下架</p>
      <router-link to="/library" class="btn btn-primary">返回游戏库</router-link>
    </div>
  </div>
</template>

<style scoped>
.detail-head {
  display: flex;
  gap: 18px;
  padding: 20px;
  margin-bottom: 20px;
}

.head-cover {
  flex: none;
  width: 110px;
  height: 110px;
  display: grid;
  place-items: center;
  font-size: 54px;
  border: var(--border);
  border-radius: var(--radius);
  filter: drop-shadow(3px 3px 0 rgba(20, 22, 31, 0.4));
}

.head-info {
  flex: 1;
  min-width: 0;
}

.head-info h1 {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 900;
}

.head-summary {
  margin: 0 0 12px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--muted);
}

.head-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.head-price {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  align-self: center;
  padding: 12px 18px;
  border: var(--border);
  border-radius: var(--radius);
  background: var(--yellow);
  box-shadow: var(--shadow-sm);
}

.head-price b {
  font-size: 20px;
  font-weight: 900;
}

.head-price span {
  font-size: 12px;
  font-weight: 700;
}

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  align-items: start;
}

.detail-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.detail-section {
  padding: 20px;
}

.desc {
  margin: 0;
  font-size: 14px;
  line-height: 2;
  color: var(--ink);
}

.desc.how {
  font-weight: 700;
  background: var(--paper);
  border: 2px dashed var(--ink);
  border-radius: 6px;
  padding: 12px 16px;
}

.detail-aside {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 84px;
}

.info-card {
  padding: 18px;
}

.info-card dl {
  margin: 0;
}

.info-card dt {
  float: left;
  clear: left;
  width: 72px;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 900;
  color: var(--muted);
}

.info-card dd {
  margin: 0 0 10px 82px;
  font-size: 13px;
  font-weight: 700;
}

.related-grid {
  display: grid;
  gap: 14px;
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

@media (max-width: 900px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .detail-aside {
    position: static;
  }

  .head-price {
    display: none;
  }
}
</style>
