# 项目记忆

更新日期：2026-10-05（全面测修轮）

## 全面测修（2026-10-05）

- 用户要求对全部待验收游戏「测修一遍」。待验收共 46 款（第二~六批累计），本轮全部完成浏览器实测（启动+交互+状态读取），110 款货架全部达到交互级验证。
- **新增质检工具** `scripts/run-game-smoke.js`：mock DOM/canvas 环境在 vm 中实际执行每款游戏 IIFE 同步代码，抓运行时初始化错误；已接入 prebuild（registry → check → smoke → build）。
- **修复 8 处真实 bug**：
  1. `rushhour` 关卡数据三处硬伤（L1/L4 车辆格子重叠、原 L3 红车被永久堵死不可解）——重设计全部 4 关并用 BFS 求解器验证无重叠+可解（最短解 5/5/7/4 步）；
  2. 16 款违反「先初始化状态再启动绘制循环」（airhockey/balloonpop/bigfish/billiards/bomber/bowling/darts/golf/highjump/lightbike/marblemaze/moonlander/ricochet/ropeswing/sniper/minipac）——统一修复为 `requestAnimationFrame(loop)` 异步首帧；
  3. `knightstour` 用 Set.get（Set 无此方法），改 Map；
  4. `bomber` 尾部初始化 `walls=[]` 未调用 genLevel，且 genLevel 敌人出生 do-while 有 1/512 概率死循环（9 个候选格全为钢墙）——加 60 次尝试上限强制清格。
- 方法论沉淀：mock 冒烟只能抓同步初始化错误；真实浏览器交互测试发现的两类问题（rushhour 关卡不可解、bomber 低概率死循环）mock 抓不到，两者互补缺一不可。浏览器测 Canvas 游戏时点击必须按 canvas 实际渲染 rect 计算坐标，不能用 iframe 比例估算；测试脚本轮询要先点 cover 才会出现 iframe（reload 后 started 重置）。

## 产品边界

- 当前项目是小游戏集合平台。先完善基础游戏与游玩流程。
- AI 情感陪伴、人生决策模拟、人和 AI 共同完成目标，仍属于用户正在探索的其他游戏方向，尚未决定在这个平台中实现。
- AI 创作页目前有演示模式；没有接入实际生成后端，也没有可直接修改并发布游戏的 Agent。

## 仓库与参考来源

- 本项目仓库：https://github.com/awiggy/game-hub
- 本项目线上地址：https://awiggy.github.io/game-hub/
- 用户指定的参考仓库：https://github.com/wanghao221/moyu
- 参考版本：`15e88e245ddfbb4c7f0a9064202b5f50674296fb`。README 是大量游戏/工具的索引，仓库实际提交的源码少于索引数量。
- 曾从中选用「游戏-26.石头剪刀布」和「游戏-52.骰子游戏」，具体来源与适配说明见 `SOURCES.md`。

## 当前工作

- 用户要求：完善项目，再补两款到 50 款，使用参考仓库中的代码。
- 本地已有 50 款同时具备 `index.html` 和 `meta.json` 的游戏，注册表已更新到 50 款。
- 新增 `rps`（石头剪刀布）和 `diceduel`（骰子对决）：单文件、触屏/键盘、回合锁定、重新开局、结果遮罩和本地纪录。
- 原先仅有 `meta.json` 的星环躲避移动到 `drafts/orbit/` 保留，尚未实现，不计入货架。
- 已把 `scripts/check-games.js` 接入 `npm run check` 和正式构建前置步骤；构建失败会阻止现有 GitHub Actions 发布。
- 50 款静态检查和生产构建已通过；浏览器验收结果见 `docs/verification-2026-09-21.md`。
- 浏览器检查发现并修复了 12 款既有游戏的绘图循环先于状态初始化的问题；以后新增 Canvas 游戏时，必须先初始化状态，再调用绘图循环。
- 50 款加载和初始交互未出现未捕获异常；两款新游戏额外验证结算、连续输入、重开、纪录与手机触屏。其余游戏仍需逐款深度玩法验收。
- 用户已于 2026-09-21 要求将本次 50 款更新推送到 GitHub，并更新仓库简介；推送 main 会触发既有 GitHub Pages 自动部署。
- 用户提出宝可梦方向的可行性问题，尚未确定原版版本或新游戏玩法，不要视为已经确认开发范围。
- 用户进一步明确了两个探索方向：AI 辅助玩家自定义游戏玩法，以及「选择的重量」。尚未提供具体宝可梦改版源码。
- 已尝试第一版无文案黑白像素动态海报，独立入口 `poster/`，包含粒子光门、浮岛、由独行到同行的旅人与岔路。GitHub README 用 GIF 展示，Pages 提供交互版本；海报不计入 50 款游戏。

## 首页视觉重构探索（2026-09-26）

- 用户要求先读取项目记忆，按助手审美给几版样图，再确定游戏网页的重构方向。
- 已生成三版首页概念图：A「明亮游乐场」、B「深夜街机厅」、C「像素独立杂志」。样图、说明和完整提示词保存在 `docs/design/2026-09-26/`。
- 用户最终明确选择的是截图中第一张、原编号 C「像素独立杂志」：大标题、细分隔线、像素浮岛插画、杂志式排版，并要求明亮彩色，不能做成黑白。用户最初说 A 是因为图片实际展示顺序和编号不一致，已明确纠正；以后以截图和此条为准。
- 本轮范围已由用户确认：「这轮先改网站，游戏内部之后再做」。不要修改 50 款游戏内部的玩法或视觉。
- 共通设计思路：将可玩游戏提前到首屏，压缩介绍与统计区，弱化粗边框和硬阴影，用统一封面代替大号 emoji，并明确 AI 创作仍为演示模式。
- 已在本地实现彩色像素杂志版：统一首页、游戏库、详情与试玩外框、导航及创作/配置页视觉，补齐站点搜索、分类组合查询、随机游戏和手机端布局。
- 新插画由内置 image_gen 生成：`src/assets/pixel-world.webp` 是彩色像素浮岛横幅，`pixel-covers.webp` 是 8 款游戏的封面图集；其他游戏使用分类色与图形封面。封面为概念插画，不代表游戏内画面。
- 生成提示词及验收记录保存在 `docs/design/2026-09-26/`。项目仍为 50 款游戏、10 个分类；未修改 `games/` 内部文件。
- 用户随后于 2026-09-26 明确要求更新 GitHub 在线地址，本次视觉重构通过提交并推送 `main` 触发既有 GitHub Pages 工作流发布；线上地址仍为 `https://awiggy.github.io/game-hub/`。

## 扩充到 60 款（2026-09-28）

- 用户要求在 50 款基础上再新增 10 款游戏，玩法不与现有货架重复。
- 新增 10 款（全部单文件、`__hub` 钩子、键盘+触屏、本地最高分，Canvas 游戏遵守「先初始化状态再启动绘制循环」约定）：
  `typewriter` 打字达人（落词打字）、`jumpjump` 跳一跳（蓄力跳台）、`fishing` 休闲钓鱼（两段式拉扯）、`bowling` 保龄球之夜（三段投球）、`bombdefuse` 拆弹专家（按序剪线）、`trafficrush` 峰值路口（红绿灯调度）、`rushhour` 汽车华容道（4 静态关滑块）、`mathrun` 算术冲刺（限时心算三选一）、`memorymatrix` 记忆矩阵（位置记忆）、`darts` 飞镖高手（两段瞄准）。
- `src/game-visuals.js` 的 ICONS 表为新游戏补了图标映射（增量修改，未动重构样式）。
- `npm run check` 60 款全部通过；`npm run build` 通过；注册表已重建为 60 款，游戏库分类计数自动更新（街机 19/解谜 33/休闲 26 等）。
- 浏览器抽测通过：打字达人（输入单词消除得分链路完整）、拆弹专家（按手册剪线正确不误爆）；游戏库页面确认 60 款卡片与新版像素杂志风渲染正常。
- 本轮改动已提交推送 `main` 触发 GitHub Pages 自动部署；货架总数从 50 款增至 60 款。
- 其余 7 款新游戏（jumpjump/fishing/bowling/trafficrush/rushhour/mathrun/memorymatrix/darts 中未抽测部分）只做了静态检查，深度玩法验收待后续按 `docs/verification-2026-09-21.md` 的方式补做。

## 扩充到 70 款（2026-10-04）

- 用户要求再新增 10 款，货架从 60 款扩至 70 款。
- 其中 `orbit` 星环躲避是从 `drafts/orbit/` 收编转正的：补齐了 `games/orbit/index.html` 实现，drafts 副本不再使用（保留未删）。
- 新增 9 款：`colorfill` 填色拼图（flood-fill 限时染色）、`balloonpop` 戳气球（升起气球点击、躲炸弹）、`dicehill` 骰子爬塔（push-your-luck 博弈）、`blinkblink` 火眼金睛（双阵找不同）、`rockclimb` 岩壁攀岩（交替按键+打滑抢按）、`lightbike` 光轨对决（Tron 光墙 AI 对战）、`picrotate` 旋转拼图（点击转正方向）、`highjump` 跳高挑战（力度+起跳时机两段式）、`sushichef` 上菜快手（订单序列点击）。
- 全部遵守约定：单文件、`__hub` 钩子、键盘+触屏、本地最高分、Canvas 先初始化状态再启动绘制循环。
- `src/game-visuals.js` ICONS 表增量补充 10 个新游戏图标；未触碰像素杂志风重构样式。
- `npm run check` 70 款全过；`npm run build` 通过；游戏库确认 70 张卡片渲染正常。
- 浏览器抽测通过：`orbit`（运行中、小球绕环正常）、`sushichef`（按订单点击食材 done=1）；连同上一轮的 typewriter/bombdefuse，两批新游戏共 4 款完成交互级验证，其余 16 款（两批合计）仍为静态检查，深度验收待补。
- 提交推送 `main` 触发 Pages 自动部署；部署完成与线上冒烟（门户/typewriter/darts 均 200）已确认。

## 扩充到 80 款（2026-10-04 第二批）

- 用户要求再新增 10 款，货架从 70 款扩至 80 款。
- 新增：`hangman` 猜单词（字母试错+提示+吊小人）、`connect4` 四子连线（制胜点/封堵 AI）、`ballsort` 彩球分装（逆向洗牌生成可解题）、`lianliankan` 连连看（≤2 转弯连通判定+死局重排）、`bigfish` 大鱼吃小鱼（体型成长食物链）、`rhymtap` 节奏拍点（收缩圈时机判定）、`schulte` 舒尔特方格（1-25 顺序点击计时）、`tightrope` 走钢丝（重心漂移平衡）、`pyramid` 金字塔纸牌（凑 13 消除）、`moonlander` 登月着陆（反推引擎物理着陆）。
- 全部遵守约定：单文件、`__hub` 钩子、键盘+触屏、本地最高分、Canvas 先初始化状态再启动绘制循环。
- `connect4` 曾有一处 `streak` 重复声明语法错误，`npm run check` 拦截后已修复——静态质检在构建前置中发挥了预期作用。
- `src/game-visuals.js` ICONS 表增量补充 10 个图标。
- `npm run check` 80 款全过；`npm run build` 通过；游戏库确认 80 张卡片。
- 浏览器抽测通过：`hangman`（5 次字母点击全部正确落点并判定，本局单词 music 恰好全 miss 属正常随机）、`ballsort`（同色顶管合法倒装 moves=1）；`bigfish/rhymtap/schulte/tightrope/pyramid/moonlander` 为静态检查，深度玩法验收待补。
- 提交推送 `main` 触发 Pages 自动部署，线上冒烟待验证。

## 扩充到 90 款（2026-10-04 第三批）

- 用户要求再新增 10 款，货架从 80 款扩至 90 款。
- 新增：`wordsearch` 单词搜索（10×10 横纵藏词）、`digitspan` 数字记忆（数字广度逐轮加长）、`sniper` 狙击时刻（准星自动巡弋+预判射击）、`anagram` 拼词大师（字母重组限时）、`golf` 迷你高尔夫（弹弓式拖拽+摩擦反弹物理）、`waterpour` 倒水谜题（经典量水问题三关）、`cookieidler` 饼干工坊（放置挂机+自动产出滚雪球）、`shellgame` 三仙归洞（换位追踪）、`wordle` 猜词五连（绿黄灰反馈）、`billiards` 桌球小将（拖拽出杆+球间碰撞物理）。
- 全部遵守约定：单文件、`__hub` 钩子、键盘+触屏、本地最高分、Canvas 先初始化状态再启动绘制循环。
- `src/game-visuals.js` ICONS 表增量补充 10 个图标。
- `npm run check` 90 款全过；`npm run build` 通过；游戏库确认 90 张卡片。
- 浏览器抽测通过：`wordle`（逐键输入+绿黄灰反馈渲染正确，注意 cua.type 不触发 window keydown，验证需用 cua.keypress 逐键）、`shellgame`（换位动画→点击→揭晓→计分闭环完整）。
- 其余 8 款为静态检查，深度玩法验收待补（与之前两批累计 24 款待验收合计，见前两批记录）。

## 扩充到 100 款（2026-10-05 第五批）

- 用户要求再新增 10 款，货架从 90 款扩至 100 款，达成百款里程碑。
- 新增：`pipeconnect` 接水管（旋转管道连通水源）、`onestroke` 一笔画（欧拉路径图论谜题三图形）、`snakesladders` 蛇梯棋（掷骰对战 AI）、`battleship` 海战棋（8×8 随机部署 5 舰 45 发推理）、`knightstour` 骑士巡游（马走日遍历 25 格）、`minipac` 吃豆小人（13×11 迷宫+追踪幽灵）、`marblemaze` 迷宫滚珠（惯性物理+陷阱洞三关）、`numchain` 连数字走格（顺序+相邻判定）、`tankbattle` 像素坦克（俯视角射击+可破坏砖墙）、`goldminer` 黄金矿工（摆动钩子+重量物理）。
- 全部遵守约定：单文件、`__hub` 钩子、键盘+触屏、本地最高分。
- 本批踩坑复现：goldminer 与 tankbattle 均曾在 loop() 之后才初始化状态（违反约定），导致运行时错误；已修复并再次验证「先初始化状态再启动绘制循环」必须作为新增 Canvas 游戏的硬性检查项。
- `src/game-visuals.js` ICONS 表增量补充 10 个图标。
- `npm run check` 100 款全过；`npm run build` 通过；游戏库确认 100 张卡片。
- 浏览器抽测通过：`pipeconnect`（旋转管道触发 flow 重算）、`goldminer`（放钩子收回，修复后运行正常）、`tankbattle`（移动+开炮无异常）。
- 提交推送 `main` 触发 Pages 自动部署；五批累计新增 50 款中 11 款完成交互级验证，其余 39 款静态检查待验收。

## 扩充到 110 款（2026-10-05 第六批）

- 用户要求再新增 10 款，货架从 100 款扩至 110 款。
- 新增：`airhockey` 冰球对战（球拍物理+进球制）、`idiomchain` 成语接龙（40 条词库宽松判定）、`flagquiz` 国旗问答（25 面 emoji 国旗限时 MCQ）、`checkers` 跳棋对战（吃子/升王/贪心 AI）、`ricochet` 弹射打靶（反弹弹道解谜四关）、`picross` 数织拼图（行列提示由程序从图案生成）、`ropeswing` 荡绳飞跃（钟摆释放时机）、`bomber` 炸弹超人（十字爆炸+可破坏砖墙）、`memorypath` 记忆路线（相连路径记忆）、`bingo` 宾果连（与 AI 竞速连线）。
- 全部遵守约定：单文件、`__hub` 钩子、键盘+触屏、本地最高分、Canvas 先初始化状态再启动绘制循环。
- `src/game-visuals.js` ICONS 表增量补充 10 个图标。
- `npm run check` 110 款全过；`npm run build` 通过；游戏库确认 110 张卡片。
- 浏览器抽测通过：`checkers`（4 枚可动蓝棋选中走子成功）、`picross`（涂格状态切换正常）。
- 提交推送 `main` 触发 Pages 自动部署；六批累计新增 60 款中 13 款完成交互级验证，其余 47 款静态检查待验收。
