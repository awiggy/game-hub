<script setup>
import { computed } from 'vue'
import { catName, catGradient } from '../game-meta'

const props = defineProps({
  game: { type: Object, required: true },
})

const gradient = computed(() => catGradient(props.game.categories[0]))
</script>

<template>
  <router-link :to="`/game/${game.id}`" class="game-card card">
    <div class="cover" :style="{ background: gradient }">
      <span class="cover-emoji">{{ game.emoji }}</span>
      <span class="cover-cat chip">{{ catName(game.categories[0]) }}</span>
    </div>
    <div class="body">
      <div class="title-row">
        <h3>{{ game.name }}</h3>
        <span class="price">{{ game.price }}</span>
      </div>
      <p class="summary">{{ game.summary }}</p>
      <div class="tags">
        <span v-for="t in game.tags" :key="t" class="tag">{{ t }}</span>
      </div>
      <div class="actions">
        <span class="btn btn-primary play-btn">▶ 试玩</span>
        <span class="muted platform">{{ game.platform }}</span>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.game-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.game-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 rgba(20, 22, 31, 0.9);
}

.cover {
  position: relative;
  height: 130px;
  display: grid;
  place-items: center;
  border-bottom: var(--border);
}

.cover-emoji {
  font-size: 52px;
  filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, 0.35));
}

.cover-cat {
  position: absolute;
  top: 10px;
  left: 10px;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  flex: 1;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.title-row h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 900;
}

.price {
  font-size: 12px;
  font-weight: 900;
  color: var(--ok);
  flex: none;
}

.summary {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border: 2px solid var(--ink);
  border-radius: 999px;
  background: var(--paper);
}

.actions {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.play-btn {
  padding: 7px 18px;
  font-size: 14px;
}

.platform {
  font-size: 12px;
  font-weight: 700;
}
</style>
