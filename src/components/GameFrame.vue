<script setup>
import { ref, computed, nextTick } from "vue";
import HubIcon from "./HubIcon.vue";
import GameArt from "./GameArt.vue";
const props = defineProps({ game: { type: Object, required: true } });
const started = ref(false),
  wrapEl = ref(null),
  frameEl = ref(null),
  frameKey = ref(0),
  notice = ref("");
const src = computed(() => import.meta.env.BASE_URL + props.game.entry);
async function start() {
  started.value = true;
  await nextTick();
  frameEl.value?.focus();
}
function restart() {
  if (started.value) frameKey.value++;
}
function openNew() {
  window.open(src.value, "_blank", "noopener,noreferrer");
}
async function fullscreen() {
  notice.value = "";
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (wrapEl.value?.requestFullscreen) {
      await wrapEl.value.requestFullscreen();
    } else {
      notice.value = "此浏览器不支持全屏，可以在新窗口中游玩。";
    }
  } catch {
    notice.value = "暂时无法全屏，可以在新窗口中游玩。";
  }
}
</script>
<template>
  <div ref="wrapEl" class="game-frame">
    <div class="frame-bar">
      <span class="frame-label"><span></span>PLAY / {{ game.name }}</span>
      <div class="frame-actions">
        <button :disabled="!started" title="重新开始" @click="restart">
          <HubIcon name="restart" :size="14" /><span>重开</span></button
        ><button title="新窗口打开" @click="openNew">
          <HubIcon name="up" :size="15" /><span>新窗口</span></button
        ><button title="全屏" @click="fullscreen">
          <HubIcon name="expand" :size="15" /><span>全屏</span>
        </button>
      </div>
    </div>
    <div class="frame-stage">
      <iframe
        v-if="started"
        ref="frameEl"
        :key="frameKey"
        :src="src"
        class="frame-iframe"
        :title="game.name + '游戏画面'"
        allow="fullscreen"
        @load="frameEl?.focus()"
      ></iframe
      ><button v-else class="frame-cover" @click="start">
        <div class="cover-art"><GameArt :game="game" /></div>
        <div class="cover-action">
          <span class="play-label"
            ><HubIcon name="play" :size="22" />开始游戏</span
          ><span class="cover-hint">无需下载 / 免登录 / 即点即玩</span>
        </div>
      </button>
    </div>
    <p v-if="notice" class="frame-notice" role="status">{{ notice }}</p>
    <div class="frame-foot">
      <span>{{ started ? "好好享受这一局。" : "准备好，开始一点快乐。" }}</span
      ><span>GAME HUB</span>
    </div>
  </div>
</template>
<style scoped>
.game-frame {
  display: flex;
  flex-direction: column;
  border: 1px solid #657972;
  background: var(--paper);
  min-width: 0;
}
.frame-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid #a1b3a9;
  background: #e7ece3;
}
.frame-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font: 9px var(--mono);
  color: #4d6e5e;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.frame-label > span {
  width: 6px;
  height: 6px;
  background: #53967c;
  flex: none;
}
.frame-actions {
  display: flex;
  gap: 16px;
  margin-left: auto;
  flex: none;
}
.frame-actions button {
  border: 0;
  background: none;
  padding: 2px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
}
.frame-actions button:hover:not(:disabled) {
  color: var(--blue);
}
.frame-stage {
  position: relative;
  height: clamp(430px, 62vh, 640px);
  background: #f1f1e8;
}
.frame-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
  background: #0f1118;
}
.frame-cover {
  position: absolute;
  inset: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 27px;
  border: 0;
  background: #f1f1e8;
  padding: 20px;
}
.cover-art {
  width: min(72%, 410px);
  aspect-ratio: 4/3;
  border: 1px solid #5c887b55;
}
.cover-action {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 13px;
}
.play-label {
  display: inline-flex;
  align-items: center;
  gap: 13px;
  background: var(--blue);
  color: white;
  padding: 13px 30px;
  font-size: 16px;
  font-weight: 700;
}
.frame-cover:hover .play-label {
  background: var(--blue-deep);
}
.cover-hint {
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.5px;
}
.frame-foot {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  border-top: 1px solid #a1b3a9;
  padding: 10px 14px;
  font-size: 9px;
  color: #6c8274;
}
.frame-foot span:last-child {
  font-family: var(--mono);
  letter-spacing: 1px;
}
.frame-notice {
  font-size: 11px;
  color: #966a28;
  background: #fff0cc;
  padding: 10px;
  margin: 0;
}
.game-frame:fullscreen {
  width: 100%;
  height: 100%;
  border: 0;
}
.game-frame:fullscreen .frame-stage {
  height: auto;
  flex: 1;
}
.game-frame:fullscreen .frame-foot {
  display: none;
}
@media (max-width: 500px) {
  .frame-bar {
    padding: 10px;
    gap: 8px;
  }
  .frame-label {
    font-size: 8px;
  }
  .frame-actions {
    gap: 12px;
  }
  .frame-actions button span {
    display: none;
  }
  .frame-actions button {
    padding: 4px;
  }
  .frame-stage {
    height: 480px;
    max-height: 75svh;
    min-height: 380px;
  }
  .cover-art {
    width: 88%;
  }
  .play-label {
    font-size: 15px;
  }
}
</style>
