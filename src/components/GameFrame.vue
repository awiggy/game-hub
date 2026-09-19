<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  game: { type: Object, required: true },
})

// 点击后才加载 iframe，避免列表页/详情页打开即占用焦点和性能
const started = ref(false)
const wrapEl = ref(null)
const frameKey = ref(0)

const src = computed(() => `${import.meta.env.BASE_URL}${props.game.entry}`)

function start() {
  started.value = true
}

function restart() {
  frameKey.value++
}

function openNew() {
  window.open(src.value, '_blank')
}

async function fullscreen() {
  if (!document.fullscreenElement) {
    await wrapEl.value?.requestFullscreen()
  } else {
    await document.exitFullscreen()
  }
}
</script>

<template>
  <div ref="wrapEl" class="game-frame card">
    <div class="frame-bar">
      <span class="frame-dots">
        <i></i><i></i><i></i>
      </span>
      <span class="frame-name">{{ game.name }}</span>
      <span class="frame-actions">
        <button class="frame-btn" title="重新开始" @click="restart">⟳ 重开</button>
        <button class="frame-btn" title="新窗口打开" @click="openNew">↗ 新窗口</button>
        <button class="frame-btn" title="全屏" @click="fullscreen">⛶ 全屏</button>
      </span>
    </div>

    <div class="frame-stage">
      <iframe
        v-if="started"
        :key="frameKey"
        :src="src"
        class="frame-iframe"
        title="游戏画面"
        allow="fullscreen"
      ></iframe>
      <button v-else class="frame-cover" @click="start">
        <span class="cover-emoji">{{ game.emoji }}</span>
        <span class="cover-play">▶ 开始试玩</span>
        <span class="cover-hint">{{ game.platform }} · 免登录 · 即点即玩</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-frame {
  overflow: hidden;
}

.frame-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-bottom: var(--border);
  background: var(--paper);
}

.frame-dots {
  display: flex;
  gap: 5px;
}

.frame-dots i {
  width: 10px;
  height: 10px;
  border: 2px solid var(--ink);
  border-radius: 50%;
  background: var(--yellow);
}

.frame-dots i:nth-child(2) {
  background: var(--blue);
}

.frame-dots i:nth-child(3) {
  background: var(--danger);
}

.frame-name {
  font-size: 13px;
  font-weight: 900;
}

.frame-actions {
  margin-left: auto;
  display: flex;
  gap: 6px;
}

.frame-btn {
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border: 2px solid var(--ink);
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  box-shadow: 2px 2px 0 rgba(20, 22, 31, 0.9);
}

.frame-btn:active {
  transform: translate(1px, 1px);
  box-shadow: none;
}

.frame-stage {
  position: relative;
  height: clamp(420px, 62vh, 620px);
  background: #0f1118;
}

.frame-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.frame-cover {
  position: absolute;
  inset: 0;
  width: 100%;
  border: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  font-family: inherit;
  background: repeating-linear-gradient(
    45deg,
    #14161f,
    #14161f 14px,
    #1a1d29 14px,
    #1a1d29 28px
  );
}

.cover-emoji {
  font-size: 56px;
  filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, 0.5));
}

.cover-play {
  padding: 12px 32px;
  background: var(--yellow);
  color: var(--ink);
  border: var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 2px;
}

.cover-hint {
  color: #8b93a7;
  font-size: 12px;
  font-weight: 700;
}

:fullscreen .frame-stage {
  height: 100%;
}
</style>
