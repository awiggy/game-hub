# 游戏大全 GAME HUB

AI 时代的开源小游戏平台：按分类浏览小游戏，点开即玩。视觉风格参考像素街机 × 现代扁平（蓝黄配色 / 硬边框 / 硬阴影）。

- **线上地址**：https://awiggy.github.io/game-hub/
- **仓库**：https://github.com/awiggy/game-hub
- **部署**：push 到 main 即自动构建发布（GitHub Actions → GitHub Pages）

## 开发

```bash
npm install
npm run dev      # http://localhost:5173（启动前自动重建注册表）
npm run build    # 产物在 dist/，可直接静态部署（GitHub Pages / Vercel）
```

## 游戏货架（10 款）

| 游戏 | 分类 | 操作 |
|---|---|---|
| 🐍 像素贪吃蛇 | 街机/休闲 | 键盘 / 触屏滑动 |
| 🔢 数字合合乐 2048 | 解谜/休闲 | 键盘 / 触屏滑动 |
| 🧊 俄罗斯方块 | 解谜/街机 | 键盘 / 触屏按钮 |
| 🧱 疯狂打砖块 | 街机/动作 | 鼠标 / 键盘 / 触屏 |
| 🐤 像素小鸟 | 街机/休闲 | 点击 / 空格 |
| ✈️ 雷霆打飞机 | 射击/动作 | 鼠标 / 拖动 / 键盘 |
| 💣 经典扫雷 | 解谜/策略 | 点击 / 右键插旗 |
| 🧠 记忆翻牌 | 休闲/解谜 | 点击 |
| ⚫ 五子棋 | 棋牌/策略 | 点击（人机/双人） |
| 🏎️ 极速避让 | 竞速/休闲 | 键盘变道 / 触屏点按 |

## 结构

```
├── index.html / vite.config.js / package.json   # 门户应用（Vite + Vue3）
├── scripts/build-registry.js                    # ★ 注册脚本：扫描 games/ 生成注册表
├── src/
│   ├── pages/          # 首页 / 游戏库 / 游戏详情
│   ├── components/     # 导航、游戏卡片、试玩框架
│   ├── data/games.json # 注册表（脚本生成，勿手改）
│   └── game-meta.js    # 分类元数据（名称/图标/配色）
└── games/              # ★ 每个游戏 = 一个自包含目录（Vite publicDir）
    ├── snake/
    │   ├── meta.json   #   游戏元数据（注册来源）
    │   └── index.html  #   自包含游戏页，详情页 iframe 嵌入试玩
    └── .../            #   tetris / breakout / flappy / planewar / minesweeper ...
```

## 如何新增一个游戏

1. 在 `games/` 下新建与游戏 id 同名的文件夹
2. 放入自包含的 `index.html`（纯静态、无构建、无外部依赖）和 `meta.json`
3. 运行 `npm run registry`（dev / build 前会自动执行）—— 校验并登记，完成

`meta.json` 必填字段：`id`（=目录名）、`name`、`emoji`、`categories`（见 `src/game-meta.js` 的 10 个分类）、`summary`、`description`、`howToPlay`、`entry`。

## 游戏开发约定

- 单文件 HTML，零外部依赖，深色主题（`#0f1118` 背景 + 蓝黄强调色）
- 暴露 `window.__hub = { score, over, started }` 状态钩子——供中台自动验收与后续「AI 生成游戏」的沙箱检测使用
- 支持键盘与触屏，最高分 / 纪录用 localStorage 持久化（key 加游戏前缀）

## 路线图

- [x] 门户骨架（首页 / 游戏库 / 详情页 / iframe 试玩）
- [x] 注册脚本：扫描 `games/` 自动生成注册表
- [x] 第一批 10 款游戏覆盖 8 个分类
- [x] 「AI 创作」创作页 UI（选分类 → 一句话描述 → 生成 → 沙箱预览；后端未接入前自动进入演示模式）
- [x] AI 服务配置页（`/#/settings`，⚙️ 入口）：供应商 / Base URL / key / 模型随时可换
- [ ] 生成后端：`/api/generate` 云函数（模板 prompt 组装 → LLM 生成 → 校验 → 沙箱检测）
- [ ] 用户系统（登录 / 发布 / 评论）

## AI 生成服务接口契约（后端按此实现）

| 端点 | 方法 | 说明 |
|---|---|---|
| `/api/ai/settings` | POST | 保存 LLM 配置（provider/baseUrl/model/apiKey/dailyLimit）；**key 只存服务端，端点必须加管理鉴权** |
| `/api/ai/settings` | GET | 读取配置，key 以掩码返回（`****abcd`） |
| `/api/ai/test` | POST | 用当前配置发最小 chat 请求，返回 `{ok, message}` |
| `/api/generate` | POST | `{category, prompt}` → `{id, entry, name, emoji, summary}`；创作页已按此对接 |

后端未上线时：创作页自动进入演示模式；配置页把 key 本地暂存在浏览器 `localStorage`（`hub-ai-settings`），并在页面明确标注。
