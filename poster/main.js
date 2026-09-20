// Original procedural artwork. No external images, fonts, libraries or network requests.
const canvas = document.querySelector('#world')
const ctx = canvas.getContext('2d', { alpha: false })
const sceneButtons = [...document.querySelectorAll('[data-scene]')]
const pauseButton = document.querySelector('#pause')
const progress = document.querySelector('#progress')
const motion = matchMedia('(prefers-reduced-motion: reduce)')
const TAU = Math.PI * 2
const WIDTH = 640, HEIGHT = 400, DURATION = 24
let time = 0, last = 0, paused = motion.matches, frame = 0
let sceneIndex = -1, pointer = { x: 390, y: 190, active: false }, drift = { x: 0, y: 0 }
let ripple = null, portrait = false
let seed = 87341
const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296)
const range = (min, max) => min + random() * (max - min)
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x))
const smooth = (a, b, x) => { const v = clamp((x - a) / (b - a)); return v * v * (3 - 2 * v) }
const gray = (v) => { const n = Math.round(clamp(v, 0, 255)); return `rgb(${n},${n},${n})` }
function rect(x,y,w,h,color) {ctx.fillStyle=typeof color==='number'?gray(color):color;ctx.fillRect(Math.round(x),Math.round(y),w,h)}
function line(x,y,xx,yy,color,width=1) {ctx.strokeStyle=gray(color);ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(Math.round(x),Math.round(y));ctx.lineTo(Math.round(xx),Math.round(yy));ctx.stroke()}
function polygon(points,color) {ctx.fillStyle=gray(color);ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill()}

const stars=Array.from({length:230},()=>({x:range(0,640),y:range(0,380),size:random()>.97?2:1,light:range(20,80),phase:range(0,TAU)}))
const dust=Array.from({length:240},()=>({x:range(150,620),y:range(35,355),speed:range(1,7),phase:range(0,TAU),size:random()>.9?2:1}))
const gate=[]
for(let y=-102;y<=102;y+=2) for(let x=-102;x<=102;x+=2) {
  const radius=Math.hypot(x,y), angle=Math.atan2(y,x)
  if(radius>78 && radius<94 && random()>.15) gate.push({x,y,angle,radius,light:range(120,250),offset:range(0,1),spin:range(-.2,.2)})
  else if(radius>=94 && radius<108 && random()<.09) gate.push({x,y,angle,radius,light:range(40,125),offset:range(0,1),spin:range(-.4,.4)})
}
const orbiters=Array.from({length:130},()=>({angle:range(0,TAU),r:range(98,160),speed:range(.025,.1),size:random()>.75?2:1,light:range(35,160)}))
const tiles=[]
for(let i=-8;i<=8;i++) for(let j=-6;j<=6;j++) {
 const edge=(i/8.2)**2+(j/6.2)**2
 if(edge>1+range(-.13,.1))continue
 const h=Math.round(range(2,8)),depth=range(16,55)*(1-edge*.55)
 tiles.push({i,j,x:388+(i-j)*11,y:306+(i+j)*5,h,depth,light:range(21,43),speck:random()})
}
tiles.sort((a,b)=>a.y-b.y)
const shards=Array.from({length:50},()=>({x:range(253,548),y:range(335,397),size:range(1,4),fall:range(.4,1.6),light:range(20,70)}))

// Camera transform keeps the artwork inside a portrait viewport without cropping companions.
function setTransform() {
 if(portrait) { const scale=canvas.width/370; ctx.setTransform(scale,0,0,scale,-225*scale,canvas.height*.07) }
 else ctx.setTransform(canvas.width/WIDTH,0,0,canvas.height/HEIGHT,0,0)
}
function resize() {
 const bounds=canvas.getBoundingClientRect()
 portrait=bounds.width/bounds.height<1
 canvas.width=portrait?370:640
 canvas.height=Math.round(canvas.width*bounds.height/bounds.width)
 ctx.imageSmoothingEnabled=false
 render()
}
function drawGate(t, chapter) {
 const gx=423+drift.x*.7,gy=154+drift.y*.7
 // Dark aperture, with sparse stippling rather than a soft gradient.
 for(let r=74;r>0;r-=3) {
  ctx.strokeStyle=gray(10+(1-r/74)*5);ctx.lineWidth=3;ctx.beginPath();ctx.arc(gx,gy,r,0,TAU);ctx.stroke()
 }
 for(const p of orbiters) {
  const a=p.angle+t*p.speed
  const x=gx+Math.cos(a)*p.r,y=gy+Math.sin(a)*p.r*.88
  const bright=p.light*(.7+.3*Math.sin(t+p.angle))
  rect(x,y,p.size,p.size,bright)
 }
 const gather=.86+.14*Math.sin(t*.21)
 for(const p of gate) {
  const oscillation=Math.sin(t*.8+p.angle*5)*1.6
  const crack=Math.sin(p.angle*9+t*.16)>.92?8:0
  const dissolve=(1-gather)*p.offset*38+crack
  let x=gx+p.x+Math.cos(p.angle)*dissolve+oscillation
  let y=gy+p.y+Math.sin(p.angle)*dissolve
  let light=p.light*(.8+.2*Math.sin(p.angle-t*.45))
  if(pointer.active){const dx=x-pointer.x,dy=y-pointer.y,d=Math.hypot(dx,dy);if(d<42){x+=dx*(42-d)/90;y+=dy*(42-d)/90;light+=35}}
  if(ripple){const d=Math.hypot(x-ripple.x,y-ripple.y),r=(t-ripple.t)*95;if(Math.abs(d-r)<15){light=255;x+=Math.cos(p.angle)*3}}
  rect(x,y,2,2,light)
 }
 // Inner broken circumference and a small drifting moon.
 for(let a=0;a<TAU;a+=.025) if(Math.sin(a*13+t*.2)>.25) rect(gx+Math.cos(a)*75,gy+Math.sin(a)*75,1,1,110)
 const core=chapter===2?22:13
 for(let y=-core;y<core;y+=2)for(let x=-core;x<core;x+=2)if(x*x+y*y<core*core&&((x+y)%6===0||x>2))rect(gx+x,gy+y,2,2,75+((x+core)/(core*2))*100)
 // Vertical fragments of light leak towards the landing.
 for(let i=0;i<28;i++) {const x=gx-20+(i*17%41);const y=gy+50+(i*19+t*9)%83;rect(x,y,1,i%3+1,25+i%5*8)}
}
function drawTerrain(t, chapter) {
 ctx.save();ctx.translate(drift.x*.35,drift.y*.35)
 for(const tile of tiles){
  const {x,y,h,depth,light,i,j}=tile
  polygon([[x-11,y-h],[x,y+5-h],[x,y+depth],[x-11,y+depth-6]],light*.45)
  polygon([[x,y+5-h],[x+11,y-h],[x+11,y+depth-6],[x,y+depth]],light*.65)
  polygon([[x,y-5-h],[x+11,y-h],[x,y+5-h],[x-11,y-h]],light)
  if(tile.speck>.45)rect(x-3,y-h-2,2,1,light+33)
  if(tile.speck>.85)line(x+1,y+7,x+1,y+depth-3,light+6)
 }
 for(const p of shards){rect(p.x,p.y+Math.sin(t*p.fall)*2,p.size,Math.ceil(p.size*1.6),p.light)}
 // Angular road, branching around the gate platform.
 const roads=[[[262,334],[325,304],[370,285],[422,260]]]
 if(chapter===2)roads.push([[325,304],[367,324],[461,281]])
 roads.forEach((road,k)=>{
  for(let n=0;n<road.length-1;n++){
   const a=road[n],b=road[n+1],distance=Math.hypot(b[0]-a[0],b[1]-a[1])
   for(let s=0;s<distance;s+=5){const u=s/distance,x=a[0]+(b[0]-a[0])*u,y=a[1]+(b[1]-a[1])*u
    polygon([[x-7,y],[x,y-4],[x+7,y],[x,y+4]],k?70:110)
    line(x-5,y,x,y+2,k?100:150)
   }
  }
 })
 // Portal foundation.
 polygon([[388,257],[423,240],[458,257],[423,275]],70)
 polygon([[388,257],[423,275],[423,284],[388,266]],24)
 polygon([[423,275],[458,257],[458,266],[423,284]],45)
 line(388,257,423,240,170);line(423,240,458,257,130)
 for(let i=0;i<7;i++)line(408-i*2,276+i*2,430-i*2,265+i*2,85-i*5)
 // Pixel foliage and ruin silhouettes.
 for(const [x,y,size] of [[292,300,1],[358,263,1.25],[481,302,.8],[496,268,1],[399,335,.7]]){
  rect(x,y-14*size,2*size,16*size,51)
  for(let z=0;z<4;z++) {const w=(5-z)*3*size;rect(x-w/2,y-(z*5+8)*size,w,4*size,34+z*8)}
 }
 for(const [x,y] of [[340,331],[469,257],[303,278]]){
  polygon([[x,y],[x+8,y-4],[x+8,y-25],[x+2,y-22]],62)
  polygon([[x,y],[x-5,y-3],[x-5,y-27],[x+2,y-22]],32)
  line(x-5,y-27,x+2,y-30,130)
 }
 ctx.restore()
}
const sprites=[
 ['00111100','01111110','00111100','00111100','01111110','11111111','10111101','00111100','00111100','00100100','01100110'],
 ['00011000','00111100','01111110','11011011','00011000','00111100','01111110','00111100','01111110','00100100','00100100'],
 ['00111100','01111110','00111100','00111100','01111110','11111111','11111111','01111110','00111100','00100100','01100110'],
]
function person(x,y,index,t,alpha=1){
 ctx.save();ctx.globalAlpha=alpha
 const scale=1.3,walk=Math.sin(t*5+index)*.65
 polygon([[x-4,y+2],[x+3,y-2],[x+15,y+5],[x+8,y+8]],6)
 sprites[index].forEach((row,j)=>[...row].forEach((v,i)=>{if(v==='1')rect(x+(i-4)*scale+(j>8?(j%2?walk:-walk):0),y+(j-11)*scale,scale,scale,j<4?220:index===0?240:index===1?160:105)}))
 rect(x-1,y-9,3,5,index===0?80:40)
 ctx.restore()
}
function render(){
 ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#080808';ctx.fillRect(0,0,canvas.width,canvas.height);setTransform()
 const t=time,chapter=Math.floor((t%DURATION)/8)
 for(const s of stars){let light=s.light*(.6+.4*Math.sin(t*.6+s.phase));if(s.x<290&&s.y<215)light*=.22;rect(s.x+drift.x*.15,s.y+drift.y*.15,s.size,s.size,light)}
 // A low-contrast diagonal field balances the empty upper-left text area.
 for(let i=0;i<38;i++)rect(98+i*5,358-i*1.8,1,1,22)
 drawGate(t,chapter);drawTerrain(t,chapter)
 const walkX=Math.sin(t*.35)*5, walkY=-Math.sin(t*.35)*2.5
 const x=339+walkX+drift.x*.35,y=294+walkY+drift.y*.35
 person(x,y,0,t)
 const company=smooth(5,9,t%DURATION)*(1-smooth(22,24,t%DURATION))
 person(x-15,y+9,1,t,company);person(x-28,y+15,2,t,company)
 if(company>0 && company<1){for(let i=0;i<30;i++){const n=(i*37%31)/31;rect(x-30+(i*17%34),y-16+(i*13%40),1,1,(1-company)*n*170)}}
 for(const p of dust){const y=((p.y-t*p.speed)%330+330)%330;rect(p.x+Math.sin(t*.3+p.phase)*3+drift.x*.3,y,p.size,p.size,35+Math.sin(t+p.phase)*20)}
 if(ripple){const age=t-ripple.t;if(age<1.5){for(let i=0;i<60;i++){const a=i/60*TAU;rect(ripple.x+Math.cos(a)*age*95,ripple.y+Math.sin(a)*age*65,1,1,(1-age/1.5)*130)}}else ripple=null}
 if(chapter!==sceneIndex){sceneIndex=chapter;sceneButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===chapter)))}
 progress.style.transform=`scaleX(${(t%DURATION)/DURATION})`
}
function tick(now){
 const dt=last?Math.min((now-last)/1000,.05):0;last=now
 if(!paused){time+=dt;drift.x+=((pointer.active?(pointer.x-380)/55:0)-drift.x)*.06;drift.y+=((pointer.active?(pointer.y-200)/65:0)-drift.y)*.06;render()}
 frame=requestAnimationFrame(tick)
}
function setPaused(value){paused=value;pauseButton.setAttribute('aria-pressed',String(value));pauseButton.setAttribute('aria-label',value?'播放动画':'暂停动画');render()}
function selectScene(index){time=(index+3)%3*8+1;sceneIndex=-1;ripple=null;render()}
sceneButtons.forEach((button)=>button.addEventListener('click',()=>selectScene(Number(button.dataset.scene))))
pauseButton.addEventListener('click',()=>setPaused(!paused))
document.querySelector('#replay').addEventListener('click',()=>{time=0;ripple=null;setPaused(motion.matches)})
function coordinates(event){const r=canvas.getBoundingClientRect();if(portrait){const scale=r.width/370;return{x:(event.clientX-r.left)/scale+225,y:(event.clientY-r.top-r.height*.07)/scale}}return{x:(event.clientX-r.left)/r.width*WIDTH,y:(event.clientY-r.top)/r.height*HEIGHT}}
canvas.addEventListener('pointermove',(e)=>{pointer={...coordinates(e),active:true};if(paused)render()})
canvas.addEventListener('pointerleave',()=>{pointer.active=false;if(paused)render()})
canvas.addEventListener('click',(e)=>{const pos=coordinates(e);ripple={...pos,t:time};if(paused)render()})
document.addEventListener('keydown',(e)=>{if(e.target.closest('button'))return;if(e.code==='Space'){e.preventDefault();setPaused(!paused)}else if(e.code==='ArrowRight'){e.preventDefault();selectScene(sceneIndex+1)}else if(e.code==='ArrowLeft'){e.preventDefault();selectScene(sceneIndex-1)}})
motion.addEventListener('change',()=>setPaused(motion.matches))
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else if(!frame){last=0;frame=requestAnimationFrame(tick)}})
new ResizeObserver(resize).observe(canvas)
setPaused(paused);resize();frame=requestAnimationFrame(tick)
