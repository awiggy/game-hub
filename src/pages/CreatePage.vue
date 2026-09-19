<script setup>
import { ref, computed } from 'vue'
import gamesData from '../data/games.json'
import { CATEGORIES, catEmoji } from '../game-meta'

const category = ref('')
const prompt = ref('')
const status = ref('idle') // idle | loading | done
const demo = ref(false)
const progress = ref('')
const progressPct = ref(0)
const result = ref(null)

const EXAMPLES = [
  '陨石躲避：飞船左右移动，躲开天而降的陨石，坚持越久分越高',
  '接水果：篮子左右移动接住掉落的水果，炸弹不能接',
  '跳一跳：按住蓄力松手起跳，跳上一个个平台，落空即失败',
  '消星星：点击相邻同色方块消除得分，越快连击越高',
]

// 演示模式：按分类映射一个现有游戏作为预览示例
const DEMO_MAP = {
  arcade: 'snake',
  casual: 'snake',
  puzzle: '2048',
  card: 'gobang',
  action: 'breakout',
  shooter: 'planewar',
  strategy: 'minesweeper',
  racing: 'racedodge',
  simulation: '2048',
  sports: 'breakout',
}

const canGenerate = computed(
  () => category.value && prompt.value.trim().length >= 4,
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// 部署在子路径（如 GitHub Pages）时 iframe 相对资源要拼 BASE_URL
const BASE = import.meta.env.BASE_URL

async function generate() {
  if (!canGenerate.value || status.value === 'loading') return
  status.value = 'loading'
  result.value = null
  demo.value = false
  progressPct.value = 8

  // 真实生成接口（MVP 第 2 步接入云函数后生效）
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: category.value, prompt: prompt.value.trim() }),
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = await res.json()
    if (!data || !data.entry) throw new Error('响应格式错误')
    result.value = data
    progressPct.value = 100
    status.value = 'done'
    return
  } catch {
    // 后端未接入 → 演示模式
  }

  demo.value = true
  progress.value = '正在理解你的创意…'
  progressPct.value = 22
  await sleep(900)
  progress.value = '正在编写游戏代码…'
  progressPct.value = 58
  await sleep(1200)
  progress.value = '正在质检并生成预览…'
  progressPct.value = 86
  await sleep(800)
  const g = gamesData.find((x) => x.id === (DEMO_MAP[category.value] || 'snake'))
  result.value = {
    demo: true,
    id: g.id,
    entry: g.entry,
    name: prompt.value.trim().slice(0, 12).replace(/[，。：:、！？\s]+$/, '') || g.name,
    emoji: g.emoji,
    summary: g.summary,
  }
  progress.value = '完成'
  progressPct.value = 100
  status.value = 'done'
}

function reset() {
  status.value = 'idle'
  result.value = null
  progressPct.value = 0
}
</script>

<template>
  <div class="container create-page">
    <!-- 头部说明 -->
    <section class="create-head card">
      <h1>⚡ 用 AI 做一个小游戏</h1>
      <p>
        选分类 → 一句话描述 → 生成 → 沙箱试玩 → 一键上架。
        生成后端接入中，当前可体验完整流程：<b>演示模式</b>会用现有游戏示例展示预览效果。
      </p>
    </section>

    <!-- ① 分类 -->
    <section>
      <h2 class="section-title">① 选一个分类</h2>
      <div class="cat-grid">
        <button
          v-for="c in CATEGORIES"
          :key="c.id"
          class="cat-tile card"
          :class="{ active: category === c.id }"
          @click="category = c.id"
        >
          <span class="cat-emoji">{{ c.emoji }}</span>
          <span class="cat-name">{{ c.name }}</span>
        </button>
      </div>
    </section>

    <!-- ② 描述 -->
    <section>
      <h2 class="section-title">② 用一句话描述玩法</h2>
      <div class="prompt-card card">
        <textarea
          v-model="prompt"
          rows="3"
          maxlength="120"
          placeholder="例如：控制小飞船左右移动，躲开天上掉下来的陨石，坚持越久分数越高"
        ></textarea>
        <div class="prompt-foot">
          <div class="chips">
            <button
              v-for="e in EXAMPLES"
              :key="e"
              class="chip chip-btn"
              :title="e"
              @click="prompt = e"
            >
              {{ e.slice(0, 8) }}…
            </button>
          </div>
          <span class="muted count">{{ prompt.length }}/120</span>
        </div>
      </div>
    </section>

    <!-- ③ 生成 -->
    <section class="gen-bar">
      <button
        class="btn btn-yellow gen-btn"
        :disabled="!canGenerate || status === 'loading'"
        @click="generate"
      >
        {{ status === 'loading' ? '生成中…' : '⚡ 开始生成' }}
      </button>
      <span v-if="status === 'idle' && !canGenerate" class="muted">
        先选分类，再写一句玩法描述（至少 4 个字）
      </span>
    </section>

    <!-- 进度 -->
    <section v-if="status === 'loading'" class="loading-card card">
      <div class="progress-msg">{{ progress }}</div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: progressPct + '%' }"></div>
      </div>
    </section>

    <!-- 结果预览 -->
    <section v-if="status === 'done' && result" class="result-card card">
      <div class="result-head">
        <h2>{{ result.emoji }} {{ result.name }}</h2>
        <span v-if="demo" class="chip chip-yellow">演示模式 · 预览为示例游戏</span>
        <span v-else class="chip chip-blue">生成完成</span>
      </div>
      <p class="muted result-desc">{{ result.summary }}</p>
      <div class="preview">
        <iframe
          :src="BASE + result.entry"
          sandbox="allow-scripts allow-pointer-lock"
          title="游戏预览"
        ></iframe>
      </div>
      <div class="result-actions">
        <button class="btn" @click="reset">↻ 重新生成</button>
        <button class="btn btn-primary" disabled title="接入生成后端后开放">
          📦 发布上架（待后端接入）
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.create-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 880px;
}

.create-head {
  padding: 26px 30px;
  background:
    radial-gradient(circle at 85% 20%, rgba(255, 210, 63, 0.28), transparent 45%),
    var(--card);
}

.create-head h1 {
  margin: 0 0 10px;
  font-size: 26px;
  font-weight: 900;
  letter-spacing: 2px;
  text-shadow: 3px 3px 0 var(--yellow);
}

.create-head p {
  margin: 0;
  font-size: 14px;
  line-height: 1.9;
  color: var(--muted);
}

.create-head b {
  color: var(--blue);
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.cat-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 14px 6px;
  font-family: inherit;
  cursor: pointer;
  border: var(--border);
  transition: transform 0.12s ease;
}

.cat-tile:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 rgba(20, 22, 31, 0.9);
}

.cat-tile.active {
  background: var(--blue);
  color: #fff;
  box-shadow: var(--shadow-sm);
  transform: none;
}

.cat-emoji {
  font-size: 26px;
}

.cat-name {
  font-size: 14px;
  font-weight: 900;
}

.prompt-card {
  padding: 6px 16px 12px;
}

.prompt-card textarea {
  width: 100%;
  border: 0;
  background: transparent;
  resize: none;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.8;
  color: var(--ink);
  padding: 12px 0 8px;
}

.prompt-card textarea:focus {
  outline: none;
}

.prompt-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  border-top: 2px dashed var(--grid);
  padding-top: 10px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip-btn {
  border: 2px solid var(--ink);
  background: var(--paper);
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
}

.chip-btn:hover {
  background: var(--yellow);
}

.count {
  font-size: 12px;
  font-weight: 700;
}

.gen-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.gen-btn {
  font-size: 17px;
  padding: 13px 36px;
  letter-spacing: 2px;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

.loading-card {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-msg {
  font-size: 14px;
  font-weight: 900;
}

.progress-track {
  height: 12px;
  border: 2px solid var(--ink);
  border-radius: 999px;
  background: var(--paper);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--yellow);
  transition: width 0.35s ease;
}

.result-card {
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-head {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.result-head h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 900;
}

.result-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
}

.preview {
  border: var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  background: #0f1118;
}

.preview iframe {
  display: block;
  width: 100%;
  height: clamp(420px, 62vh, 600px);
  border: 0;
}

.result-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 760px) {
  .cat-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .cat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
