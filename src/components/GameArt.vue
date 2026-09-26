<script setup>
import { computed } from "vue";
import HubIcon from "./HubIcon.vue";
import { COVER_CELLS, visualFor } from "../game-visuals";
import coverAtlas from "../assets/pixel-covers.webp";
const props = defineProps({ game: { type: Object, required: true } });
const cell = computed(() => COVER_CELLS[props.game.id]);
const visual = computed(() => visualFor(props.game));
const artStyle = computed(() =>
  cell.value !== undefined
    ? {
        backgroundImage: `url(${coverAtlas})`,
        backgroundPosition: `${((cell.value % 4) * 100) / 3}% ${Math.floor(cell.value / 4) * 100}%`,
      }
    : { "--art-color": visual.value.color, "--art-light": visual.value.light },
);
</script>
<template>
  <div
    class="game-art"
    :class="cell !== undefined ? 'illustrated' : 'graphic'"
    :style="artStyle"
    aria-hidden="true"
  >
    <template v-if="cell === undefined"
      ><span class="pixel-grid"></span
      ><span class="pixel-shape shape-one"></span
      ><span class="pixel-shape shape-two"></span
      ><span class="art-symbol"><HubIcon :name="visual.icon" :size="70" /></span
      ><span class="pixel-dot"></span
    ></template>
  </div>
</template>
<style scoped>
.game-art {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
.illustrated {
  background-size: 400% 200%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
}
.graphic {
  display: grid;
  place-items: center;
  background: var(--art-light);
  color: var(--art-color);
  isolation: isolate;
}
.pixel-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(90deg, currentColor 1px, transparent 1px),
    linear-gradient(currentColor 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.075;
}
.art-symbol {
  display: grid;
  place-items: center;
  width: 105px;
  height: 105px;
  background: #ffffffc9;
  clip-path: polygon(
    12% 0,
    88% 0,
    88% 12%,
    100% 12%,
    100% 88%,
    88% 88%,
    88% 100%,
    12% 100%,
    12% 88%,
    0 88%,
    0 12%,
    12% 12%
  );
  border: 9px solid #ffffff70;
}
.pixel-shape {
  position: absolute;
  width: 32px;
  height: 32px;
  background: currentColor;
  opacity: 0.3;
  clip-path: polygon(0 0, 50% 0, 50% 50%, 100% 50%, 100% 100%, 0 100%);
}
.shape-one {
  top: 16%;
  left: 15%;
}
.shape-two {
  bottom: 16%;
  right: 15%;
  transform: rotate(180deg);
}
.pixel-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  bottom: 18%;
  left: 22%;
  background: currentColor;
  box-shadow:
    8px 0 currentColor,
    8px -8px currentColor;
  opacity: 0.55;
}
</style>
