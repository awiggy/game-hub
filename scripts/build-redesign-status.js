// One status entry per active game; archived games are tracked separately.
import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import {fileURLToPath} from 'node:url'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'))
const data=read('docs/redesign-status.json'),games=read('src/data/games.json'),retired=read('src/data/retired-games.json')
const active=Array.isArray(games)?games:games.games
const records=new Map(data.records.map(r=>[r.id,r]))
assert.equal(records.size,data.records.length,'Duplicate progress entry')
assert.equal(records.size,active.length,'Progress inventory must cover the current active catalog')
const statuses={completed:'已完成',in_progress:'进行中',planned:'已排期',not_started:'待改造'}
for(const g of active){const r=records.get(g.id);assert.ok(r,'Missing progress: '+g.id);assert.ok(r.status in statuses);assert.equal(r.name,g.name,'Name mismatch: '+g.id);if(r.status==='completed'){assert.ok(r.batch&&r.verification,'Completed entry needs batch and evidence');assert.ok(fs.existsSync(path.join(root,r.verification)),'Missing evidence: '+r.verification)}}
const retiredList=Array.isArray(retired)?retired:retired.games||retired.retired
assert.deepEqual(data.archived.map(r=>r.id).sort(),retiredList.map(r=>r.id).sort(),'Archived progress must match retirement manifest')
for(const r of data.archived){assert.ok(!records.has(r.id));assert.ok(fs.existsSync(path.join(root,r.archive)))}
const counts=Object.fromEntries(Object.keys(statuses).map(k=>[k,data.records.filter(r=>r.status===k).length]))
const batches={snake:'贪吃蛇样板',three:'首批三款',ten:'第一轮十款','next-ten':'第二轮十款','crafted-ten':'精细改造十款','storybook-ten':'绘本改造十款','workshop-ten':'工坊主题十款','festival-sixteen':'游园主题十六款','storybook-twentyseven':'精细改造 · 二十七款','final-ten':'收尾精细改造 · 十款'}
let text=`# 游戏视觉改造进度\n\n更新：${data.updatedAt}。此表由脚本根据统一台账生成，并与实际游戏目录核对。\n\n在架 **${active.length} 款**：**${counts.completed} 款已完成**、${counts.in_progress} 款进行中、${counts.planned} 款已排期、**${counts.not_started} 款待改造**。另有 ${data.archived.length} 款已归档，不计入在架进度。\n\n“已完成”表示视觉改造与该批记录中的验收已完成；具体覆盖范围见验收报告，不代表长期平衡性或所有随机牌局均可通关。发布信息见 [项目记忆](../PROJECT_MEMORY.md)。\n`
for(const [status,title]of Object.entries(statuses)){const rows=data.records.filter(r=>r.status===status);if(!rows.length)continue;text+=`\n## ${title}（${rows.length} 款）\n\n| 游戏 | 标识 | 批次 | 验收记录 |\n| --- | --- | --- | --- |\n`;for(const r of rows){text+=`| [${r.name}](https://awiggy.github.io/game-hub/#/game/${r.id}) | ${r.id} | ${batches[r.batch]||r.batch||'—'} | ${r.verification?'[查看]('+r.verification.replace(/^docs\//,'')+')':'—'} |\n`}}
text+='\n## 已归档\n\n| 游戏 | 标识 | 源码备份 |\n| --- | --- | --- |\n';for(const r of data.archived)text+=`| ${r.name} | ${r.id} | [备份](../${r.archive}) |\n`
text+='\n## 维护方式\n\n编辑 `docs/redesign-status.json`，为每款填写状态、批次和验收记录，再运行 `npm run progress`。构建前自动验证目录覆盖、重复标识和证据文件，避免漏记或重复计入。新增游戏需要同时增加待改造条目，移出游戏需要转入归档清单。\n'
fs.writeFileSync(path.join(root,'docs/redesign-progress.md'),text)
console.log(`Progress: ${counts.completed}/${active.length} completed; ${counts.not_started} pending; ${data.archived.length} archived.`)
