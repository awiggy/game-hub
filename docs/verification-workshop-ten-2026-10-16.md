# 十款工坊主题视觉改造验收

日期：2026-10-16。两批共 26 款按用户要求统一发布。

## 范围

本次第一批十款：饼干工坊、记忆矩阵、填色拼图、四子连线、五子棋、海战棋、迷宫探险、汽车华容道、骑士巡游、一笔画。

## 画面实现

主题分别为黄油饼干屋、蜜蜂花田、彩色织毯、贝壳湾、橡果木棋盘、珊瑚海船队、奶酪花园、送货车街区、小马花园和银河星线。实际角色、棋子、车辆、船段、可达格与成功反馈均已改造，沿用游戏标识与入口。

## 玩法修复

饼干帮手按钮不再每帧重建，产出与库存分开；填色图按已知可行路线设置步数，90 张生成图验证可完成；四子连线和五子棋重开会取消上一局 AI；海战五艘船完整且不重叠；汽车华容道第四图修复越界车辆；一笔画三图修复不可一笔完成的连线。

## 脚本回归

`scripts/check-workshop-ten.cjs` 执行实际内联脚本，验证饼干生产/购买/截止/重开、记忆五轮、填色 90 图、连线与五子胜负/AI、舰船生成与弹药耗尽、迷宫 BFS 三关、华容道 BFS 四关、骑士 25 格独立求解、一笔画三张欧拉路线与最终 300 分。

## 浏览器验收

真实 Chromium 逐款点击/键盘交互；填色三关、海战全部五船、迷宫三关、汽车四关、骑士巡游 25 格、一笔画三关完成。其余覆盖有效回合、操作与重开。五种视口：900×720、320×568、390×600、768×430、844×390；无页面横纵溢出，未捕获脚本错误。

## 边界

没有把无尽或棋类统一改成关卡制，没有新增关卡设计。现有迷宫、车辆和星图的可解性修复已经验证；长期平衡与全部对弈策略不在本次验收范围。

## 实际截图

| 游戏 | 电脑 | 手机 |
| --- | --- | --- |
| 饼干工坊 | [截图](design/2026-10-16/workshop-cookieidler.png) | [截图](design/2026-10-16/workshop-cookieidler-mobile.png) |
| 记忆矩阵 | [截图](design/2026-10-16/workshop-memorymatrix.png) | [截图](design/2026-10-16/workshop-memorymatrix-mobile.png) |
| 填色拼图 | [截图](design/2026-10-16/workshop-colorfill.png) | [截图](design/2026-10-16/workshop-colorfill-mobile.png) |
| 四子连线 | [截图](design/2026-10-16/workshop-connect4.png) | [截图](design/2026-10-16/workshop-connect4-mobile.png) |
| 五子棋 | [截图](design/2026-10-16/workshop-gobang.png) | [截图](design/2026-10-16/workshop-gobang-mobile.png) |
| 海战棋 | [截图](design/2026-10-16/workshop-battleship.png) | [截图](design/2026-10-16/workshop-battleship-mobile.png) |
| 迷宫探险 | [截图](design/2026-10-16/workshop-maze.png) | [截图](design/2026-10-16/workshop-maze-mobile.png) |
| 汽车华容道 | [截图](design/2026-10-16/workshop-rushhour.png) | [截图](design/2026-10-16/workshop-rushhour-mobile.png) |
| 骑士巡游 | [截图](design/2026-10-16/workshop-knightstour.png) | [截图](design/2026-10-16/workshop-knightstour-mobile.png) |
| 一笔画 | [截图](design/2026-10-16/workshop-onestroke.png) | [截图](design/2026-10-16/workshop-onestroke-mobile.png) |

完整进度见 [改造清单](redesign-progress.md)，统一试玩页在 `local-previews/pixel-twentysix-2026-10-16.html`。发布信息另记，以上为本地验收。

## 发布前整站检查

`npm run build` 通过：107 款静态校验、106 款模拟初始化（茶杯游戏因静态 DOM 依赖由真实浏览器覆盖）、全部旧批次和两批新回归、生产构建、107 款目录与 6 个旧链接跳转检查均通过。正式构建内 26 款详情页的启动与重开均通过。

浏览器脚本保存在 `scripts/check-workshop-browser.cjs` 和 `scripts/check-festival-browser.cjs`。启动本地站点后，可设置 `PLAYWRIGHT_MODULE`、`CHROMIUM_PATH` 与 `GAME_HUB_URL` 执行；脚本只在测试响应中插入只读状态观察器，不修改实际游戏源码。

## 正式发布核验

2026-10-16，两批以 `9c48783` 统一发布。[GitHub Pages 工作流 38926134567](https://github.com/awiggy/game-hub/actions/runs/38926134567) 构建与部署成功。全部 70 款已改游戏的线上 HTML 哈希与本地一致，本次 26 款正式网站详情页启动及重开通过；线上游戏库仍为 107 款。核验数据见 [发布记录](deployment-twentysix-2026-10-16.json)。
