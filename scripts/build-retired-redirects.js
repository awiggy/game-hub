// Compatibility entry points are generated after Vite copies only active games.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const retired = JSON.parse(readFileSync(resolve(root, 'src/data/retired-games.json'), 'utf8'))
const games = JSON.parse(readFileSync(resolve(root, 'src/data/games.json'), 'utf8'))
for (const game of retired) {
  if (!/^[a-z0-9-]+$/.test(game.id) || !/^[a-z0-9-]+$/.test(game.replacement)) throw new Error('Invalid redirect id')
  if (games.some(g => g.id === game.id) || !games.some(g => g.id === game.replacement)) throw new Error('Invalid catalog replacement: ' + game.id)
  const url = '../#/game/' + game.replacement
  const directory = resolve(root, 'dist', game.id)
  mkdirSync(directory, { recursive: true })
  writeFileSync(resolve(directory, 'index.html'), '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=' + url + '"><title>打开游戏</title><p>这款游戏已从目录整理归档。<a href="' + url + '">打开保留的同类游戏</a></p><script>location.replace(' + JSON.stringify(url) + ')</script></html>\n')
}
console.log('✅ ' + retired.length + ' 个旧游戏入口已生成跳转页')
