const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const games = JSON.parse(read('src/data/games.json'));
const retired = JSON.parse(read('src/data/retired-games.json'));
const activeIds = new Set(games.map(g => g.id));
assert.equal(activeIds.size, games.length);
assert.equal(new Set(retired.map(g => g.id)).size, retired.length);
for (const g of retired) {
  assert.ok(!activeIds.has(g.id));
  assert.ok(activeIds.has(g.replacement), g.id + ' replacement exists');
  assert.ok(!fs.existsSync(path.join(root, 'games', g.id)));
  const archive = 'archive/retired-games/' + g.retiredAt + '/' + g.id;
  assert.equal(JSON.parse(read(archive + '/meta.json')).id, g.id);
  assert.ok(read(archive + '/index.html').includes('window.__hub'));
  const stub = read('dist/' + g.id + '/index.html');
  assert.ok(stub.includes('../#/game/' + g.replacement));
  assert.ok(!stub.includes('window.__hub'));
  assert.ok(!fs.existsSync(path.join(root, 'dist', g.id, 'meta.json')));
}
assert.ok(!fs.existsSync(path.join(root, 'dist/archive')));
const demos = read('src/pages/CreatePage.vue').match(/const DEMO_MAP = \{([\s\S]*?)\};/)[1];
for (const [,id] of demos.matchAll(/: "([a-z0-9]+)"/g)) assert.ok(activeIds.has(id), 'AI demo references active game: ' + id);
console.log('PASS catalog: ' + games.length + ' active, ' + retired.length + ' archived, valid replacements and demo mappings');
const { game } = require('./check-storybook-ten.cjs');
const matrix = game('memorymatrix', ['level','targets','size','phase','lives','over'], ['start','pick']);
matrix.test.start();
for (let lv=1;lv<=4;lv++) {
  assert.equal(matrix.test.get().level,lv);
  matrix.advance(3000);
  const targets = Array.from(matrix.test.get().targets);
  for (const i of targets) matrix.test.pick(i);
  assert.equal(matrix.test.get().level, lv+1);
  assert.equal(matrix.__hub.score, lv*100);
  matrix.advance(810);
}
assert.ok(matrix.test.get().size > 3);
matrix.test.start(); matrix.advance(3000);
const targets = new Set(matrix.test.get().targets); let wrong=0; while(targets.has(wrong)) wrong++;
matrix.test.pick(wrong);assert.equal(matrix.test.get().lives,2);assert.equal(matrix.test.get().level,1);
matrix.test.start();matrix.advance(3000);assert.equal(matrix.test.get().lives,3);assert.equal(matrix.__hub.score,0);assert.equal(matrix.test.get().phase,'pick');
console.log('PASS memorymatrix: four completed rounds increase difficulty and score; mistake retry and restart');
