<script setup>
import { catName } from "../game-meta";
import GameArt from "./GameArt.vue";
import HubIcon from "./HubIcon.vue";
defineProps({
  game: { type: Object, required: true },
  index: Number,
  compact: Boolean,
});
</script>
<template>
  <router-link
    :to="'/game/' + game.id"
    class="game-card"
    :class="{ compact }"
    :aria-label="'玩' + game.name"
    ><div class="cover">
      <GameArt :game="game" /><span class="cover-play"
        ><HubIcon name="play" :size="22" />开玩</span
      >
    </div>
    <div class="game-info">
      <span v-if="index !== undefined" class="game-index">{{
        String(index + 1).padStart(2, "0")
      }}</span>
      <div class="game-copy">
        <h3>{{ game.name }}</h3>
        <p>{{ game.categories.map(catName).join(" / ") }}</p>
      </div>
      <HubIcon class="game-arrow" name="up" :size="19" /></div
  ></router-link>
</template>
<style scoped>
.game-card {
  display: block;
  min-width: 0;
}
.cover {
  aspect-ratio: 1.5;
  overflow: hidden;
  position: relative;
  background: #dce8df;
  border: 1px solid #203c3930;
}
.cover :deep(.game-art) {
  transition: transform 0.35s;
}
.game-card:hover .cover :deep(.game-art) {
  transform: scale(1.045);
}
.cover-play {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: var(--paper);
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 13px;
  font-size: 12px;
  font-weight: 700;
  opacity: 0;
  transform: translateY(5px);
  transition: 0.2s;
}
.game-card:hover .cover-play,
.game-card:focus-visible .cover-play {
  opacity: 1;
  transform: translateY(0);
}
.game-info {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding-top: 15px;
}
.game-index {
  font: 11px var(--mono);
  margin-top: 3px;
}
.game-copy {
  min-width: 0;
  flex: 1;
}
h3 {
  font-size: 18px;
  font-weight: 800;
  margin: 0 0 7px;
  letter-spacing: -0.4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
p {
  font-size: 11px;
  margin: 0;
  color: var(--muted);
}
.game-arrow {
  flex: none;
  margin-top: 2px;
}
.game-card:hover h3,
.game-card:hover .game-arrow {
  color: var(--blue);
}
.compact {
  display: flex;
  gap: 12px;
  align-items: center;
}
.compact .cover {
  width: 90px;
  height: 66px;
  flex: none;
}
.compact .game-info {
  padding: 0;
  flex: 1;
  min-width: 0;
  gap: 8px;
}
.compact h3 {
  font-size: 13px;
}
.compact p {
  font-size: 10px;
}
@media (max-width: 900px) {
  h3 {
    font-size: 16px;
  }
  .game-info {
    gap: 10px;
  }
}
@media (max-width: 600px) {
  h3 {
    font-size: 14px;
    letter-spacing: -0.2px;
  }
  .game-info {
    gap: 7px;
    padding-top: 10px;
  }
  .game-index {
    font-size: 9px;
  }
  .game-arrow {
    width: 15px;
  }
  .cover {
    aspect-ratio: 4/3;
  }
  p {
    font-size: 10px;
  }
}
</style>
