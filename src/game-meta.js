// 分类元数据：全站共用（分类名 / 图标 / 封面渐变色）
export const CATEGORIES = [
  { id: 'arcade', name: '街机', emoji: '🕹️' },
  { id: 'puzzle', name: '解谜', emoji: '🧩' },
  { id: 'casual', name: '休闲', emoji: '🎈' },
  { id: 'card', name: '棋牌', emoji: '🃏' },
  { id: 'action', name: '动作', emoji: '⚔️' },
  { id: 'shooter', name: '射击', emoji: '🚀' },
  { id: 'strategy', name: '策略', emoji: '♟️' },
  { id: 'simulation', name: '模拟', emoji: '🏗️' },
  { id: 'sports', name: '体育', emoji: '⚽' },
  { id: 'racing', name: '竞速', emoji: '🏎️' },
]

export const CATEGORY_COLORS = {
  arcade: ['#2f55e4', '#1b2f8a'],
  puzzle: ['#8a5cf6', '#5b34c9'],
  casual: ['#3fa9f5', '#1b6fd0'],
  card: ['#ff7a59', '#e04e2f'],
  action: ['#ff4d5e', '#c22739'],
  shooter: ['#00b8a9', '#00796f'],
  strategy: ['#f5a623', '#c97d0a'],
  simulation: ['#64748b', '#3b4657'],
  sports: ['#22b573', '#0f7a4a'],
  racing: ['#e84393', '#a52a6a'],
}

export function catName(id) {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id
}

export function catEmoji(id) {
  return CATEGORIES.find((c) => c.id === id)?.emoji ?? '🎮'
}

export function catGradient(id) {
  const pair = CATEGORY_COLORS[id] ?? ['#2f55e4', '#1b2f8a']
  return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`
}
