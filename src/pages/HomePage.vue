<script setup>
import { computed } from 'vue'
import gamesData from '../data/games.json'
import { CATEGORIES } from '../game-meta'
import GameCard from '../components/GameCard.vue'

const featured = computed(() => gamesData.filter((g) => g.featured))

const catCounts = computed(() => {
  const counts = {}
  for (const g of gamesData) {
    for (const c of g.categories) counts[c] = (counts[c] || 0) + 1
  }
  return counts
})

const stats = computed(() => [
  { num: gamesData.length, label: '在线游戏' },
  { num: CATEGORIES.length, label: '游戏分类' },
  { num: '0 秒', label: '安装等待' },
])
</script>

<template>
  <div class="container">
    <!-- Hero -->
    <section class="hero card">
      <div class="hero-deco hero-deco-1">🕹️</div>
      <div class="hero-deco hero-deco-2">🧩</div>
      <div class="hero-deco hero-deco-3">🚀</div>
      <h1 class="hero-title">游戏大全</h1>
      <p class="hero-sub">
        AI 时代的开源小游戏平台 · 全部免费 · 即点即玩
      </p>
      <p class="hero-desc">
        按分类浏览小游戏，点开即可试玩；后续将开放「用 AI 做一个」，
        选定品类、一句话描述，即可生成属于你的小游戏并发布上架。
      </p>
      <div class="hero-actions">
        <router-link to="/library" class="btn btn-primary">进入游戏库 →</router-link>
        <a href="#cat-grid" class="btn btn-yellow">按分类逛逛</a>
      </div>
    </section>

    <!-- 数据条 -->
    <section class="stats">
      <div v-for="s in stats" :key="s.label" class="stat card">
        <b>{{ s.num }}</b>
        <span>{{ s.label }}</span>
      </div>
    </section>

    <!-- 分类入口 -->
    <section id="cat-grid">
      <h2 class="section-title">游戏分类</h2>
      <div class="cat-grid">
        <router-link
          v-for="c in CATEGORIES"
          :key="c.id"
          :to="`/library?cat=${c.id}`"
          class="cat-tile card"
        >
          <span class="cat-emoji">{{ c.emoji }}</span>
          <span class="cat-name">{{ c.name }}</span>
          <span class="cat-count">{{ catCounts[c.id] || 0 }} 款</span>
        </router-link>
      </div>
    </section>

    <!-- 精选游戏 -->
    <section>
      <h2 class="section-title">精选游戏</h2>
      <div class="game-grid">
        <GameCard v-for="g in featured" :key="g.id" :game="g" />
      </div>
    </section>

    <!-- AI 创作入口 -->
    <section class="ai-teaser card">
      <div class="ai-teaser-text">
        <h2>⚡ 用 AI 做一个小游戏</h2>
        <p>选定分类 → 一句话描述 → 生成 → 沙箱试玩 → 上架。创作页已开放，先来体验完整流程。</p>
      </div>
      <router-link to="/create" class="ai-badge">去创作 →</router-link>
    </section>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding: 56px 32px;
  text-align: center;
  background:
    radial-gradient(circle at 20% 20%, rgba(47, 85, 228, 0.12), transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(255, 210, 63, 0.25), transparent 40%),
    var(--card);
}

.hero-title {
  margin: 0 0 12px;
  font-size: 44px;
  font-weight: 900;
  letter-spacing: 8px;
  text-shadow: 4px 4px 0 var(--yellow);
}

.hero-sub {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 900;
  color: var(--blue);
  letter-spacing: 2px;
}

.hero-desc {
  margin: 0 auto 24px;
  max-width: 560px;
  font-size: 14px;
  line-height: 1.9;
  color: var(--muted);
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

.hero-deco {
  position: absolute;
  font-size: 40px;
  opacity: 0.5;
}

.hero-deco-1 {
  top: 18px;
  left: 26px;
  transform: rotate(-12deg);
}

.hero-deco-2 {
  bottom: 20px;
  left: 12%;
  transform: rotate(10deg);
}

.hero-deco-3 {
  top: 24px;
  right: 8%;
  transform: rotate(8deg);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 24px 0 36px;
}

.stat {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 10px;
  padding: 16px;
}

.stat b {
  font-size: 26px;
  font-weight: 900;
  color: var(--blue);
}

.stat span {
  font-size: 13px;
  font-weight: 700;
  color: var(--muted);
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin-bottom: 36px;
}

.cat-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 18px 8px;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.cat-tile:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 rgba(20, 22, 31, 0.9);
  background: var(--yellow);
}

.cat-emoji {
  font-size: 30px;
}

.cat-name {
  font-size: 15px;
  font-weight: 900;
}

.cat-count {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}

.cat-tile:hover .cat-count {
  color: var(--ink);
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
}

.ai-teaser {
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 24px 28px;
  background: linear-gradient(135deg, #1b2f8a, #2f55e4);
  color: #fff;
}

.ai-teaser h2 {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 900;
}

.ai-teaser p {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
}

.ai-badge {
  flex: none;
  padding: 8px 16px;
  border: 2px solid #fff;
  border-radius: 999px;
  background: var(--yellow);
  color: var(--ink);
  font-size: 14px;
  font-weight: 900;
}

@media (max-width: 860px) {
  .cat-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 560px) {
  .hero-title {
    font-size: 32px;
    letter-spacing: 4px;
  }

  .hero-deco {
    display: none;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .cat-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .ai-teaser {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
