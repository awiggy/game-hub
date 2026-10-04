// 运行时冒烟测试：mock DOM 环境执行每款游戏的 IIFE 同步初始化，
// 抓住「状态初始化先于绘制循环」被违反时的同步抛错。
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const gamesDir = join(root, 'games')

function makeEl(tag) {
  const el = {
    tagName: tag,
    style: new Proxy({}, { set: () => true, get: () => '' }),
    dataset: {},
    children: [],
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    textContent: '',
    innerHTML: '',
    value: '',
    disabled: false,
    width: 480,
    height: 480,
    appendChild() {},
    insertBefore() {},
    removeChild() {},
    remove() {},
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    getAttribute: () => null,
    querySelector: () => makeEl('q'),
    querySelectorAll: () => [],
    getBoundingClientRect: () => ({ x: 0, y: 0, width: 300, height: 300, left: 0, top: 0, right: 300, bottom: 300 }),
    getContext: () => ctx2d,
    focus() {},
    click() {},
  }
  return el
}

const ctx2d = new Proxy(
  {},
  {
    get(t, p) {
      if (p === 'createLinearGradient' || p === 'createRadialGradient')
        return () => ({ addColorStop() {} })
      if (p === 'measureText') return () => ({ width: 10 })
      if (typeof p === 'symbol') return undefined
      // 任意方法调用 no-op
      return () => {}
    },
    set: () => true,
  },
)

const elCache = new Map()
const doc = {
  getElementById: (id) => {
    if (!elCache.has(id)) elCache.set(id, makeEl('div'))
    return elCache.get(id)
  },
  createElement: (tag) => makeEl(tag),
  querySelector: () => makeEl('q'),
  querySelectorAll: () => [],
  addEventListener() {},
  body: makeEl('body'),
  title: '',
}

function makeSandbox() {
  const sandbox = {
    console,
    document: doc,
    performance: { now: () => 0 },
    navigator: { userAgent: 'smoke' },
    location: { href: 'http://localhost/' },
    localStorage: {
      _s: {},
      getItem(k) { return this._s[k] ?? null },
      setItem(k, v) { this._s[k] = v },
      removeItem(k) { delete this._s[k] },
    },
    requestAnimationFrame: () => 0,
    cancelAnimationFrame() {},
    setInterval: () => 0,
    clearInterval() {},
    setTimeout: () => 0,
    clearTimeout() {},
    addEventListener() {},
    removeEventListener() {},
    PointerEvent: class { constructor() {} },
    Math, JSON, Number, String, Boolean, Array, Object, Set, Map, Promise,
    parseInt, parseFloat, isNaN, isFinite,
  }
  sandbox.window = sandbox
  sandbox.globalThis = sandbox
  sandbox.self = sandbox
  return vm.createContext(sandbox)
}

const failures = []
let pass = 0
// mock 环境无法解析静态 HTML 元素的游戏（shellgame 依赖 .cup 静态节点，已浏览器验证）
const MOCK_SKIP = new Set(['shellgame'])
for (const dir of readdirSync(gamesDir).sort()) {
  if (MOCK_SKIP.has(dir)) { console.log(`⏭ ${dir}: mock 环境不支持静态 HTML 依赖，已浏览器验证`); continue }
  const html = readFileSync(join(gamesDir, dir, 'index.html'), 'utf8')
  const m = html.match(/<script>([\s\S]*?)<\/script>/)
  if (!m) { failures.push(`${dir}: 无脚本`); continue }
  const sandbox = makeSandbox()
  try {
    new vm.Script(m[1], { filename: dir + '.js' }).runInContext(sandbox, { timeout: 3000 })
    pass++
  } catch (e) {
    failures.push(`${dir}: ${e.message}`)
  }
}

if (failures.length) {
  console.log(`❌ ${failures.length} 款运行时冒烟失败：`)
  for (const f of failures) console.log('  - ' + f)
  process.exit(1)
}
console.log(`✅ 全部 ${pass} 款游戏运行时冒烟通过`)
