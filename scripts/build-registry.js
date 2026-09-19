// 扫描 games/*/meta.json → 校验 → 生成 src/data/games.json
// 新增游戏：建目录 + 写 meta.json + 跑 npm run registry（dev/build 前会自动执行）
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CATEGORIES } from '../src/game-meta.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const gamesDir = join(root, 'games')
const outFile = join(root, 'src', 'data', 'games.json')

const validCats = new Set(CATEGORIES.map((c) => c.id))
const games = []
const errors = []

for (const dir of readdirSync(gamesDir).sort()) {
  const metaPath = join(gamesDir, dir, 'meta.json')
  if (!existsSync(metaPath)) continue // 无 meta 的目录不注册（如 .DS_Store）
  const tag = `games/${dir}`

  let meta
  try {
    meta = JSON.parse(readFileSync(metaPath, 'utf8'))
  } catch (e) {
    errors.push(`${tag}: meta.json 解析失败（${e.message}）`)
    continue
  }

  const id = meta.id ?? dir
  if (id !== dir) errors.push(`${tag}: meta.id "${id}" 与目录名不一致`)
  if (!meta.name) errors.push(`${tag}: 缺少 name`)
  if (!meta.emoji) errors.push(`${tag}: 缺少 emoji`)
  const cats = meta.categories || []
  if (!cats.length) errors.push(`${tag}: categories 至少填一个`)
  for (const c of cats) if (!validCats.has(c)) errors.push(`${tag}: 未知分类 "${c}"`)
  for (const f of ['summary', 'description', 'howToPlay']) {
    if (!meta[f]) errors.push(`${tag}: 缺少 ${f}`)
  }
  const entry = meta.entry || `${dir}/index.html`
  if (!existsSync(join(gamesDir, entry))) errors.push(`${tag}: 入口文件不存在 ${entry}`)

  games.push({
    id,
    name: meta.name,
    emoji: meta.emoji || '🎮',
    categories: cats,
    tags: meta.tags || [],
    summary: meta.summary || '',
    description: meta.description || '',
    howToPlay: meta.howToPlay || '',
    entry,
    platform: meta.platform || '浏览器',
    playMode: meta.playMode || 'online',
    price: meta.price || '免费',
    createdAt: meta.createdAt || '',
    featured: !!meta.featured,
    plays: meta.plays ?? 0,
  })
}

if (errors.length) {
  console.error('❌ 注册表校验失败：')
  for (const e of errors) console.error('  - ' + e)
  process.exit(1)
}

games.sort((a, b) =>
  a.createdAt === b.createdAt ? a.id.localeCompare(b.id) : b.createdAt.localeCompare(a.createdAt),
)
writeFileSync(outFile, JSON.stringify(games, null, 2) + '\n')

console.log(`✅ 注册表已生成：${games.length} 个游戏 → src/data/games.json`)
for (const g of games) {
  console.log(`   ${g.emoji} ${g.name}  [${g.categories.join(',')}]${g.featured ? '  ★精选' : ''}`)
}
