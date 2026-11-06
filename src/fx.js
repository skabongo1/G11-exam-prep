/* Answer effects: right = green + red/white/blue/gold fireworks, wrong = red shake.
   Turned off with Data & settings → Answer effects, and reduced for "reduce motion". */
(function(){
'use strict';
const LIGHT=['#e8202a','#1d5cff','#f5b800','#0b2a7a','#ff3b5c','#e8202a','#1d5cff'];const DARK=['#ff3b3b','#4d8bff','#ffd23f','#ffffff','#ff7a90','#7cc4ff'];
const dark=()=>{const t=document.documentElement.getAttribute('data-theme');if(t)return t==='dark';try{return matchMedia('(prefers-color-scheme: dark)').matches}catch(e){return false}};let COLORS=LIGHT;
const reduce=()=>{try{return window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
let cv=null,ctx=null,parts=[],raf=0;
function ensure(){if(cv)return;cv=document.createElement('canvas');cv.className='fx-cv';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);ctx=cv.getContext('2d');size();window.addEventListener('resize',size)}
function size(){if(!cv)return;const d=Math.min(window.devicePixelRatio||1,2);cv.width=innerWidth*d;cv.height=innerHeight*d;cv.style.width=innerWidth+'px';cv.style.height=innerHeight+'px';ctx.setTransform(d,0,0,d,0,0)}
function burst(x,y,n,power){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=(0.35+Math.random()*0.65)*power;
 parts.push({x,y,px:x,py:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,life:0,max:55+Math.random()*35,c:COLORS[(Math.random()*COLORS.length)|0],r:1.4+Math.random()*1.8,tw:Math.random()<0.35})}}
function rocket(x0,y0,x1,y1,delay){setTimeout(()=>{const steps=14;let k=0;const t=setInterval(()=>{k++;const x=x0+(x1-x0)*k/steps,y=y0+(y1-y0)*k/steps;
 parts.push({x,y,px:x,py:y+6,vx:(Math.random()-.5)*.4,vy:.6,life:0,max:14,c:'#ffd23f',r:1.6,tw:false});if(k>=steps){clearInterval(t);burst(x,y,70,5.6)}},16)},delay)}
function tick(){ctx.clearRect(0,0,innerWidth,innerHeight);ctx.globalCompositeOperation=dark()?'lighter':'source-over';
 parts=parts.filter(p=>p.life<p.max);
 for(const p of parts){p.life++;p.px=p.x;p.py=p.y;p.vx*=0.975;p.vy=p.vy*0.975+0.075;p.x+=p.vx;p.y+=p.vy;
  const f=1-p.life/p.max;const a=p.tw?(Math.random()<0.5?f:f*0.25):f;ctx.globalAlpha=Math.max(0,a);
  ctx.strokeStyle=p.c;ctx.lineWidth=p.r*1.7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p.px,p.py);ctx.lineTo(p.x,p.y);ctx.stroke()}
 ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 if(parts.length)raf=requestAnimationFrame(tick);else{raf=0;ctx.clearRect(0,0,innerWidth,innerHeight)}}
function go(){if(!raf)raf=requestAnimationFrame(tick)}
function anim(el,cls){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),900)}
window.G11FX={
 right(el){if(!el)return;anim(el,'fx-pop');if(window.G11FX.off||reduce())return;ensure();const r=el.getBoundingClientRect();const x=r.left+Math.min(r.width-20,Math.max(20,r.width*0.25)),y=r.top+r.height/2;
  COLORS=dark()?DARK:LIGHT;burst(x,y,60,4.6);const W=innerWidth;rocket(x,y,Math.max(30,x-90-Math.random()*60),Math.max(40,y-140-Math.random()*60),120);rocket(x,y,Math.min(W-30,x+90+Math.random()*80),Math.max(40,y-120-Math.random()*70),260);go();setTimeout(go,130);setTimeout(go,280)},
 wrong(el){if(!el)return;if(window.G11FX.off||reduce()){anim(el,'fx-flash');return}anim(el,'fx-shake')},
 off:false
};
})();
