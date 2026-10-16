# 十六款游园主题视觉改造验收

日期：2026-10-16。两批共 26 款按用户要求统一发布。

## 范围

本次第二批十六款：井字棋、记忆色序、三仙归洞、火眼金睛、猜数字1A2B、猜单词、拼词大师、单词搜索、速算24点、成语接龙、21点、金字塔纸牌、蛇梯棋、骰子爬塔、骰子对决、石头剪刀布。

## 画面实现

主题分别为饼干小花棋局、森林亮灯歌、兔兔茶会、果园找不同、邮局密码箱、字母花园、字母邮局、寻宝册、蜂蜜算术桌、竹林长卷、森林牌桌、纸牌塔、云梯旅程、蜂蜜高塔、野餐骰子和出拳俱乐部。杯子、花朵、字母印章、牌背、骰点与手势有实际绘制。

## 玩法修复

井字棋平局记成功防守，修复完美 AI 下永远零战绩的问题；多款清理重开前的旧回调；单词搜索保证五词全部放入；24 点随机生成有次数上限与可解回退；成语库耗尽保留连击；21 点可连续发牌且双自然 21 点平局；金字塔纸牌原先消除一对时只移掉一张，现原子移除两张并支持点明牌；蛇梯棋格号与行进位置对齐，重开取消旧回合。

## 脚本回归

`scripts/check-festival-sixteen.cjs` 执行实际脚本，覆盖井字防守、四轮色序、密码唯一输入与计分、猜词重复完成防护、拼词八轮、恒定随机值下五词生成、24 点含分数解与切换锁、成语无后续保分、21 点连续发牌/软 A/平局/破产、金字塔双向配对/明牌/K/死局/构造全塔、蛇梯终点/旧回合取消、爬塔十掷与收手。三仙归洞、火眼金睛、骰子对决和石头剪刀布另有真实 DOM 浏览器交互覆盖。

## 浏览器验收

真实 Chromium 十六款全部操作通过：井字平局、色序错误结束、茶杯先对后错、找不同三次错误、密码猜中再重开、字母花园解词及六错、拼词八题、单词搜索五词、24 点求解及三次跳过、成语正确/错误、21 点第二次发牌、纸牌翻牌并选明牌、蛇梯双人完整回合、爬塔十次、骰子及出拳整场到目标再重开。五种视口与第一批一致，全部无页面溢出及脚本错误。

## 边界

金字塔保留随机发牌，未保证每副牌均可拆完；蛇梯浏览器验收完整回合，终点与取消旧回合由脚本状态夹具覆盖。单词/成语词库未扩充，未额外增加关卡。无外部资源依赖，原第三方参考来源保留。

## 实际截图

| 游戏 | 电脑 | 手机 |
| --- | --- | --- |
| 井字棋 | [截图](design/2026-10-16/festival-tictactoe.png) | [截图](design/2026-10-16/festival-tictactoe-mobile.png) |
| 记忆色序 | [截图](design/2026-10-16/festival-simon.png) | [截图](design/2026-10-16/festival-simon-mobile.png) |
| 三仙归洞 | [截图](design/2026-10-16/festival-shellgame.png) | [截图](design/2026-10-16/festival-shellgame-mobile.png) |
| 火眼金睛 | [截图](design/2026-10-16/festival-blinkblink.png) | [截图](design/2026-10-16/festival-blinkblink-mobile.png) |
| 猜数字 1A2B | [截图](design/2026-10-16/festival-guessnum.png) | [截图](design/2026-10-16/festival-guessnum-mobile.png) |
| 猜单词 | [截图](design/2026-10-16/festival-hangman.png) | [截图](design/2026-10-16/festival-hangman-mobile.png) |
| 拼词大师 | [截图](design/2026-10-16/festival-anagram.png) | [截图](design/2026-10-16/festival-anagram-mobile.png) |
| 单词搜索 | [截图](design/2026-10-16/festival-wordsearch.png) | [截图](design/2026-10-16/festival-wordsearch-mobile.png) |
| 速算24点 | [截图](design/2026-10-16/festival-twentyfour.png) | [截图](design/2026-10-16/festival-twentyfour-mobile.png) |
| 成语接龙 | [截图](design/2026-10-16/festival-idiomchain.png) | [截图](design/2026-10-16/festival-idiomchain-mobile.png) |
| 21点 | [截图](design/2026-10-16/festival-blackjack.png) | [截图](design/2026-10-16/festival-blackjack-mobile.png) |
| 金字塔纸牌 | [截图](design/2026-10-16/festival-pyramid.png) | [截图](design/2026-10-16/festival-pyramid-mobile.png) |
| 蛇梯棋 | [截图](design/2026-10-16/festival-snakesladders.png) | [截图](design/2026-10-16/festival-snakesladders-mobile.png) |
| 骰子爬塔 | [截图](design/2026-10-16/festival-dicehill.png) | [截图](design/2026-10-16/festival-dicehill-mobile.png) |
| 骰子对决 | [截图](design/2026-10-16/festival-diceduel.png) | [截图](design/2026-10-16/festival-diceduel-mobile.png) |
| 石头剪刀布 | [截图](design/2026-10-16/festival-rps.png) | [截图](design/2026-10-16/festival-rps-mobile.png) |

完整进度见 [改造清单](redesign-progress.md)，统一试玩页在 `local-previews/pixel-twentysix-2026-10-16.html`。发布信息另记，以上为本地验收。

## 发布前整站检查

`npm run build` 通过：107 款静态校验、106 款模拟初始化（茶杯游戏因静态 DOM 依赖由真实浏览器覆盖）、全部旧批次和两批新回归、生产构建、107 款目录与 6 个旧链接跳转检查均通过。正式构建内 26 款详情页的启动与重开均通过。

浏览器脚本保存在 `scripts/check-workshop-browser.cjs` 和 `scripts/check-festival-browser.cjs`。启动本地站点后，可设置 `PLAYWRIGHT_MODULE`、`CHROMIUM_PATH` 与 `GAME_HUB_URL` 执行；脚本只在测试响应中插入只读状态观察器，不修改实际游戏源码。

## 正式发布核验

2026-10-16，两批以 `9c48783` 统一发布。[GitHub Pages 工作流 38926134567](https://github.com/awiggy/game-hub/actions/runs/38926134567) 构建与部署成功。全部 70 款已改游戏的线上 HTML 哈希与本地一致，本次 26 款正式网站详情页启动及重开通过；线上游戏库仍为 107 款。核验数据见 [发布记录](deployment-twentysix-2026-10-16.json)。
