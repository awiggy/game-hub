// 全量质检：语法编译 + 关键约定（__hub/overlay/meta 字段）
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { CATEGORIES } from '../src/game-meta.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const gamesDir = join(root, 'games')
const CATS = new Set(CATEGORIES.map(({ id }) => id))
const problems = []
const directories = readdirSync(gamesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

for (const dir of directories) {
  const gdir = join(gamesDir, dir)
  const htmlPath = join(gdir, 'index.html')
  const metaPath = join(gdir, 'meta.json')
  if (!existsSync(htmlPath) || !existsSync(metaPath)) {
    const missing = [htmlPath, metaPath].filter((path) => !existsSync(path))
    problems.push(`${dir}: 文件缺失 ${missing.map((path) => path.slice(gdir.length + 1)).join('、')}`)
    continue
  }
  const html = readFileSync(htmlPath, 'utf8')
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)]
  const inline = scripts.filter((match) => !/\bsrc\s*=/i.test(match[1]))
  if (inline.length !== 1) problems.push(`${dir}: 内联 script 块数量 ${inline.length} ≠ 1`)
  else {
    try {
      new vm.Script(inline[0][2], { filename: `${dir}/index.html` })
    } catch (e) {
      problems.push(`${dir}: 语法错误 ${e.message}`)
    }
  }
  if (!html.includes('__hub')) problems.push(`${dir}: 缺少 __hub 钩子`)
  if (!html.includes('overlay')) problems.push(`${dir}: 缺少 overlay`)
  if (/alert\(|prompt\(|confirm\(/.test(html)) problems.push(`${dir}: 使用了 alert/prompt`)
  if (/<script\b[^>]*\bsrc\s*=|https?:\/\/cdn|googleapis/i.test(html)) problems.push(`${dir}: 有外部依赖`)
  try {
    const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
    if (meta.id !== dir) problems.push(`${dir}: meta.id=${meta.id} 与目录名不一致`)
    for (const f of ['name','emoji','summary','description','howToPlay','entry','categories']) {
      if (!meta[f]) problems.push(`${dir}: meta 缺少 ${f}`)
    }
    if (!Array.isArray(meta.categories) || !meta.categories.length) {
      problems.push(`${dir}: categories 必须是非空数组`)
    } else {
      for (const c of meta.categories) if (!CATS.has(c)) problems.push(`${dir}: 未知分类 ${c}`)
    }
    if (meta.entry !== `${dir}/index.html`) problems.push(`${dir}: entry 错误 ${meta.entry}`)
  } catch (e) {
    problems.push(`${dir}: meta.json 解析失败 ${e.message}`)
  }
}

if (problems.length) {
  console.log(`❌ ${problems.length} 个问题：`)
  for (const p of problems) console.log('  - ' + p)
  process.exit(1)
}
console.log(`✅ 全部 ${directories.length} 个游戏目录静态检查通过（实际游玩需浏览器验收）`)
