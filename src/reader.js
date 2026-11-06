/* ============================================================
   Code-book reader. Opens the learner's own PDF copies of the 2018 IBC and the
   Concrete Manual. The file is kept in this browser (IndexedDB) and never uploaded.
   Page turning (buttons, swipe, arrow keys), highlighting, tabs, page notes, search,
   printed-page offset, and "open in my book" links from questions.
   Annotations live in the app's progress data (S.books), so Export carries them.
   ============================================================ */
(function(){
'use strict';
const G=window.G11;
const BOOKS={ibc:{name:'2018 IBC',full:'2018 International Building Code'},cm:{name:'Concrete Manual',full:'Concrete Manual (2021 IBC / ACI 318-19 edition)'}};
const COLORS=[['y','Yellow','Values and limits'],['b','Blue','Definitions and key terms'],['p','Pink','Exceptions'],['g','Green','Tables and section starts']];
const HEX={y:'rgba(255,221,0,.38)',b:'rgba(80,170,255,.32)',p:'rgba(255,105,170,.32)',g:'rgba(60,200,120,.32)'};
const TABCOL={1:'var(--d1)',2:'var(--d2)',3:'var(--d3)',4:'var(--d4)',0:'var(--muted)'};

/* ---------- storage of the PDF file (this device only) ---------- */
function idb(){return new Promise((res,rej)=>{let r;try{r=indexedDB.open('g11books',1)}catch(e){rej(e);return}r.onupgradeneeded=()=>r.result.createObjectStore('files');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function fget(k){const db=await idb();return new Promise((res,rej)=>{const q=db.transaction('files').objectStore('files').get(k);q.onsuccess=()=>res(q.result||null);q.onerror=()=>rej(q.error)})}
async function fput(k,v){const db=await idb();return new Promise((res,rej)=>{const t=db.transaction('files','readwrite');t.objectStore('files').put(v,k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error)})}
async function fdel(k){const db=await idb();return new Promise((res,rej)=>{const t=db.transaction('files','readwrite');t.objectStore('files').delete(k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error)})}

let LIB=null;
async function lib(){if(LIB)return LIB;LIB=await import('./lib/pdfjs/pdf.min.mjs');LIB.GlobalWorkerOptions.workerSrc='./lib/pdfjs/pdf.worker.min.mjs';return LIB}

let API=null;            // provided by app.js: {S, save, toast, esc, head, say}
const DOCS={};           // book -> {doc, text:{}}
const R={book:'ibc',zoom:1,mode:'read',color:'y',panel:'tabs',hitQ:'',hits:[],searching:0,pending:null,task:null};
const $=s=>document.querySelector(s);
function A(k){const S=API.S;S.books=S.books||{};const b=S.books[k]=S.books[k]||{};
 b.offset=b.offset||0;b.offsetSet=!!b.offsetSet;b.tabs=b.tabs||[];b.hl=b.hl||{};b.notes=b.notes||{};b.last=b.last||1;return b}
const esc=s=>API.esc(s);

/* ---------- public: open from anywhere ---------- */
G.READER={
 open(book,opt){R.book=book==='cm'?'cm':'ibc';R.pending=opt||null;if(location.hash==='#reader')G.READER.view(document.querySelector('#main'),API);else location.hash='reader'},
 view(m,api){API=api;render(m)},
 bind(api){API=api}
};

function printedOf(k,p){const b=A(k);return b.offsetSet?p-b.offset:null}
function pdfOf(k,printed){const b=A(k);return printed+(b.offset||0)}

async function render(m){
 const k=R.book,b=A(k),S=API.S;
 const inRun=S.run&&!S.run.done;
 m.innerHTML=`${API.head('My code books','Your own PDF copies, with page turning, highlighting, tabs and notes. The file stays on this device. Nothing is uploaded.')}
 ${inRun?`<div class="callout warn row between"><span><b>${esc(S.run.label)} is still running.</b> The clock keeps going while you look things up, just like the real exam.</span><a class="btn sm primary" href="#${S.run.kind==='exam'?'exam':S.run.kind==='diag'?'diagnostic':'practice'}">Return to the exam</a></div>`:''}
 <div class="seg" role="tablist" aria-label="Book">${Object.keys(BOOKS).map(x=>`<button role="tab" aria-selected="${x===k}" data-book="${x}">${BOOKS[x].name}</button>`).join('')}</div>
 <div id="rdBody"><p class="muted">Loading…</p></div>`;
 m.querySelectorAll('[data-book]').forEach(x=>x.onclick=()=>{R.book=x.dataset.book;R.hitQ='';R.hits=[];render(m)});
 let f=null;try{f=await fget(k)}catch(e){}
 const body=$('#rdBody');if(!body)return;
 if(!f){body.innerHTML=picker(k);wirePicker(m,k);return}
 try{await loadDoc(k,f)}catch(e){body.innerHTML=`<div class="card stack"><p class="err">This file could not be opened as a PDF (${esc(e&&e.message||e)}).</p>${picker(k,true)}</div>`;wirePicker(m,k);return}
 shell(m,k);
}

function picker(k,replace){return `<section class="card stack"><h2 class="h3">${replace?'Choose a different file':'Add your '+BOOKS[k].full}</h2>
 <p>Pick the PDF you bought (for example from ICC). The app keeps it only in this browser on this device, so you can read, highlight and tab it offline. It is never sent anywhere.</p>
 <div class="field"><label for="rdFile">PDF file</label><input id="rdFile" type="file" accept="application/pdf,.pdf"></div>
 <p class="muted small">Only PDFs without copy protection open here. Books that only run inside ICC's own reader cannot be added; use the printed book with the tab plan in Book guides instead. In the testing center you will use your printed books.</p></section>`}
function wirePicker(m,k){const i=$('#rdFile');if(!i)return;i.onchange=async()=>{const file=i.files[0];if(!file)return;
 if(!/pdf/i.test(file.type)&&!/\.pdf$/i.test(file.name)){API.toast('Choose a PDF file');return}
 try{await fput(k,{blob:file,name:file.name,size:file.size,added:Date.now()});delete DOCS[k];const b=A(k);b.file={name:file.name,size:file.size};API.save();API.toast('Book added on this device');render(m)}
 catch(e){API.toast('The browser would not store this file. Free some space and try again.')}}}

async function loadDoc(k,f){if(DOCS[k])return DOCS[k];const L=await lib();const data=new Uint8Array(await f.blob.arrayBuffer());
 const doc=await L.getDocument({data,standardFontDataUrl:'./lib/pdfjs/standard_fonts/',wasmUrl:'./lib/pdfjs/wasm/',iccUrl:'./lib/pdfjs/iccs/',isEvalSupported:false}).promise;
 DOCS[k]={doc,text:{},name:f.name};return DOCS[k]}

/* ---------- reader shell ---------- */
function shell(m,k){const D=DOCS[k],b=A(k),N=D.doc.numPages;
 if(R.pending){const p=R.pending;R.pending=null;if(p.printed){b.last=Math.min(N,Math.max(1,pdfOf(k,+p.printed)));if(!b.offsetSet)API.toast('Set the page offset once so printed page numbers line up')}if(p.find){R.hitQ=p.find;setTimeout(()=>runSearch(m,k,p.find,true),50)}}
 const page=Math.min(N,Math.max(1,b.last||1));b.last=page;
 $('#rdBody').innerHTML=`
 <div class="rd-tools card">
  <div class="row wrap">
   <button class="btn sm" id="rdPrev" aria-label="Previous page">◀</button>
   <label class="rd-pg">PDF page <input id="rdPage" type="number" min="1" max="${N}" value="${page}" inputmode="numeric"> / ${N}</label>
   <button class="btn sm" id="rdNext" aria-label="Next page">▶</button>
   <span class="muted small" id="rdPrinted"></span>
   <span class="sp"></span>
   <button class="btn sm" id="rdZo" aria-label="Zoom out">−</button><button class="btn sm" id="rdZf">Fit</button><button class="btn sm" id="rdZi" aria-label="Zoom in">+</button>
  </div>
  <div class="row wrap">
   <div class="seg sm" role="radiogroup" aria-label="Mode">${[['read','📖 Read'],['hl','🖍 Highlight'],['erase','⌫ Erase']].map(x=>`<button role="radio" aria-checked="${R.mode===x[0]}" data-mode="${x[0]}">${x[1]}</button>`).join('')}</div>
   <span class="rd-sw" ${R.mode==='hl'?'':'hidden'} id="rdSw">${COLORS.map(c=>`<button class="swb ${c[0]}" data-col="${c[0]}" aria-pressed="${R.color===c[0]}" title="${c[1]}: ${c[2]}" aria-label="${c[1]}: ${c[2]}"></button>`).join('')}</span>
   <button class="btn sm" id="rdTab">＋ Tab this page</button>
   <button class="btn sm" id="rdNoteB">✎ Page note</button>
  </div>
  <form class="row wrap" id="rdSearch"><input id="rdQ" placeholder="Search this book: e.g. 1004.5, guard, slump" value="${esc(R.hitQ)}" aria-label="Search this book"><button class="btn sm primary">Search</button><span class="muted small" id="rdSStat"></span></form>
  <div class="rd-strip" id="rdStrip"></div>
 </div>
 <div class="rd-wrap">
  <div class="rd-stage" id="rdStage" tabindex="0" aria-label="Page view. Swipe or use arrow keys to turn pages."><div class="rd-pagebox" id="rdBox"><canvas id="rdCv"></canvas><div class="rd-ov" id="rdOv"></div></div></div>
  <aside class="rd-side card">
   <div class="seg sm" role="tablist">${[['tabs','Tabs'],['hl','Highlights'],['notes','Notes'],['find','Search'],['set','Settings']].map(x=>`<button role="tab" aria-selected="${R.panel===x[0]}" data-panel="${x[0]}">${x[1]}</button>`).join('')}</div>
   <div id="rdPanel"></div>
  </aside>
 </div>`;
 const go=p=>{p=Math.min(N,Math.max(1,p|0));if(p===b.last&&$('#rdCv').dataset.p==p)return;b.last=p;API.save();$('#rdPage').value=p;draw(k)};
 R.go=go;
 $('#rdPrev').onclick=()=>go(b.last-1);$('#rdNext').onclick=()=>go(b.last+1);
 $('#rdPage').onchange=e=>go(+e.target.value);
 $('#rdZo').onclick=()=>{R.zoom=Math.max(.6,+(R.zoom-.25).toFixed(2));draw(k)};$('#rdZi').onclick=()=>{R.zoom=Math.min(4,+(R.zoom+.25).toFixed(2));draw(k)};$('#rdZf').onclick=()=>{R.zoom=1;draw(k)};
 document.querySelectorAll('[data-mode]').forEach(x=>x.onclick=()=>{R.mode=x.dataset.mode;document.querySelectorAll('[data-mode]').forEach(y=>y.setAttribute('aria-checked',y===x));$('#rdSw').hidden=R.mode!=='hl';$('#rdOv').dataset.mode=R.mode});
 document.querySelectorAll('[data-col]').forEach(x=>x.onclick=()=>{R.color=x.dataset.col;document.querySelectorAll('[data-col]').forEach(y=>y.setAttribute('aria-pressed',y===x))});
 document.querySelectorAll('[data-panel]').forEach(x=>x.onclick=()=>{R.panel=x.dataset.panel;document.querySelectorAll('[data-panel]').forEach(y=>y.setAttribute('aria-selected',y===x));panel(m,k)});
 $('#rdTab').onclick=()=>{R.panel='tabs';document.querySelectorAll('[data-panel]').forEach(y=>y.setAttribute('aria-selected',y.dataset.panel==='tabs'));panel(m,k,true)};
 $('#rdNoteB').onclick=()=>{R.panel='notes';document.querySelectorAll('[data-panel]').forEach(y=>y.setAttribute('aria-selected',y.dataset.panel==='notes'));panel(m,k,true)};
 $('#rdSearch').onsubmit=e=>{e.preventDefault();const q=$('#rdQ').value.trim();if(q.length<2){API.toast('Type at least 2 characters');return}runSearch(m,k,q)};
 // swipe to turn pages (only when not zoomed in and not drawing)
 const st=$('#rdStage');let sx=0,sy=0,t0=0;
 st.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;sx=e.touches[0].clientX;sy=e.touches[0].clientY;t0=Date.now()},{passive:true});
 st.addEventListener('touchend',e=>{if(R.mode!=='read'||R.zoom>1)return;const t=e.changedTouches[0];const dx=t.clientX-sx,dy=t.clientY-sy;if(Date.now()-t0<700&&Math.abs(dx)>60&&Math.abs(dy)<50)go(b.last+(dx<0?1:-1))},{passive:true});
 st.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();go(b.last+1)}if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go(b.last-1)}});
 overlay(k);strip(k);panel(m,k);draw(k);
 let rt;window.addEventListener('resize',function onr(){if(!document.getElementById('rdCv')){window.removeEventListener('resize',onr);return}clearTimeout(rt);rt=setTimeout(()=>draw(k),200)});
}

async function draw(k){const D=DOCS[k],b=A(k);const cv=$('#rdCv');if(!cv)return;const p=b.last;
 if(R.task){try{R.task.cancel()}catch(e){}R.task=null}
 const page=await D.doc.getPage(p);const st=$('#rdStage');const cw=Math.max(240,st.clientWidth-4);
 const v1=page.getViewport({scale:1});const vp=page.getViewport({scale:cw/v1.width*R.zoom});
 const dpr=Math.min(window.devicePixelRatio||1,2.5);cv.width=Math.floor(vp.width*dpr);cv.height=Math.floor(vp.height*dpr);cv.style.width=vp.width+'px';cv.style.height=vp.height+'px';
 const box=$('#rdBox');box.style.width=vp.width+'px';box.style.height=vp.height+'px';
 const ctx=cv.getContext('2d');R.task=page.render({canvasContext:ctx,viewport:vp,transform:dpr!==1?[dpr,0,0,dpr,0,0]:null});
 try{await R.task.promise}catch(e){if(e&&e.name==='RenderingCancelledException')return}
 R.task=null;cv.dataset.p=p;R.vp=vp;R.pg=page;
 const pr=printedOf(k,p);$('#rdPrinted').textContent=pr!=null?`printed page ${pr}`:'';
 paintHL(k);paintHits(k,page,vp);
 document.querySelectorAll('[data-goto]').forEach(x=>x.classList.toggle('on',+x.dataset.goto===p));
}

/* ---------- highlights ---------- */
function paintHL(k){const ov=$('#rdOv');if(!ov)return;const b=A(k),p=b.last;ov.querySelectorAll('.rd-hl').forEach(x=>x.remove());
 (b.hl[p]||[]).forEach((h,i)=>{const d=document.createElement('div');d.className='rd-hl';d.dataset.i=i;d.style.cssText=`left:${h.x*100}%;top:${h.y*100}%;width:${h.w*100}%;height:${h.h*100}%;background:${HEX[h.c]||HEX.y}`;ov.appendChild(d)})}
function overlay(k){const ov=$('#rdOv');ov.dataset.mode=R.mode;let s=null,box=null;
 const pos=e=>{const r=ov.getBoundingClientRect();return {x:Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)),y:Math.min(1,Math.max(0,(e.clientY-r.top)/r.height))}};
 ov.addEventListener('pointerdown',e=>{if(R.mode==='erase'){const t=e.target.closest('.rd-hl');if(t){const b=A(k);b.hl[b.last].splice(+t.dataset.i,1);if(!b.hl[b.last].length)delete b.hl[b.last];API.save();paintHL(k);panel(null,k)}return}
  if(R.mode!=='hl')return;e.preventDefault();ov.setPointerCapture(e.pointerId);s=pos(e);box=document.createElement('div');box.className='rd-hl draft';box.style.background=HEX[R.color];ov.appendChild(box)});
 ov.addEventListener('pointermove',e=>{if(!s||!box)return;const c=pos(e);const x=Math.min(s.x,c.x),y=Math.min(s.y,c.y),w=Math.abs(c.x-s.x),h=Math.abs(c.y-s.y);box.style.cssText+=`;left:${x*100}%;top:${y*100}%;width:${w*100}%;height:${h*100}%`});
 ov.addEventListener('pointerup',e=>{if(!s||!box)return;const c=pos(e);const x=Math.min(s.x,c.x),y=Math.min(s.y,c.y),w=Math.abs(c.x-s.x),h=Math.abs(c.y-s.y);box.remove();box=null;s=null;
  if(w<0.01&&h<0.004)return;const b=A(k);(b.hl[b.last]=b.hl[b.last]||[]).push({x:+x.toFixed(4),y:+y.toFixed(4),w:+w.toFixed(4),h:+Math.max(h,0.012).toFixed(4),c:R.color});API.save();paintHL(k);if(R.panel==='hl')panel(null,k)});
}

/* ---------- search ---------- */
async function pageText(k,p){const D=DOCS[k];if(D.text[p]!=null)return D.text[p];const pg=await D.doc.getPage(p);const tc=await pg.getTextContent();const t=tc.items.map(i=>i.str).join(' ').replace(/\s+/g,' ');D.text[p]=t;return t}
async function runSearch(m,k,q,jump){const D=DOCS[k];const N=D.doc.numPages;const my=++R.searching;R.hitQ=q;R.hits=[];const ql=q.toLowerCase();
 R.panel='find';document.querySelectorAll('[data-panel]').forEach(y=>y.setAttribute('aria-selected',y.dataset.panel==='find'));
 const stat=$('#rdSStat');let jumped=false;
 for(let p=1;p<=N;p++){if(my!==R.searching)return;let t='';try{t=await pageText(k,p)}catch(e){}
  const i=t.toLowerCase().indexOf(ql);if(i>=0){R.hits.push({p,s:t.slice(Math.max(0,i-60),i+q.length+70)});
   if(jump&&!jumped&&p>12){jumped=true;R.go(p)}}
  if(p%15===0||p===N){if(stat)stat.textContent=`Searching… ${p}/${N} · ${R.hits.length} pages`;panel(null,k);await new Promise(r=>setTimeout(r,0))}}
 if(stat)stat.textContent=`${R.hits.length} page${R.hits.length===1?' contains':'s contain'} “${q}”`;
 if(jump&&!jumped&&R.hits.length)R.go(R.hits[0].p);
 panel(null,k);draw(k)}
async function paintHits(k,page,vp){const ov=$('#rdOv');if(!ov)return;ov.querySelectorAll('.rd-hit').forEach(x=>x.remove());if(!R.hitQ)return;
 const ql=R.hitQ.toLowerCase();const first=(ql.split(/\s+/).find(w=>w.length>=3)||ql);let tc;try{tc=await page.getTextContent()}catch(e){return}
 const L=await lib();let any=false;const items=tc.items.filter(i=>i.str&&i.str.toLowerCase().includes(ql));const use=items.length?items:tc.items.filter(i=>i.str&&i.str.toLowerCase().includes(first));
 use.slice(0,40).forEach(it=>{const tx=L.Util.transform(vp.transform,it.transform);const fh=Math.hypot(tx[2],tx[3]);const d=document.createElement('div');d.className='rd-hit';
  d.style.cssText=`left:${tx[4]/vp.width*100}%;top:${(tx[5]-fh)/vp.height*100}%;width:${it.width*vp.scale/vp.width*100}%;height:${fh*1.15/vp.height*100}%`;ov.appendChild(d);any=true});}

/* ---------- tabs strip + side panel ---------- */
function strip(k){const b=A(k);const el=$('#rdStrip');if(!el)return;const t=b.tabs.slice().sort((x,y)=>x.p-y.p);
 el.innerHTML=t.length?t.map(x=>`<button class="rd-tabchip" data-goto="${x.p}" style="--c:${TABCOL[x.d]||TABCOL[0]}" title="PDF page ${x.p}">${esc(x.label)}</button>`).join(''):'<span class="muted small">No tabs yet. Tab the pages you use most, like a printed book.</span>';
 el.querySelectorAll('[data-goto]').forEach(x=>x.onclick=()=>R.go(+x.dataset.goto))}
function panel(m,k,focusNew){const el=$('#rdPanel');if(!el)return;const b=A(k);const p=b.last;const P=R.panel;
 if(P==='tabs'){const t=b.tabs.slice().sort((x,y)=>x.p-y.p);
  el.innerHTML=`<form class="stack" id="rdTabF"><label class="lbl" for="rdTabL">New tab on PDF page ${p}</label><input id="rdTabL" maxlength="40" placeholder="e.g. Table 1004.5 occupant load">
   <div class="row wrap"><select id="rdTabD" aria-label="Tab color">${[[1,'Blue · Permits'],[2,'Red · Life safety'],[3,'Amber · Structural'],[4,'Green · Envelope'],[0,'Gray · Other']].map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')}</select><button class="btn sm primary">Add tab</button></div></form>
   ${k==='ibc'?`<button class="btn sm" id="rdPlan">Add the recommended G11 tab plan (${(G.TABPLAN||[]).length} tabs)</button>`:`<button class="btn sm" id="rdPlanCm">Find and tab the key Concrete Manual chapters</button>`}
   <ul class="plain rd-list">${t.map(x=>`<li><button class="linkish" data-goto="${x.p}"><span class="dot" style="background:${TABCOL[x.d]||TABCOL[0]}"></span>${esc(x.label)} <span class="muted">· p. ${x.p}</span></button><button class="mini" data-deltab="${x.id}" aria-label="Delete tab ${esc(x.label)}">✕</button></li>`).join('')||'<li class="muted">No tabs yet.</li>'}</ul>`;
  $('#rdTabF').onsubmit=e=>{e.preventDefault();const l=$('#rdTabL').value.trim()||('Page '+p);b.tabs.push({id:'t'+Date.now(),p,label:l,d:+$('#rdTabD').value});API.save();strip(k);panel(m,k);API.toast('Tab added')};
  if(focusNew)$('#rdTabL').focus();
  const pl=$('#rdPlan');if(pl)pl.onclick=()=>{if(!b.offsetSet){API.toast('First set the page offset in Settings so printed pages line up');R.panel='set';panel(m,k);return}
   let n=0;(G.TABPLAN||[]).forEach(t=>{if(!t.page)return;const pp=pdfOf(k,+t.page);if(b.tabs.some(x=>x.label===t.label))return;b.tabs.push({id:'t'+Date.now()+n,p:pp,label:t.label,d:t.d});n++});API.save();strip(k);panel(m,k);API.toast(n+' tabs added')};
  const pc=$('#rdPlanCm');if(pc)pc.onclick=()=>autoTabCM(m,k);
 }
 else if(P==='hl'){const pages=Object.keys(b.hl).map(Number).sort((a,c)=>a-c);
  el.innerHTML=`<p class="muted small">Highlight mode: drag across a line or a table cell. Erase mode: tap a highlight to remove it.</p><div class="hlkey">${COLORS.map(c=>`<span class="hl ${c[0]}">${c[1]}</span> <span class="muted small">${c[2]}</span>`).join('<br>')}</div>
   <ul class="plain rd-list">${pages.map(x=>`<li><button class="linkish" data-goto="${x}">Page ${x}${printedOf(k,x)!=null?' (printed '+printedOf(k,x)+')':''} <span class="muted">· ${b.hl[x].length} mark${b.hl[x].length>1?'s':''}</span></button></li>`).join('')||'<li class="muted">No highlights yet.</li>'}</ul>`}
 else if(P==='notes'){const pages=Object.keys(b.notes).map(Number).sort((a,c)=>a-c);
  el.innerHTML=`<label class="lbl" for="rdNote">Note for PDF page ${p}</label><textarea id="rdNote" rows="4">${esc(b.notes[p]||'')}</textarea><div class="row"><button class="btn sm primary" id="rdNoteS">Save note</button></div>
   <ul class="plain rd-list">${pages.map(x=>`<li><button class="linkish" data-goto="${x}">p. ${x}: ${esc(b.notes[x].slice(0,60))}</button></li>`).join('')||'<li class="muted">No notes yet.</li>'}</ul>`;
  $('#rdNoteS').onclick=()=>{const v=$('#rdNote').value.trim();if(v)b.notes[p]=v;else delete b.notes[p];API.save();API.toast('Note saved');panel(m,k)};if(focusNew)$('#rdNote').focus()}
 else if(P==='find'){el.innerHTML=R.hits.length?`<ul class="plain rd-list">${R.hits.slice(0,300).map(h=>`<li><button class="linkish" data-goto="${h.p}"><b>p. ${h.p}</b>${printedOf(k,h.p)!=null?' (printed '+printedOf(k,h.p)+')':''}<br><span class="muted small">…${esc(h.s)}…</span></button></li>`).join('')}</ul>`:`<p class="muted">${R.hitQ?'No matches yet.':'Search for a section number, table number or keyword. Matches are boxed on the page.'}</p>`}
 else if(P==='set'){const f=API.S.books[k].file||{};
  el.innerHTML=`<div class="stack"><h3 class="h4">Printed page numbers</h3><p class="muted small">PDF page numbers usually differ from the printed page numbers in the book (cover, front matter). Go to any page that shows a printed page number, type that number here, and the app lines up every page reference from the questions.</p>
   <label class="lbl" for="rdOff">The PDF page on screen (${p}) is printed page</label><div class="row"><input id="rdOff" type="number" inputmode="numeric" value="${b.offsetSet?p-b.offset:''}"><button class="btn sm primary" id="rdOffS">Save</button></div>
   <p class="muted small">${b.offsetSet?`Offset saved: PDF page = printed page ${b.offset>=0?'+':'−'} ${Math.abs(b.offset)}.`:'Not set yet.'}</p>
   <label class="lbl" for="rdPr">Go to printed page</label><div class="row"><input id="rdPr" type="number" inputmode="numeric"><button class="btn sm" id="rdPrG">Go</button></div>
   <h3 class="h4">This file</h3><p class="small">${esc(f.name||DOCS[k].name||'PDF')} · ${DOCS[k].doc.numPages} pages${f.size?' · '+(f.size/1048576).toFixed(1)+' MB':''}</p>
   <div class="row wrap"><button class="btn sm" id="rdRep">Replace file</button><button class="btn sm bad" id="rdDel">Remove file from this device</button></div>
   <p class="muted small">Removing the file keeps your tabs, highlights and notes, so they come back if you add the same book again.</p></div>`;
  $('#rdOffS').onclick=()=>{const v=parseInt($('#rdOff').value,10);if(isNaN(v)){API.toast('Type the printed page number');return}b.offset=p-v;b.offsetSet=true;API.save();API.toast('Page numbers lined up');panel(m,k);draw(k)};
  $('#rdPrG').onclick=()=>{const v=parseInt($('#rdPr').value,10);if(isNaN(v))return;R.go(pdfOf(k,v))};
  $('#rdRep').onclick=()=>{$('#rdBody').innerHTML=picker(k,true);wirePicker(document.querySelector('#main'),k)};
  $('#rdDel').onclick=async()=>{await fdel(k);delete DOCS[k];API.toast('File removed from this device');render(document.querySelector('#main'))}}
 el.querySelectorAll('[data-goto]').forEach(x=>x.onclick=()=>R.go(+x.dataset.goto));
 el.querySelectorAll('[data-deltab]').forEach(x=>x.onclick=()=>{b.tabs=b.tabs.filter(t=>t.id!==x.dataset.deltab);API.save();strip(k);panel(m,k)});
}

async function autoTabCM(m,k){const D=DOCS[k],b=A(k),N=D.doc.numPages;const want=(G.CMTABS||[]);let n=0;API.toast('Looking for chapter starts…');
 for(const t of want){if(b.tabs.some(x=>x.label===t.label))continue;const ql=t.title.toLowerCase();
  for(let p=9;p<=N;p++){let s='';try{s=(await pageText(k,p)).toLowerCase()}catch(e){}
   if(s.slice(0,400).includes(ql)||s.includes('chapter '+t.ch+' '+ql)){b.tabs.push({id:'t'+Date.now()+n,p,label:t.label,d:3});n++;break}}}
 API.save();strip(k);panel(m,k);API.toast(n?n+' tabs added. Check each one.':'No chapter starts found. Add tabs by hand.')}
})();
