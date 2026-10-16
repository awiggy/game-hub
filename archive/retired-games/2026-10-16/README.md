# 2026-10-16 目录筛除备份

本轮从正式目录移出六款，原 HTML 和元数据完整保留在此，不参与网站构建。判断及完整盘点见 [筛除报告](../../../docs/gameplay-audit-2026-10-16.md)。旧入口由 src/data/retired-games.json 映射至保留游戏。

需要恢复时：将对应子目录移回 games/，从 retired-games.json 移除对应条目，重新生成注册表并构建。原 localStorage 纪录未清除。

- 极速避让（racedodge） → 高山滑雪
- 乒乓快打（tabletennis） → 冰球对战
- 数字记忆（digitspan） → 记忆色序
- 记忆路线（memorypath） → 记忆色序
- 连数字走格（numchain） → 舒尔特方格
- 旋转拼图（picrotate） → 接水管
