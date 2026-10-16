const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const root=require('node:path').resolve(__dirname,'..');
function game(id,fields,functions){let src=fs.readFileSync(root+'/games/'+id+'/index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];const at=src.lastIndexOf('})()');src=src.slice(0,at)+`window.test={${functions.join(',')},get:()=>({${fields.join(',')}}),set:v=>{${fields.map(f=>`if('${f}'in v)${f}=v.${f};`).join('')}}};`+src.slice(at);const ctx=new Proxy({},{get:()=>()=>{},set:()=>true});const els=new Map();function el(){return {width:600,height:560,style:{},dataset:{},textContent:'',innerHTML:'',classList:{add(){},remove(){},contains(){return false}},addEventListener(){},getContext:()=>ctx,querySelector:()=>el(),querySelectorAll:()=>[],appendChild(){}}}const sandbox={console,document:{getElementById:id=>{if(!els.has(id))els.set(id,el());return els.get(id)},querySelector:el,querySelectorAll:()=>[],createElement:el},localStorage:{getItem:()=>0,setItem(){}},requestAnimationFrame(){},setTimeout(){},setInterval(){},clearInterval(){},addEventListener(){},Math:Object.create(Math)};const html=fs.readFileSync(root+'/games/'+id+'/index.html','utf8');const dim=html.match(/id="cv" width="(\d+)" height="(\d+)"/);if(dim){const cv=el();cv.width=+dim[1];cv.height=+dim[2];els.set('cv',cv)}sandbox.window=sandbox;vm.runInNewContext(src,sandbox);return sandbox}
const rope=game('ropeswing',['idx','phase','ang','angDir','guy','wx','plats','running','over','frame'],['start','step','release','predict','resumeIsland','loop','setPaused']);
rope.test.setPaused(true);rope.test.setPaused(false); // Focusing the portal iframe before starting must be safe.
rope.test.start();const initialX=rope.test.get().guy.x;
for(let i=0;i<10;i++)rope.test.step();
assert.ok(rope.test.get().guy.x>initialX+20,'visible character must move with the swinging rope');
for(let i=0;i<400;i++){
  const before={...rope.test.get().guy};rope.test.step();const after=rope.test.get();
  assert.ok(Math.abs(after.guy.x-before.x)<4,'swing must remain continuous at both turning points');
  assert.ok(after.ang>=-.35&&after.ang<=.95,'swing angle remains within bounds');
}
for(const random of [0,.5,.999]){
  rope.Math.random=()=>random;
  for(const island of [0,4]){
    let greens=0;
    for(let tick=0;tick<120;tick++){
      rope.test.start();rope.test.set({idx:island});rope.test.resumeIsland();
      for(let i=0;i<tick;i++)rope.test.step();
      const prediction=rope.test.predict(),before={...rope.test.get().guy};
      if(prediction.safe)greens++;
      rope.test.release();assert.equal(rope.test.get().guy.x,before.x);assert.equal(rope.test.get().guy.y,before.y);
      for(let t=0;t<180&&rope.test.get().phase==='fly'&&!rope.test.get().over;t++)rope.test.step();
      assert.equal(rope.test.get().idx===island+1,prediction.safe,'every green and red prediction must agree with actual landing');
    }
    assert.ok(greens>=20,'at least a third of a second of safe release per swing, random='+random+', island='+island);
    console.log('PASS rope prediction at every swing frame; safe window '+(greens/60).toFixed(2)+'s, random='+random+', island='+island);
  }
  rope.test.start();
  for(let island=0;island<20;island++){
    let ticks=0;
    while((rope.test.get().phase!=='swing'||!rope.test.predict().safe)&&ticks++<300)rope.test.step();
    assert.ok(ticks<300,'green light becomes available on island '+island);
    rope.test.release();
    while(rope.test.get().phase==='fly'&&!rope.test.get().over)rope.test.step();
    assert.equal(rope.test.get().idx,island+1,'continuous progression, island '+island);
  }
  while(rope.test.get().phase!=='swing')rope.test.step();
  rope.test.release();while(!rope.test.get().over&&rope.test.get().phase==='fly')rope.test.step();
  assert.equal(rope.test.get().over,true,'immediate backward release misses');
  rope.test.resumeIsland();assert.equal(rope.test.get().idx,20,'retry keeps reached island');assert.equal(rope.test.get().over,false);
}
const fpsAngles=[];
for(const fps of [30,60,120]){
  rope.test.start();rope.test.loop(0);
  for(let i=1;i<=fps;i++)rope.test.loop(i*1000/fps);
  fpsAngles.push(rope.test.get().ang);
}
assert.ok(Math.max(...fpsAngles)-Math.min(...fpsAngles)<.023,'speed consistent on 30/60/120 Hz screens');
console.log('PASS rope continuous swing, 60 consecutive landings, retained checkpoints and frame-rate consistency');
const arrow=game('archery',['angle','power','wind','dist','score','flying','arrows'],['start','shoot','step']);for(const wind of [-3,0,3])for(const dist of [260,340,420]){let best=0;for(let angle=15;angle<=75&&best<10;angle+=3)for(let power=0;power<=100&&best<10;power+=5){arrow.test.start();arrow.test.set({wind,dist,angle,power});arrow.test.shoot();let t=0;while(arrow.test.get().flying&&t++<300)arrow.test.step();best=Math.max(best,arrow.test.get().score)}assert.equal(best,10,'bullseye reachable wind '+wind+' dist '+dist)}console.log('PASS archery bullseye reachable for 3 winds × 3 distances');
const egg=game('catcheggs',['px','eggs','frame','score','lives','over'],['start','step']);egg.test.start();egg.test.set({eggs:[{x:200,y:489,v:4,bomb:false}],frame:0});egg.test.step();assert.equal(egg.test.get().score,1);egg.test.set({eggs:[{x:200,y:489,v:4,bomb:true}],frame:0});egg.test.step();assert.equal(egg.test.get().lives,2);egg.test.set({eggs:[{x:0,y:571,v:3,bomb:false},{x:0,y:571,v:3,bomb:false}],frame:0});egg.test.step();assert.equal(egg.test.get().over,true);console.log('PASS eggs catch, bomb, missed eggs and game over');
const wire=game('tightrope',['lean','leanV'],['start','push']);wire.test.start();wire.test.push(-1);assert.ok(wire.test.get().leanV<0);wire.test.start();wire.test.push(1);assert.ok(wire.test.get().leanV>0);console.log('PASS wire left/right input agrees with visible direction');
