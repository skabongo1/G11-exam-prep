(function(){
'use strict';
const G=window.G11, $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const DOM={};G.EXAM.domains.forEach(d=>DOM[d.d]=d);
const DCOL={1:'var(--d1)',2:'var(--d2)',3:'var(--d3)',4:'var(--d4)',0:'var(--pd)'};
const QBY=Object.fromEntries(G.Q.map(q=>[q.id,q]));
const VER=G.Q.filter(q=>q.v);
const LBY=Object.fromEntries(G.LESSONS.map(l=>[l.id,l]));
const SBY=Object.fromEntries(G.SCENARIOS.map(s=>[s.id,s]));
const LKBY=Object.fromEntries(G.LOOKUPS.map(l=>[l.id,l]));
const L4='ABCD', SEC_PER_Q=160;
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pct=(c,n)=>n?Math.round(c/n*100):0;
const fmtT=s=>{s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return (h?h+':'+String(m).padStart(2,'0'):m)+':'+String(x).padStart(2,'0')};
const today=()=>{const d=new Date();return Math.floor((d.getTime()-d.getTimezoneOffset()*60000)/86400000)};
const dayStr=n=>new Date(n*86400000).toLocaleDateString(undefined,{timeZone:'UTC',weekday:'short',month:'short',day:'numeric'});
const dayFromISO=s=>{if(!s)return null;const t=Date.parse(s+'T00:00:00Z');return isNaN(t)?null:Math.floor(t/86400000)};

/* ---------------- state ---------------- */
const KEY='g11prep.v1';
const blank=()=>({v:1,created:Date.now(),theme:'system',profile:{onboarded:false,examDate:'',jur:'',ibc:'2018',cm:'',level:'',hours:10,days:[1,2,3,4,5]},
 diag:null,plan:null,lessons:{},att:{},book:[],missed:[],notes:{},lookups:[],scen:{},runs:[],run:null,lastUsed:{},cards:{},custom:[],log:[],pend:null,books:{},series:[],fx:true,examMark:true});
let S;
function load(){try{const r=localStorage.getItem(KEY);S=r?Object.assign(blank(),JSON.parse(r)):blank()}catch(e){S=blank()}}
let saveT=null;
function save(){clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Progress could not be saved in this browser. Use Export to keep a copy.')}},120)}
function log(kind,label,score){S.log.unshift({at:Date.now(),kind,label,score});S.log=S.log.slice(0,40);save()}

/* ---------------- theme ---------------- */
function applyTheme(){const r=document.documentElement;if(S.theme==='light'||S.theme==='dark')r.setAttribute('data-theme',S.theme);else r.removeAttribute('data-theme')}

/* ---------------- toast / live ---------------- */
function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(t._t);t._t=setTimeout(()=>t.hidden=true,3500)}
function say(m){$('#live').textContent=m}

/* ---------------- attempts & stats ---------------- */
function rec(qid,choice,mode,ms){const q=QBY[qid];if(!q)return;const ok=choice===q.a;(S.att[qid]=S.att[qid]||[]).push({at:Date.now(),c:choice,ok,ms:Math.round(ms||0),m:mode});
 if(!ok){if(!S.missed.includes(qid))S.missed.push(qid);addMissedCard(qid)}
 else if(mode==='review'){S.missed=S.missed.filter(x=>x!==qid)}
 save();return ok}
function stats(){const dom={1:[0,0],2:[0,0],3:[0,0],4:[0,0]},sub={};let fc=0,fn=0,rc=0,rn=0,ms=0,mn=0;
 Object.entries(S.att).forEach(([id,arr])=>{const q=QBY[id];if(!q||!q.v||!q.d)return;arr.forEach((a,i)=>{if(a.ms){ms+=a.ms;mn++}if(i===0){fn++;if(a.ok)fc++;dom[q.d][1]++;if(a.ok)dom[q.d][0]++;const k=q.d+'|'+q.s;sub[k]=sub[k]||[0,0];sub[k][1]++;if(a.ok)sub[k][0]++}else{rn++;if(a.ok)rc++}})});
 const lk=S.lookups.filter(x=>x.ok);const lkAvg=lk.length?lk.reduce((s,x)=>s+x.ms,0)/lk.length/1000:null;
 return {dom,sub,fc,fn,rc,rn,avg:mn?ms/mn/1000:null,lkAvg,lkN:S.lookups.length,lkOk:lk.length}}
function readiness(st){const n=st.fn;let cov=0,acc=0;Object.entries(st.dom).forEach(([d,v])=>{if(v[1]>=3){cov+=DOM[d].w;acc+=DOM[d].w*(v[0]/v[1])}});
 const domsCovered=Object.values(st.dom).filter(v=>v[1]>=3).length;
 if(n<20||domsCovered<3)return {ok:false,n,domsCovered};
 const p=acc/cov, m=1.96*Math.sqrt(p*(1-p)/n);return {ok:true,p,m,cov,n,domsCovered}}

/* ---------------- flashcards ---------------- */
const INTV=[0,1,3,7,14,30,60];
function allCards(){const base=G.CARDS.map((c,i)=>({id:'c'+i,deck:c[0],f:c[1],b:c[2]}));
 const miss=Object.keys(S.cards).filter(k=>k.startsWith('mq_')).map(k=>{const q=QBY[k.slice(3)];return q?{id:k,deck:'m',f:q.q,b:`${L4[q.a]}. ${q.o[q.a]} · ${q.r}${q.p?' p. '+q.p:''}`}:null}).filter(Boolean);
 const cus=S.custom.map(c=>({id:c.id,deck:'u',f:c.f,b:c.b}));return base.concat(miss,cus)}
function addMissedCard(qid){const k='mq_'+qid;if(!S.cards[k])S.cards[k]={box:0,due:today(),n:0}}
function dueCards(deck){const t=today();const all=allCards().filter(c=>!deck||deck==='all'||c.deck===deck);
 const due=all.filter(c=>S.cards[c.id]&&S.cards[c.id].due<=t);const nw=all.filter(c=>!S.cards[c.id]);return {due,nw,all}}
function grade(id,g){const t=today();const st=S.cards[id]||{box:0,due:t,n:0};
 if(g==='again'){st.box=0;st.due=t}else{st.box=Math.min(6,st.box+(g==='easy'?2:1));st.due=t+INTV[st.box]}st.n++;S.cards[id]=st;save()}

/* ---------------- study plan ---------------- */
const MOD_SCN={A:['S3','S4'],B:['S1','S2','S5']};
function genPlan(){const P=S.profile,t=today();let end=dayFromISO(P.examDate);if(!end||end<=t+3)end=t+56;
 const days=(P.days&&P.days.length?P.days:[1,2,3,4,5]);const mpd=Math.max(30,Math.round((+P.hours||10)*60/days.length));
 const weak={};[1,2,3,4].forEach(d=>{const v=S.diag&&S.diag.dom[d];weak[d]=v&&v[1]?1-v[0]/v[1]:0.5});
 const modOrder=(weak[2]>weak[1]?['B','A']:['A','B']).concat(G.MODULES.map(x=>x.id).filter(x=>x!=='A'&&x!=='B'));
 const queue=[];modOrder.forEach(m=>{G.LESSONS.filter(l=>l.mod===m).forEach(l=>{if(!(S.lessons[l.id]&&S.lessons[l.id].done))queue.push({type:'lesson',ref:l.id,label:'Lesson '+l.id+': '+l.title,mins:l.mins})});
  (MOD_SCN[m]||[]).forEach(s=>queue.push({type:'scn',ref:s,label:'Scenario: '+SBY[s].title,mins:20}))});
 const pr=[1,2,3,4].map(d=>({d,w:DOM[d].w*(0.5+weak[d])}));let prI=0;const prSeq=[];pr.forEach(x=>{for(let i=0;i<Math.round(x.w/8);i++)prSeq.push(x.d)});
 const out=[];let wk=0;
 for(let d=t;d<end;d++){const wd=new Date(d*86400000).getUTCDay();if(!days.includes(wd))continue;let left=mpd;const tasks=[];
  tasks.push({type:'cards',label:'Flashcard review',mins:10});left-=10;
  const daysLeft=end-d;
  if(daysLeft<=14&&wd===days[days.length-1]){tasks.push({type:'exam',ref:'40',label:'Mock exam (40 questions, timed)',mins:107});left-=107}
  while(left>=20&&queue.length){const q=queue[0];if(q.mins>left&&tasks.length>1)break;queue.shift();tasks.push(q);left-=q.mins}
  if(left>=15){tasks.push({type:'lookup',label:'Code lookup drill (5 lookups)',mins:15});left-=15}
  while(left>=20){const dd=prSeq[prI++%prSeq.length];tasks.push({type:'practice',ref:String(dd),label:'Practice: '+DOM[dd].name+' (10 questions)',mins:20});left-=20}
  if(wd===days[0]&&daysLeft>14&&out.length>3){tasks.push({type:'quiz',label:'Timed quiz (20 questions)',mins:53})}
  out.push({day:d,tasks:tasks.map((x,i)=>Object.assign({id:d+'_'+i,done:false},x))})}
 S.plan={at:Date.now(),end,mpd,days:out};save()}
function todayPlan(){if(!S.plan)return null;const t=today();return S.plan.days.find(x=>x.day===t)||null}
function nextPlanDay(){if(!S.plan)return null;const t=today();return S.plan.days.find(x=>x.day>=t&&x.tasks.some(k=>!k.done))||null}
function autoDone(type,ref){const d=todayPlan()||nextPlanDay();if(!d)return;const k=d.tasks.find(x=>!x.done&&x.type===type&&(ref==null||x.ref==null||x.ref===String(ref)));if(k){k.done=true;save()}}
function taskHref(k){return k.type==='lesson'?'#lesson-'+k.ref:k.type==='scn'?'#scn-'+k.ref:k.type==='practice'?'#practice':k.type==='quiz'?'#practice':k.type==='exam'?'#exam':k.type==='cards'?'#cards':'#lookup'}
function goTask(k){S.pend={type:k.type,ref:k.ref||null};save();location.hash=taskHref(k).slice(1);route()}

/* ---------------- question card ---------------- */
function qMeta(q){return `<div class="qmeta"><span class="pill" style="--c:${DCOL[q.d]}">${esc(DOM[q.d]?DOM[q.d].name:'')}</span><span class="pill plain">${esc(q.s)}</span><span class="pill plain">${['','Basic','Intermediate','Advanced'][q.df]}</span><span class="pill plain">${q.b==='CM'?'Concrete Manual':q.b==='MATH'?'Calculation':'2018 IBC'}</span>${q.v?'<span class="pill ok">Verified</span>':'<span class="pill warn">Demonstration · pending verification</span>'}</div>`}
function feedback(q,sel){const ok=sel===q.a;return `<div class="fb ${ok?'good':'bad'}" role="status"><b>${ok?'Correct.':sel==null||sel<0?'Not answered. Answer: '+L4[q.a]+'.':'Not quite. Answer: '+L4[q.a]+'.'}</b><p>${esc(q.ex)}</p>
 <details ${ok?'':'open'}><summary>Why each option is right or wrong</summary><ul>${q.o.map((o,j)=>`<li><b>${L4[j]}.</b> ${j===q.a?'Correct. ':''}${esc(q.w[j]||q.ex)}</li>`).join('')}</ul></details>
 <p class="ref"><b>Reference:</b> ${esc(q.r)}${q.p?' · page '+q.p:''} · <b>How to find it:</b> ${esc(q.f)}</p>${q.b==='IBC'||q.b==='CM'?`<div class="row"><button class="mini" data-openq="${q.id}">📖 Open in my ${q.b==='CM'?'Concrete Manual':'IBC'}</button></div>`:''}</div>`}
function findKey(q){const r=q.r.replace(/^Concrete Manual\s*/,'');let m=r.match(/Table\s+[\d.]+/);if(m)return m[0];m=r.match(/^(\d+\.\d+)/);if(m)return m[1];m=r.match(/Ch\.\s*(\d+)/);if(m&&q.ch)return '';return q.f.split('→')[1]?q.f.split('→')[1].split(',').pop().trim():''}
function openQ(q){if(q.b==='CM'){const k=findKey(q);const t=(q.f.match(/Chapter \d+, ([^→]+)/)||[])[1];G.READER.open('cm',{find:k||(t?t.trim():'')})}else G.READER.open('ibc',{printed:q.p?+q.p:null,ref:(q.r.match(/(?:Table\s+[\d.]+|§\s*[\d.]+)/)||[q.r])[0]})}
function celebrate(scope,qid,o){const q=QBY[qid];if(!q||!scope)return;window.G11FX.off=S.fx===false;const card=scope.querySelector(`.q[data-q="${qid}"]`)||scope;const b=card.querySelector(`.opt[data-o="${o}"]`);if(o===q.a)window.G11FX.right(b);else{window.G11FX.wrong(b);const ok=card.querySelector(`.opt[data-o="${q.a}"]`);if(ok)ok.classList.add('fx-reveal')}}
function qCard(q,i,sel,o){o=o||{};const show=(o.fb||o.mark)&&sel!=null;const bk=S.book.includes(q.id);
 return `<article class="q" data-q="${q.id}"><header class="qh"><span class="qn">Q${i+1}${o.total?' of '+o.total:''}</span>${qMeta(q)}</header><p class="qt">${esc(q.q)}</p>
 <div class="opts" role="group" aria-label="Answer options">${q.o.map((t,j)=>{let c='';if(show){if(j===q.a)c='right';else if(j===sel)c='wrong'}else if(sel===j)c='sel';
  return `<button class="opt ${c}" data-o="${j}" ${show?'disabled':''} aria-pressed="${sel===j}"><span class="lt">${L4[j]}</span><span>${esc(t)}</span></button>`}).join('')}</div>
 ${show&&o.fb?feedback(q,sel):''}
 <div class="qtools"><button class="mini" data-bk="${q.id}" aria-pressed="${bk}">${bk?'★ Bookmarked':'☆ Bookmark'}</button>${o.notes!==false?`<button class="mini" data-note="q:${q.id}">${S.notes['q:'+q.id]?'✎ Edit note':'✎ Add note'}</button>`:''}</div>
 <div class="notebox" data-nb="q:${q.id}" hidden></div></article>`}
document.addEventListener('click',e=>{const oq=e.target.closest('[data-openq]');if(oq){const q=QBY[oq.dataset.openq];if(q)openQ(q);return}
 const b=e.target.closest('[data-bk]');if(b){const id=b.dataset.bk;S.book=S.book.includes(id)?S.book.filter(x=>x!==id):[...S.book,id];save();b.setAttribute('aria-pressed',S.book.includes(id));b.textContent=S.book.includes(id)?'★ Bookmarked':'☆ Bookmark';say(S.book.includes(id)?'Bookmarked':'Bookmark removed');return}
 const n=e.target.closest('[data-note]');if(n){const k=n.dataset.note;const box=document.querySelector(`[data-nb="${CSS.escape(k)}"]`);if(!box)return;box.hidden=!box.hidden;if(!box.hidden){box.innerHTML=`<label class="lbl" for="nt_${k.replace(/\W/g,'_')}">Your note</label><textarea id="nt_${k.replace(/\W/g,'_')}" rows="3">${esc(S.notes[k]||'')}</textarea><div class="row"><button class="btn sm" data-ns="${k}">Save note</button></div>`;box.querySelector('textarea').focus()}return}
 const ns=e.target.closest('[data-ns]');if(ns){const k=ns.dataset.ns;const v=ns.closest('.notebox').querySelector('textarea').value.trim();if(v)S.notes[k]=v;else delete S.notes[k];save();toast('Note saved');ns.closest('.notebox').hidden=true}});

/* ---------------- routing ---------------- */
const NAV=[['home','Dashboard'],['plan','Study plan'],['learn','Course'],['practice','Practice'],['scenarios','Scenarios'],['lookup','Lookup trainer'],['reader','My code books'],['guides','Book guides'],['exam','Practice exams'],['cards','Flashcards'],['info','Exam info'],['data','Data & settings']];
let timer=null;
function route(){clearInterval(timer);timer=null;const h=(location.hash||'#home').slice(1)||'home';const main=$('#main');
 const base=h.split('-')[0];$$('#nav a').forEach(a=>a.setAttribute('aria-current',a.dataset.r===base||(base==='lesson'&&a.dataset.r==='learn')||(base==='scn'&&a.dataset.r==='scenarios')||(base==='diagnostic'&&a.dataset.r==='home')||(base==='start'&&a.dataset.r==='home')||(base==='local'&&a.dataset.r==='info')||(base==='rules'&&a.dataset.r==='learn')?'page':'false'));
 const V={home:vHome,start:vStart,diagnostic:vDiag,plan:vPlan,learn:vLearn,practice:vPractice,scenarios:vScenarios,lookup:vLookup,exam:vExam,cards:vCards,info:vInfo,local:vLocal,data:vData,reader:m=>G.READER.view(m,API),guides:m=>G.GUIDES.view(m,API),rules:vRules};
 if(h.startsWith('lesson-')&&LBY[h.slice(7)])vLesson(main,h.slice(7));else if(h.startsWith('scn-')&&SBY[h.slice(4)])vScn(main,h.slice(4));else (V[h]||vHome)(main);
 main.focus({preventScroll:true});window.scrollTo(0,0)}
window.addEventListener('hashchange',route);
function go(r){if(location.hash==='#'+r)route();else location.hash=r}

/* ================= views ================= */
function head(t,sub,right){return `<div class="vh"><div><h1>${t}</h1>${sub?`<p class="sub">${sub}</p>`:''}</div>${right||''}</div>`}
function bar(p,col){return `<span class="bar" aria-hidden="true"><i style="width:${Math.max(0,Math.min(100,p))}%;background:${col||'var(--d1)'}"></i></span>`}

/* ---------- Dashboard ---------- */
function vHome(m){const st=stats(),rd=readiness(st),P=S.profile;const tp=todayPlan(),np=nextPlanDay();const tasks=(tp||np);
 const next=tasks&&tasks.tasks.find(k=>!k.done);const lessonsDone=G.LESSONS.filter(l=>S.lessons[l.id]&&S.lessons[l.id].done).length;
 const {due,nw}=dueCards('all');const exd=dayFromISO(P.examDate);const dl=exd?exd-today():null;
 const weakSubs=Object.entries(st.sub).filter(([k,v])=>v[1]>=2).map(([k,v])=>({k,p:v[0]/v[1],n:v[1]})).sort((a,b)=>a.p-b.p).slice(0,4);
 m.innerHTML=`${!P.onboarded?`<section class="hero card"><h2>Set up your study plan</h2><p>Tell me your exam date, jurisdiction, books and study time. A 12-question diagnostic then shapes a daily plan around the official exam weights.</p><div class="row"><a class="btn primary big" href="#start">Start setup</a><a class="btn" href="#learn">Browse the course first</a></div></section>`:''}
 ${head('Dashboard',P.onboarded?`${esc(P.jur||'Jurisdiction not set')} · ${dl!=null?(dl>=0?dl+' days to exam':'Exam date passed'):'No exam date'} · ${P.hours} h/week`:'Independent G11 exam preparation')}
 <section class="grid2">
  <div class="card stack"><h2>Today</h2>${tasks?`<p class="muted">${tp?'Today, '+dayStr(tp.day):'Next study day: '+dayStr(np.day)}</p><ul class="tasks">${tasks.tasks.map(k=>`<li class="${k.done?'done':''}"><input type="checkbox" id="tk_${k.id}" data-tk="${k.id}" ${k.done?'checked':''}><label for="tk_${k.id}">${esc(k.label)} <span class="muted">· ${k.mins} min</span></label><button class="mini" data-go="${k.id}">Open</button></li>`).join('')}</ul>`:`<p class="muted">No plan yet. Set up your plan to get daily tasks.</p>`}
   <button class="btn primary big" id="cont">Continue studying${next?': '+esc(next.label):''}</button></div>
  <div class="card stack"><h2>Readiness estimate</h2>${rd.ok?`<div class="big">${Math.round(rd.p*100)}% <small>± ${Math.round(rd.m*100)}</small></div><p class="muted">Weighted first-attempt accuracy on ${rd.n} verified questions, covering ${rd.cov}% of the exam weight. The reported pass line is 70%; this course targets 85% for confidence.</p>${bar(rd.p*100,rd.p>=.85?'var(--ok)':rd.p>=.7?'var(--warn)':'var(--bad)')}`:`<div class="big muted">Not enough data</div><p class="muted">Answer at least 20 verified questions across 3 or more exam topics (you have ${rd.n} across ${rd.domsCovered}).</p>`}
   <p class="fine">This is a practice-based estimate, not a prediction or guarantee of your exam result. Lookup speed and timed exam performance also matter.</p></div>
 </section>
 <section class="tiles">
  <div class="tile"><span class="lab">Course progress</span><span class="val">${lessonsDone}/${G.LESSONS.length}</span><span class="muted">lessons complete</span></div>
  <div class="tile"><span class="lab">Due for review</span><span class="val">${due.length+S.missed.length}</span><span class="muted">${due.length} cards · ${S.missed.length} missed questions</span></div>
  <div class="tile"><span class="lab">Avg answer time</span><span class="val">${st.avg!=null?Math.round(st.avg)+' s':'—'}</span><span class="muted">Exam pace: 160 s</span></div>
  <div class="tile"><span class="lab">Avg lookup time</span><span class="val">${st.lkAvg!=null?Math.round(st.lkAvg)+' s':'—'}</span><span class="muted">${st.lkOk}/${st.lkN} lookups correct</span></div>
 </section>
 <section class="grid2">
  <div class="card stack"><h2>Performance by exam topic</h2><p class="muted">First-attempt accuracy on verified questions. Repeat attempts: ${st.rn?pct(st.rc,st.rn)+'% of '+st.rn:'none yet'}.</p>
   ${[1,2,3,4].map(d=>{const v=st.dom[d];return `<div class="dbar"><span><b style="color:${DCOL[d]}">${DOM[d].name}</b> <span class="muted">${DOM[d].w}%</span></span>${bar(v[1]?pct(v[0],v[1]):0,DCOL[d])}<b class="num">${v[1]?pct(v[0],v[1])+'%':'—'} <span class="muted">${v[0]}/${v[1]}</span></b></div>`}).join('')}</div>
  <div class="card stack"><h2>Weak areas</h2>${weakSubs.length?`<ul class="plain">${weakSubs.map(w=>{const [d,s]=w.k.split('|');return `<li><b>${esc(s)}</b> <span class="muted">(${DOM[d].name})</span> · ${Math.round(w.p*100)}% of ${w.n}</li>`}).join('')}</ul><div class="row"><a class="btn" href="#practice">Practice weak areas</a><a class="btn" href="#cards">Review cards</a></div>`:'<p class="muted">Answer a few questions in each topic to see weak areas.</p>'}
   <h3>Recent results</h3>${S.log.length?`<ul class="plain">${S.log.slice(0,6).map(l=>`<li>${new Date(l.at).toLocaleDateString()} · ${esc(l.label)}${l.score!=null?' · <b>'+l.score+'%</b>':''}</li>`).join('')}</ul>`:'<p class="muted">Nothing yet.</p>'}</div>
 </section>`;
 m.querySelectorAll('[data-tk]').forEach(c=>c.addEventListener('change',()=>{const d=tasks;const k=d.tasks.find(x=>x.id===c.dataset.tk);k.done=c.checked;save();vHome(m)}));
 m.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{const k=tasks.tasks.find(x=>x.id===b.dataset.go);goTask(k)}));
 $('#cont').addEventListener('click',()=>{if(next)goTask(next);else{const l=G.LESSONS.find(l=>!(S.lessons[l.id]&&S.lessons[l.id].done));go(l?'lesson-'+l.id:'practice')}})}

/* ---------- Onboarding ---------- */
function vStart(m){const P=S.profile;const D=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
 m.innerHTML=`${head('Set up your plan','About two minutes. You can change any of this later.')}
 <form class="card stack" id="ob" novalidate>
  <div class="grid2">
   <div class="field"><label for="obDate">Exam date</label><input id="obDate" type="date" value="${esc(P.examDate)}"><small>Leave blank if not booked; the plan assumes 8 weeks.</small></div>
   <div class="field"><label for="obJur">Jurisdiction where you'll be licensed</label><select id="obJur">${['','Pikes Peak Regional (Colorado Springs)','Larimer County','Jefferson County / Aurora','Denver','Wheat Ridge','Other Colorado jurisdiction','Outside Colorado'].map(j=>`<option ${P.jur===j?'selected':''} value="${esc(j)}">${j||'Choose…'}</option>`).join('')}</select><small id="obJurNote"></small></div>
   <div class="field"><label for="obIbc">Building code book you have</label><select id="obIbc">${[['2018','2018 IBC (approved for G11)'],['2015','2015 IBC'],['2021','2021 IBC'],['2024','2024 IBC'],['none','Not yet']].map(o=>`<option value="${o[0]}" ${P.ibc===o[0]?'selected':''}>${o[1]}</option>`).join('')}</select><small id="obIbcNote"></small></div>
   <div class="field"><label for="obCm">Concrete Manual edition</label><select id="obCm">${[['','Choose…'],['2021','Based on 2021 IBC & ACI 318-19 (approved)'],['2015','Based on 2015 IBC & ACI 318-14 (approved)'],['2012','Based on 2012 IBC & ACI 318-11'],['none','Not yet']].map(o=>`<option value="${o[0]}" ${P.cm===o[0]?'selected':''}>${o[1]}</option>`).join('')}</select><small id="obCmNote"></small></div>
   <div class="field"><label for="obLvl">Experience level</label><select id="obLvl">${[['','Choose…'],['new','New to construction'],['tech','Technical/engineering background, little field work'],['field','Several years in the field'],['pro','Experienced contractor']].map(o=>`<option value="${o[0]}" ${P.level===o[0]?'selected':''}>${o[1]}</option>`).join('')}</select></div>
   <div class="field"><label for="obHrs">Study hours per week</label><input id="obHrs" type="number" min="2" max="40" step="1" value="${+P.hours||10}"></div>
  </div>
  <fieldset class="days"><legend>Study days</legend>${D.map((d,i)=>`<label class="chk"><input type="checkbox" value="${i}" ${P.days.includes(i)?'checked':''}> ${d}</label>`).join('')}</fieldset>
  <p class="err" id="obErr" hidden></p>
  <div class="row"><button class="btn primary big" type="submit">Save and take the diagnostic</button><button class="btn" type="button" id="obSkip">Save and skip the diagnostic</button></div>
 </form>`;
 const notes=()=>{const j=$('#obJur').value;$('#obJurNote').textContent=j==='Denver'?'ICC\'s Denver bulletin lists F11 (2015 IBC), not G11. Confirm with Denver before you study.':j==='Wheat Ridge'?'Wheat Ridge asks for a 2021 or 2024 Class A test. Call to confirm G11 is accepted.':j?'Confirm with the jurisdiction that it accepts G11.':'';
  const b=$('#obIbc').value;$('#obIbcNote').textContent=b==='2018'?'':'G11 uses the 2018 IBC. Page references in this course match the 2018 first printing.';
  const c=$('#obCm').value;$('#obCmNote').textContent=c==='2012'?'Not on ICC\'s approved list for G11.':''};
 ['obJur','obIbc','obCm'].forEach(i=>$('#'+i).addEventListener('change',notes));notes();
 const commit=()=>{const days=[...m.querySelectorAll('.days input:checked')].map(x=>+x.value);const hrs=+$('#obHrs').value;
  if(!days.length||!(hrs>=2)){const e=$('#obErr');e.hidden=false;e.textContent=!days.length?'Pick at least one study day.':'Enter at least 2 hours per week.';return false}
  Object.assign(S.profile,{examDate:$('#obDate').value,jur:$('#obJur').value,ibc:$('#obIbc').value,cm:$('#obCm').value,level:$('#obLvl').value,hours:hrs,days,onboarded:true});save();return true};
 $('#ob').addEventListener('submit',e=>{e.preventDefault();if(commit())go('diagnostic')});
 $('#obSkip').addEventListener('click',()=>{if(commit()){genPlan();toast('Plan created');go('plan')}})}

/* ---------- Run engine (diagnostic, timed quiz, exam) ---------- */
function drawWeighted(n,pool){const per={};let tot=0;[1,2,3,4].forEach(d=>{per[d]=Math.max(d===4?1:0,Math.round(n*DOM[d].w/100));tot+=per[d]});per[3]+=n-tot;
 const out=[],used=new Set();const recent=q=>S.lastUsed[q.id]||0;
 [1,2,3,4].forEach(d=>{const c=pool.filter(q=>q.d===d);const srt=shuffle(c).sort((a,b)=>recent(a)-recent(b));srt.slice(0,per[d]).forEach(q=>{out.push(q.id);used.add(q.id)})});
 if(out.length<n)shuffle(pool.filter(q=>!used.has(q.id))).sort((a,b)=>recent(a)-recent(b)).slice(0,n-out.length).forEach(q=>out.push(q.id));
 return shuffle(out)}
function startRun(kind,qids,secs,label){S.run={kind,label,qids,ans:{},flags:[],start:Date.now(),dur:secs||null,cur:0,tpq:{},enter:Date.now()};save()}
function runView(m,backHref){const R=S.run;if(!R)return;R.enter=Date.now();const q=QBY[R.qids[R.cur]];const fl=R.flags.includes(R.cur);const un=R.qids.length-Object.keys(R.ans).length;
 m.innerHTML=`<div class="runbar" role="region" aria-label="${esc(R.label)} controls"><span><b>${esc(R.label)}</b> · ${R.cur+1}/${R.qids.length} · ${R.qids.length-un} answered</span>${R.dur?`<span class="clock" id="clk" aria-live="off"></span>`:''}<span class="row"><a class="btn sm inv" href="#reader" title="Look it up in your books; the clock keeps running">📖 Books</a><button class="btn sm inv" id="rFlag" aria-pressed="${fl}">${fl?'Unflag':'Flag'} (F)</button><button class="btn sm inv" id="rEnd">Submit</button></span></div>
 <div id="rConf"></div>${qCard(q,R.cur,R.ans[R.cur],{fb:false,mark:S.examMark!==false,total:R.qids.length,notes:false})}
 <div class="row between"><button class="btn" id="rPrev" ${R.cur===0?'disabled':''}>← Previous (P)</button><button class="btn" id="rNF">Next flagged</button><button class="btn primary" id="rNext" ${R.cur===R.qids.length-1?'disabled':''}>Next (N) →</button></div>
 <div class="card stack"><h2 class="h3">Question navigator</h2><div class="qgrid">${R.qids.map((id,i)=>`<button class="qg ${R.ans[i]!=null?'ans':''} ${R.flags.includes(i)?'flag':''} ${i===R.cur?'cur':''}" data-g="${i}" aria-label="Question ${i+1}${R.ans[i]!=null?', answered':', unanswered'}${R.flags.includes(i)?', flagged':''}">${i+1}</button>`).join('')}</div><p class="fine">Blue: answered · red dot: flagged · outline: current. Keys 1–4 or A–D choose an answer. ${S.examMark!==false?'Right and wrong show as you answer; the explanations come after you submit. Turn this off in Data &amp; settings for a realistic final rehearsal.':'Answers stay hidden until you submit.'}</p></div>`;
 m.querySelector('.opts').addEventListener('click',e=>{const b=e.target.closest('.opt');if(!b||b.disabled)return;const o=+b.dataset.o;R.ans[R.cur]=o;save();const qid=R.qids[R.cur];rgo(m,backHref,R.cur);if(S.examMark!==false)celebrate(m,qid,o)});
 $('#rPrev').onclick=()=>rgo(m,backHref,R.cur-1);$('#rNext').onclick=()=>rgo(m,backHref,R.cur+1);
 $('#rNF').onclick=()=>{const f=R.flags.filter(i=>i>R.cur).concat(R.flags.filter(i=>i<=R.cur))[0];if(f!=null)rgo(m,backHref,f);else toast('No flagged questions')};
 $('#rFlag').onclick=()=>{R.flags=fl?R.flags.filter(i=>i!==R.cur):[...R.flags,R.cur];save();rgo(m,backHref,R.cur)};
 m.querySelector('.qgrid').onclick=e=>{const b=e.target.closest('.qg');if(b)rgo(m,backHref,+b.dataset.g)};
 $('#rEnd').onclick=()=>{const miss=R.qids.map((_,i)=>i).filter(i=>R.ans[i]==null);
  $('#rConf').innerHTML=`<div class="confirm" role="alertdialog" aria-label="Confirm submit"><b>Submit now?</b>${miss.length?`<p><b>${miss.length} unanswered:</b> ${miss.map(i=>`<button class="mini" data-jump="${i}">Q${i+1}</button>`).join(' ')}. Unanswered questions score as wrong.</p>`:'<p>All questions answered.</p>'}${R.flags.length?`<p>${R.flags.length} flagged for review.</p>`:''}<div class="row"><button class="btn primary" id="rYes">Submit and score</button><button class="btn" id="rNo">Keep working</button></div></div>`;
  $('#rYes').onclick=()=>finishRun(m,backHref);$('#rNo').onclick=()=>$('#rConf').innerHTML='';$$('[data-jump]').forEach(b=>b.onclick=()=>rgo(m,backHref,+b.dataset.jump));$('#rYes').focus()};
 if(R.dur){const tick=()=>{const left=R.dur-(Date.now()-R.start)/1000;const c=$('#clk');if(c){c.textContent=fmtT(left)+' left';c.classList.toggle('low',left<300)}if(left<=0){clearInterval(timer);toast('Time is up. Submitted.');finishRun(m,backHref)}};tick();clearInterval(timer);timer=setInterval(tick,1000)}}
function rgo(m,b,i){const R=S.run;const now=Date.now();R.tpq[R.cur]=(R.tpq[R.cur]||0)+(now-R.enter);R.enter=now;R.cur=Math.max(0,Math.min(R.qids.length-1,i));save();runView(m,b)}
document.addEventListener('keydown',e=>{if(!S||!S.run||S.run.done||e.target.closest('input,textarea,select'))return;if(!document.querySelector('.runbar'))return;const k=e.key.toLowerCase();const m=$('#main');
 const idx='1234'.indexOf(k)>=0?'1234'.indexOf(k):'abcd'.indexOf(k);if(idx>=0&&k.length===1){const b=m.querySelector(`.opt[data-o="${idx}"]`);if(b){e.preventDefault();b.click()}}
 else if(k==='n'){e.preventDefault();$('#rNext')&&!$('#rNext').disabled&&$('#rNext').click()}else if(k==='p'){e.preventDefault();$('#rPrev')&&!$('#rPrev').disabled&&$('#rPrev').click()}else if(k==='f'){e.preventDefault();$('#rFlag')&&$('#rFlag').click()}});
function finishRun(m,backHref){const R=S.run;if(!R||R.done)return;clearInterval(timer);const now=Date.now();R.tpq[R.cur]=(R.tpq[R.cur]||0)+(now-R.enter);
 let c=0;const dom={1:[0,0],2:[0,0],3:[0,0],4:[0,0]};R.qids.forEach((id,i)=>{const q=QBY[id];dom[q.d][1]++;const a=R.ans[i];if(a!=null){if(rec(id,a,R.kind,R.tpq[i]))c++,dom[q.d][0]++}S.lastUsed[id]=now});
 const secs=Math.round(Math.min(R.dur||1e9,(now-R.start)/1000));R.done=true;R.res={c,n:R.qids.length,p:pct(c,R.qids.length),dom,secs};
 if(R.kind==='diag'){S.diag={at:now,dom};}
 S.runs.unshift({at:now,kind:R.kind,label:R.label,ser:R.ser||null,c,n:R.qids.length,p:R.res.p,secs,dom});S.runs=S.runs.slice(0,30);
 log(R.kind,R.label,R.res.p);if(R.kind==='exam')autoDone('exam');if(R.kind==='quiz')autoDone('quiz');save();resultView(m,backHref,'all')}
function followUp(dom){const weak=Object.entries(dom).filter(([d,v])=>v[1]).map(([d,v])=>({d:+d,p:v[0]/v[1]})).sort((a,b)=>a.p-b.p).slice(0,2);
 return weak.map(w=>{const ls=G.LESSONS.filter(l=>G.MODULES.find(x=>x.id===l.mod).d===w.d);const sc=G.SCENARIOS.filter(s=>s.d===w.d);const lk=G.LOOKUPS.filter(l=>l.d===w.d).slice(0,3);
  return {d:w.d,p:w.p,ls,sc,lk}})}
function resultView(m,backHref,filter){const R=S.run;const r=R.res;const v=r.p>=85?['On target','var(--ok)']:r.p>=70?['Above the reported 70% line','var(--warn)']:['Below the reported 70% line','var(--bad)'];
 const fu=followUp(r.dom);const idx=R.qids.map((_,i)=>i).filter(i=>filter==='all'||(filter==='wrong'&&R.ans[i]!==QBY[R.qids[i]].a)||(filter==='flag'&&R.flags.includes(i)));
 m.innerHTML=`${head(esc(R.label)+': results',`${r.c} of ${r.n} correct · ${fmtT(r.secs)} used · ${Math.round(r.secs/r.n)} s per question (exam pace 160 s)`)}
 <section class="grid2"><div class="card stack"><div class="big" style="color:${v[1]}">${r.p}%</div><b style="color:${v[1]}">${v[0]}</b><p class="fine">${R.kind==='diag'?'Diagnostic results shape your study plan.':'Practice result only. Not a prediction of your exam score.'}</p>
  <div class="row">${R.kind==='diag'?'<button class="btn primary big" id="mkPlan">Build my study plan</button>':`<button class="btn primary" id="again">New ${R.kind==='exam'?'exam':'quiz'}</button>`}<button class="btn" id="done">Back</button></div></div>
 <div class="card stack"><h2>By exam topic</h2>${[1,2,3,4].filter(d=>r.dom[d][1]).map(d=>{const x=r.dom[d];return `<div class="dbar"><span><b style="color:${DCOL[d]}">${DOM[d].name}</b></span>${bar(pct(x[0],x[1]),DCOL[d])}<b class="num">${pct(x[0],x[1])}% <span class="muted">${x[0]}/${x[1]}</span></b></div>`}).join('')}</div></section>
 ${R.kind!=='diag'&&fu.length?`<section class="card stack"><h2>Targeted follow-up plan</h2>${fu.map(f=>`<div><h3 style="color:${DCOL[f.d]}">${DOM[f.d].name} · ${Math.round(f.p*100)}%</h3><ul class="plain">${f.ls.length?`<li>Lessons: ${f.ls.map(l=>`<a href="#lesson-${l.id}">${l.id} ${esc(l.title)}</a>`).join(', ')}</li>`:'<li>Lessons for this topic are not built yet; use practice questions and the IBC guide.</li>'}${f.sc.length?`<li>Scenarios: ${f.sc.map(s=>`<a href="#scn-${s.id}">${esc(s.title)}</a>`).join(', ')}</li>`:''}<li>Lookups: ${f.lk.map(l=>esc(l.prompt)).join('; ')}</li><li>Practice: 10 questions in this topic</li></ul></div>`).join('')}<div class="row"><button class="btn" id="addFU">Add follow-up to my plan</button></div></section>`:''}
 <section class="card stack"><div class="vh"><h2>Review answers</h2><div class="row" role="group" aria-label="Filter"><button class="btn sm" data-f="all" aria-pressed="${filter==='all'}">All</button><button class="btn sm" data-f="wrong" aria-pressed="${filter==='wrong'}">Wrong</button><button class="btn sm" data-f="flag" aria-pressed="${filter==='flag'}">Flagged</button></div></div>
 <div class="quiz">${idx.length?idx.map(i=>qCard(QBY[R.qids[i]],i,R.ans[i]!=null?R.ans[i]:-1,{fb:true,total:R.qids.length})).join(''):'<p class="muted">Nothing for this filter.</p>'}</div></section>`;
 m.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>resultView(m,backHref,b.dataset.f));
 const clear=()=>{S.run=null;save()};
 const mk=$('#mkPlan');if(mk)mk.onclick=()=>{clear();genPlan();toast('Study plan created');go('plan')};
 const ag=$('#again');if(ag)ag.onclick=()=>{clear();go(backHref)};
 $('#done').onclick=()=>{clear();go(R.kind==='diag'?'home':backHref)};
 const af=$('#addFU');if(af)af.onclick=()=>{if(!S.plan)genPlan();const days=S.plan.days.filter(d=>d.day>=today()).slice(0,3);fu.forEach((f,i)=>{const d=days[i%Math.max(1,days.length)];if(!d)return;d.tasks.push({id:d.day+'_f'+Date.now()+i,type:'practice',ref:String(f.d),label:'Follow-up practice: '+DOM[f.d].name,mins:20,done:false});if(f.ls[0])d.tasks.push({id:d.day+'_fl'+Date.now()+i,type:'lesson',ref:f.ls[0].id,label:'Review lesson '+f.ls[0].id,mins:30,done:false})});save();toast('Follow-up tasks added to your plan')}}

/* ---------- Diagnostic ---------- */
function vDiag(m){if(S.run&&S.run.kind==='diag'){if(S.run.done)return resultView(m,'home','all');return runView(m,'home')}
 m.innerHTML=`${head('Diagnostic quiz','12 verified questions weighted like the exam. No feedback until the end. Untimed, but your answer time is recorded.')}
 <div class="card stack"><p>Use your book if you want; the point is to find where to start. ${S.diag?`You took it on ${new Date(S.diag.at).toLocaleDateString()}; retaking replaces those results.`:''}</p><div class="row"><button class="btn primary big" id="dgo">Start diagnostic</button><a class="btn" href="#home">Not now</a></div></div>`;
 $('#dgo').onclick=()=>{const per={1:3,2:4,3:4,4:1};const ids=[];[1,2,3,4].forEach(d=>shuffle(VER.filter(q=>q.d===d&&!q.c)).slice(0,per[d]).forEach(q=>ids.push(q.id)));startRun('diag',shuffle(ids),null,'Diagnostic');runView(m,'home')}}

/* ---------- Plan ---------- */
function vPlan(m){const P=S.profile;const D=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
 if(!S.plan){m.innerHTML=`${head('Study plan')}<div class="card stack"><p>No plan yet.</p><div class="row"><a class="btn primary" href="#start">Set up</a><button class="btn" id="pg">Create a plan with default settings</button></div></div>`;$('#pg').onclick=()=>{genPlan();vPlan(m)};return}
 const t=today();const up=S.plan.days.filter(d=>d.day>=t);let showAll=m._all;const list=showAll?up:up.slice(0,14);
 const done=S.plan.days.reduce((a,d)=>a+d.tasks.filter(k=>k.done).length,0),all=S.plan.days.reduce((a,d)=>a+d.tasks.length,0);
 m.innerHTML=`${head('Study plan',`${up.length} study days to ${dayStr(S.plan.end)} · about ${S.plan.mpd} min per study day · ${done}/${all} tasks done`)}
 <details class="card"><summary><b>Adjust plan</b></summary><div class="stack" style="margin-top:12px"><div class="grid2"><div class="field"><label for="apDate">Exam date</label><input id="apDate" type="date" value="${esc(P.examDate)}"></div><div class="field"><label for="apHrs">Hours per week</label><input id="apHrs" type="number" min="2" max="40" value="${P.hours}"></div></div>
 <fieldset class="days"><legend>Study days</legend>${D.map((d,i)=>`<label class="chk"><input type="checkbox" value="${i}" ${P.days.includes(i)?'checked':''}> ${d}</label>`).join('')}</fieldset>
 <p class="fine">Regenerating keeps completed lessons and rebuilds future days from your latest results.</p><div class="row"><button class="btn primary" id="apGo">Regenerate plan</button></div></div></details>
 <div class="callout"><b>How the plan is built:</b> lessons first in your weaker module, scenarios after each module, daily flashcards and lookup drills, then practice weighted by exam weight and your diagnostic results; mock exams in the last two weeks. Only Modules A and B exist so far, so later days lean on practice questions for the other topics.</div>
 <div class="days-list">${list.map(d=>`<section class="card day ${d.day===t?'today':''}"><h2 class="h3">${dayStr(d.day)}${d.day===t?' · Today':''}</h2><ul class="tasks">${d.tasks.map(k=>`<li class="${k.done?'done':''}"><input type="checkbox" id="pk_${k.id}" data-tk="${k.id}" data-day="${d.day}" ${k.done?'checked':''}><label for="pk_${k.id}">${esc(k.label)} <span class="muted">· ${k.mins} min</span></label><button class="mini" data-go="${k.id}" data-day="${d.day}">Open</button></li>`).join('')}</ul></section>`).join('')}</div>
 ${!showAll&&up.length>14?`<div class="row"><button class="btn" id="pAll">Show all ${up.length} days</button></div>`:''}`;
 const find=(day,id)=>S.plan.days.find(x=>x.day==day).tasks.find(x=>x.id===id);
 m.querySelectorAll('[data-tk]').forEach(c=>c.onchange=()=>{find(c.dataset.day,c.dataset.tk).done=c.checked;save();c.closest('li').classList.toggle('done',c.checked)});
 m.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>goTask(find(b.dataset.day,b.dataset.go)));
 const pa=$('#pAll');if(pa)pa.onclick=()=>{m._all=true;vPlan(m)};
 $('#apGo').onclick=()=>{const days=[...m.querySelectorAll('.days input:checked')].map(x=>+x.value);if(!days.length){toast('Pick at least one study day');return}Object.assign(P,{examDate:$('#apDate').value,hours:Math.max(2,+$('#apHrs').value||10),days});genPlan();toast('Plan regenerated');vPlan(m)}}

/* ---------- Course ---------- */
function vLearn(m){m.innerHTML=`${head('Course','Lessons follow the official outline. Rule sheets cover every subtopic from the verified question bank.')}
 <section class="card stack"><div class="vh"><div><div class="eyebrow">All 16 subtopics · both books</div><h2>Rule sheets</h2><p class="muted">Every verified rule in the bank (${VER.length}), grouped by exam subtopic with its section, table or page and a link into your book. Use them to review a module before a practice exam.</p></div><a class="btn primary" href="#rules">Open rule sheets</a></div></section>
 ${G.MODULES.map(md=>`<section class="card stack mod" style="--c:${DCOL[md.d]}"><div class="vh"><div><div class="eyebrow">Module ${md.id} · ${DOM[md.d].name} (${DOM[md.d].w}% of exam)</div><h2>${esc(md.title)}</h2><p class="muted">${esc(md.blurb)}</p></div></div>
 <ol class="lessons">${G.LESSONS.filter(l=>l.mod===md.id).map(l=>{const st=S.lessons[l.id]||{};return `<li><a href="#lesson-${l.id}"><span class="lid">${l.id}</span><span>${esc(l.title)}</span><span class="muted">${l.mins} min</span><span class="st">${st.done?'✓ Done':st.seen?'In progress':''}</span></a></li>`}).join('')}</ol></section>`).join('')}
 <section class="card stack"><h2>Coming next</h2><p class="muted">Full lessons still to build: Use & occupancy and construction types; Fire protection systems; Interior environment and accessibility; Footings and foundations; Floors; Wall framing and stairs; Roof construction; Masonry; Interior finishes; Glass and glazing; Exterior finishes and roof coverings. Until then, use the rule sheets and practice questions, which already cover all of them.</p></section>`}
function vRules(m){const subs=[];G.EXAM.domains.forEach(d=>d.subs.forEach(s=>subs.push([d.d,s])));let cur=m._rs||subs[0][1];
 const num=r=>{const x=(r.match(/[\d]+(?:\.[\d]+)*/)||['9999'])[0].split('.').map(Number);return x[0]*1e6+(x[1]||0)*1e3+(x[2]||0)};
 const list=VER.filter(q=>q.s===cur).sort((a,b)=>(a.b>b.b?1:a.b<b.b?-1:0)||num(a.r)-num(b.r));
 m.innerHTML=`<nav class="crumbs"><a href="#learn">Course</a> › Rule sheets</nav>${head('Rule sheets','One line per verified rule. Tap 📖 to open the page in your own copy of the book.')}
 <div class="field"><label for="rsSel">Subtopic</label><select id="rsSel">${G.EXAM.domains.map(d=>`<optgroup label="${esc(d.name)} · ${d.w}%">${d.subs.map(s=>`<option ${s===cur?'selected':''}>${esc(s)}</option>`).join('')}</optgroup>`).join('')}</select></div>
 <section class="card stack"><h2 class="h3">${esc(cur)} · ${list.length} rules</h2><ol class="rules">${list.map(q=>`<li><span>${esc(q.ex)}</span> <span class="ref">${esc(q.r)}${q.p?' · p. '+q.p:''}</span>${q.b!=='MATH'?` <button class="mini" data-openq="${q.id}" aria-label="Open in my book">📖</button>`:''}</li>`).join('')}</ol></section>`;
 $('#rsSel').onchange=e=>{m._rs=e.target.value;vRules(m)}}
function vLesson(m,id){const l=LBY[id];const md=G.MODULES.find(x=>x.id===l.mod);S.lessons[id]=Object.assign({seen:true},S.lessons[id]||{});save();
 const ls=G.LESSONS.filter(x=>x.mod===l.mod);const i=ls.indexOf(l);const qs=l.quiz.map(x=>QBY[x]);const ans=(S.lessons[id].ans)||{};
 m.innerHTML=`<nav class="crumbs" aria-label="Breadcrumb"><a href="#learn">Course</a> › Module ${md.id} › ${l.id}</nav>
 ${head(`${l.id} · ${esc(l.title)}`,`${DOM[md.d].name} · about ${l.mins} min`,`<button class="btn sm" data-note="l:${id}">${S.notes['l:'+id]?'✎ Edit note':'✎ Add note'}</button>`)}
 <div class="notebox" data-nb="l:${id}" hidden></div>
 <section class="card stack"><h2 class="h3">You will be able to</h2><ul class="tight">${l.objectives.map(o=>`<li>${esc(o)}</li>`).join('')}</ul></section>
 <section class="card stack prose"><h2 class="h3">Plain-language explanation</h2>${l.explain}</section>
 <section class="grid2"><div class="card stack"><h2 class="h3">Terms</h2><dl class="terms">${l.terms.map(t=>`<dt>${esc(t[0])}</dt><dd>${esc(t[1])}</dd>`).join('')}</dl></div><div class="card stack visual"><h2 class="h3">Diagram or worked example</h2>${l.visual}</div></section>
 <section class="card stack prose"><h2 class="h3">On the job</h2>${l.apply}</section>
 <section class="card stack"><h2 class="h3">Find it in your book</h2><p><b>Task:</b> ${esc(l.lookup.task)}</p><ol class="tight">${l.lookup.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><details><summary>Show answer</summary><p><b>${esc(l.lookup.answer)}</b> (${l.book==='CM'?'Concrete Manual, 2021 IBC / ACI 318-19 edition':'2018 IBC, first printing'})</p></details></section>
 <section class="card stack"><h2 class="h3">Common mistakes and exam traps</h2><ul class="tight">${l.traps.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></section>
 <section class="stack"><h2>Lesson quiz</h2><p class="muted">Immediate feedback. Your first answer on each question counts toward your stats.</p><div class="quiz" id="lq">${qs.map((q,k)=>qCard(q,k,ans[q.id],{fb:true})).join('')}</div></section>
 <div class="row between">${i>0?`<a class="btn" href="#lesson-${ls[i-1].id}">← ${ls[i-1].id}</a>`:'<span></span>'}<button class="btn primary" id="lDone">${S.lessons[id].done?'Lesson complete ✓':'Mark lesson complete'}</button>${i<ls.length-1?`<a class="btn" href="#lesson-${ls[i+1].id}">${ls[i+1].id} →</a>`:'<a class="btn" href="#learn">Back to course</a>'}</div>`;
 let t0=Date.now();
 $('#lq').onclick=e=>{const b=e.target.closest('.opt');if(!b||b.disabled)return;const card=b.closest('.q');const qid=card.dataset.q;const o=+b.dataset.o;const ms=Date.now()-t0;t0=Date.now();
  rec(qid,o,'lesson',ms);S.lessons[id].ans=Object.assign({},S.lessons[id].ans,{[qid]:o});
  if(Object.keys(S.lessons[id].ans).length===qs.length&&!S.lessons[id].done){S.lessons[id].done=true;autoDone('lesson',id);const c=qs.filter(q=>S.lessons[id].ans[q.id]===q.a).length;log('lesson','Lesson '+id+' quiz',pct(c,qs.length));toast('Lesson complete');$('#lDone').textContent='Lesson complete ✓'}
  save();const k=qs.findIndex(q=>q.id===qid);card.outerHTML=qCard(QBY[qid],k,o,{fb:true});celebrate($('#lq'),qid,o);say(o===QBY[qid].a?'Correct':'Incorrect')};
 $('#lDone').onclick=()=>{S.lessons[id].done=true;autoDone('lesson',id);save();$('#lDone').textContent='Lesson complete ✓'}}

/* ---------- Practice ---------- */
function vPractice(m){if(S.run&&(S.run.kind==='quiz')){if(S.run.done)return resultView(m,'practice','all');return runView(m,'practice')}
 const pend=S.pend;S.pend=null;save();const st=stats();
 let mode=m._mode||(pend&&pend.type==='quiz'?'timed':'study');const preD=pend&&pend.type==='practice'?pend.ref:'all';
 m.innerHTML=`${head('Practice questions',`${VER.length} verified questions · ${G.Q.length-VER.length} demonstration · first-attempt accuracy ${st.fn?pct(st.fc,st.fn)+'%':'—'} · repeat attempts ${st.rn?pct(st.rc,st.rn)+'%':'—'}`)}
 <div class="seg" role="tablist" aria-label="Practice mode">${[['study','Study mode'],['timed','Timed quiz'],['book','Bookmarked ('+S.book.length+')'],['missed','Missed queue ('+S.missed.length+')']].map(x=>`<button role="tab" aria-selected="${mode===x[0]}" data-m="${x[0]}">${x[1]}</button>`).join('')}</div>
 <div id="pBody"></div>`;
 m.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{m._mode=b.dataset.m;vPractice(m)});
 const body=$('#pBody');
 const filters=(withDemo)=>`<div class="card cfg"><div class="field"><label for="fD">Topic</label><select id="fD"><option value="all">All topics</option>${[1,2,3,4].map(d=>`<option value="${d}" ${preD==d?'selected':''}>${DOM[d].name}</option>`).join('')}</select></div>
  <div class="field"><label for="fS">Subtopic</label><select id="fS"><option value="all">All subtopics</option></select></div>
  <div class="field"><label for="fF">Difficulty</label><select id="fF"><option value="all">Any</option><option value="1">Basic</option><option value="2">Intermediate</option><option value="3">Advanced</option></select></div>
  <div class="field"><label for="fN">Questions</label><select id="fN"><option>10</option><option selected>20</option><option value="999">All matching</option></select></div>
  ${withDemo?'<label class="chk"><input type="checkbox" id="fDemo"> Include demonstration items</label>':''}<button class="btn primary" id="fGo">Start</button></div>`;
 const pool=(demo)=>G.Q.filter(q=>(demo||q.v)&&($('#fD').value==='all'||q.d==$('#fD').value)&&($('#fS').value==='all'||q.s===$('#fS').value)&&($('#fF').value==='all'||q.df==$('#fF').value));
 const subFill=()=>{const d=$('#fD');const fs=$('#fS');if(!d||!fs)return;const subs=d.value==='all'?G.EXAM.domains.flatMap(x=>x.subs):DOM[d.value].subs;fs.innerHTML='<option value="all">All subtopics</option>'+subs.map(x=>`<option value="${esc(x)}">${esc(x)} (${VER.filter(q=>q.s===x).length})</option>`).join('')};
 if(mode==='study'){body.innerHTML=filters(true)+'<div class="quiz" id="sq"></div>';subFill();$('#fD').onchange=subFill;$('#fGo').onclick=()=>{const ids=shuffle(pool($('#fDemo').checked)).slice(0,+$('#fN').value).map(q=>q.id);if(!ids.length){$('#sq').innerHTML='<p class="muted">No questions match.</p>';return}studyList($('#sq'),ids,'study',()=>{autoDone('practice')})}}
 else if(mode==='timed'){body.innerHTML=filters(false).replace('Start</button>','Start timed quiz</button>')+`<p class="fine">Timed at the exam pace of 160 seconds per question. Answers are hidden until you submit. Demonstration items are excluded.</p>`;subFill();$('#fD').onchange=subFill;
  $('#fGo').onclick=()=>{const p=pool(false);const n=Math.min(+$('#fN').value,p.length);if(!n){toast('No questions match');return}const ids=$('#fD').value==='all'?drawWeighted(n,p):shuffle(p).slice(0,n).map(q=>q.id);startRun('quiz',ids,n*SEC_PER_Q,'Timed quiz');runView(m,'practice')}}
 else if(mode==='book'){body.innerHTML=S.book.length?'<div class="quiz" id="sq"></div>':'<p class="muted card">No bookmarks yet. Use ☆ Bookmark on any question.</p>';if(S.book.length)studyList($('#sq'),S.book.slice(),'study')}
 else {body.innerHTML=S.missed.length?'<p class="muted">Answer a missed question correctly to clear it from the queue. Each missed question also becomes a flashcard.</p><div class="quiz" id="sq"></div>':'<p class="muted card">No missed questions. Wrong answers anywhere in the app land here.</p>';if(S.missed.length)studyList($('#sq'),S.missed.slice(),'review')}}
function studyList(el,ids,mode,onDone){const ans={};let t0=Date.now();
 const render=()=>{el.innerHTML=ids.map((id,i)=>qCard(QBY[id],i,ans[i],{fb:true,total:ids.length})).join('')+(Object.keys(ans).length===ids.length?`<div class="card"><b>Set complete: ${pct(ids.filter((id,i)=>ans[i]===QBY[id].a).length,ids.length)}%</b></div>`:'')};
 render();el.onclick=e=>{const b=e.target.closest('.opt');if(!b||b.disabled)return;const card=b.closest('.q');const i=ids.indexOf(card.dataset.q);const o=+b.dataset.o;rec(ids[i],o,mode,Date.now()-t0);t0=Date.now();ans[i]=o;
  card.outerHTML=qCard(QBY[ids[i]],i,o,{fb:true,total:ids.length});celebrate(el,ids[i],o);say(o===QBY[ids[i]].a?'Correct':'Incorrect');
  if(Object.keys(ans).length===ids.length){const p=pct(ids.filter((id,k)=>ans[k]===QBY[id].a).length,ids.length);log(mode==='review'?'review':'practice',(mode==='review'?'Missed-question review':'Study set')+' ('+ids.length+' Q)',p);onDone&&onDone();el.insertAdjacentHTML('beforeend',`<div class="card"><b>Set complete: ${p}%</b></div>`)}}}

/* ---------- Scenarios ---------- */
function vScenarios(m){m.innerHTML=`${head('Construction scenarios','Original projects with drawings. Inspect, identify the issue, pick the reference, calculate, then try a variant with new inputs.')}
 <div class="grid2">${G.SCENARIOS.map(s=>{const st=S.scen[s.id];return `<a class="card scard" href="#scn-${s.id}" style="--c:${DCOL[s.d]}"><span class="eyebrow">${DOM[s.d].name}</span><h2 class="h3">${esc(s.title)}</h2><p class="muted">${esc(s.blurb)}</p><span class="muted">${st?`Runs: ${st.runs} · best ${st.best}% first-try`:'Not started'}</span></a>`}).join('')}</div>
 <p class="fine">Scenario facts are invented for practice. Code rules cited are checked against the 2018 IBC; assumptions are labeled.</p>`}
function vScn(m,id){const sc=SBY[id];let seed=(m._seed&&m._sid===id)?m._seed:Math.floor(Math.random()*1e9);m._sid=id;m._seed=seed;
 let s=seed;const rnd=()=>{s=(s*1664525+1013904223)%4294967296;return s/4294967296};const V=sc.gen(rnd);
 const graded=V.steps.filter(x=>x.k!=='explain').length;let step=0,first=0,tries=0;
 m.innerHTML=`<nav class="crumbs"><a href="#scenarios">Scenarios</a> › ${esc(sc.title)}</nav>${head(esc(sc.title),DOM[sc.d].name)}
 <section class="grid2"><div class="card stack"><h2 class="h3">1 · Project facts</h2>${V.facts}</div>
 <div class="card stack"><h2 class="h3">2 · Inspect the drawings</h2><div class="drawing">${V.svg}</div><div class="row">${V.hot.map((h,i)=>`<button class="btn sm" data-hot="${i}" aria-expanded="false">${esc(h[0])}</button>`).join('')}</div><div id="hotOut" class="hotout" aria-live="polite"><p class="muted">Select a callout to read its detail.</p></div></div></section>
 <section class="card stack" id="steps"></section>`;
 m.querySelectorAll('[data-hot]').forEach(b=>b.onclick=()=>{m.querySelectorAll('[data-hot]').forEach(x=>x.setAttribute('aria-expanded',x===b));$('#hotOut').innerHTML=`<b>${esc(V.hot[b.dataset.hot][0])}</b><p>${V.hot[b.dataset.hot][1]}</p>`});
 const box=$('#steps');const labels=['3 · Identify','4 · Reference','5 · Decide or calculate','5 · Decide or calculate','5 · Decide or calculate','5 · Decide'];
 const renderStep=()=>{const x=V.steps[step];const n=step+1;tries=0;
  if(x.k==='explain'){const sc100=pct(first,graded);S.scen[id]=S.scen[id]||{runs:0,best:0};S.scen[id].runs++;S.scen[id].best=Math.max(S.scen[id].best,sc100);save();autoDone('scn',id);log('scn','Scenario: '+sc.title,sc100);
   box.innerHTML=`<h2 class="h3">6 · Result and references</h2><p class="muted">First-try score: ${first}/${graded} (${sc100}%)</p><div class="prose">${x.html}</div><div class="row"><button class="btn primary big" id="var">7 · Try a similar scenario with new inputs</button><a class="btn" href="#scenarios">All scenarios</a></div>`;
   $('#var').onclick=()=>{m._seed=Math.floor(Math.random()*1e9);vScn(m,id)};box.querySelector('h2').focus&&box.scrollIntoView({behavior:'smooth',block:'start'});return}
  const lab=x.k==='multi'?'3 · Identify':(/reference|section/i.test(x.q)?'4 · Reference':(x.k==='num'?'5 · Calculate':'Decide'));
  if(x.k==='choice'){box.innerHTML=`<div class="eyebrow">${lab} · step ${n} of ${V.steps.length}</div><h2 class="h3">${x.q}</h2><div class="opts">${x.o.map((o,j)=>`<button class="opt" data-j="${j}"><span class="lt">${L4[j]}</span><span>${o.t}</span></button>`).join('')}</div><div id="sfb" aria-live="polite"></div>`;
   box.querySelector('.opts').onclick=e=>{const b=e.target.closest('.opt');if(!b||b.disabled)return;const o=x.o[+b.dataset.j];tries++;if(o.ok&&tries===1)first++;
    b.classList.add(o.ok?'right':'wrong');window.G11FX.off=S.fx===false;o.ok?window.G11FX.right(b):window.G11FX.wrong(b);if(o.ok)box.querySelectorAll('.opt').forEach(z=>z.disabled=true);else b.disabled=true;
    $('#sfb').innerHTML=`<div class="fb ${o.ok?'good':'bad'}"><b>${o.ok?'Correct.':'Not quite.'}</b> ${o.fb}${o.ok?'':' Try again.'}</div>${o.ok?'<div class="row"><button class="btn primary" id="snext">Continue</button></div>':''}`;
    if(o.ok){$('#snext').onclick=()=>{step++;renderStep()};$('#snext').focus()}}}
  else if(x.k==='multi'){box.innerHTML=`<div class="eyebrow">${lab} · step ${n} of ${V.steps.length}</div><h2 class="h3">${x.q}</h2><div class="stack">${x.items.map((it,j)=>`<label class="chk big"><input type="checkbox" data-j="${j}"> ${esc(it.t)}</label>`).join('')}</div><div class="row"><button class="btn primary" id="mchk">Check</button></div><div id="sfb" aria-live="polite"></div>`;
   $('#mchk').onclick=()=>{const sel=[...box.querySelectorAll('input:checked')].map(i=>+i.dataset.j);tries++;const right=x.items.every((it,j)=>it.bad===sel.includes(j));if(right&&tries===1)first++;
    $('#sfb').innerHTML=`<div class="fb ${right?'good':'bad'}"><b>${right?'Correct.':'Not all right.'}</b><ul>${x.items.map((it,j)=>`<li>${it.bad?'❌ Problem':'✅ OK'}: ${esc(it.t)}. ${sel.includes(j)!==it.bad?'<b>(you marked this '+(sel.includes(j)?'as a problem':'as OK')+')</b> ':''}${esc(it.why)}</li>`).join('')}</ul></div><div class="row"><button class="btn primary" id="snext">Continue</button></div>`;
    box.querySelectorAll('input').forEach(i=>i.disabled=true);$('#mchk').disabled=true;$('#snext').onclick=()=>{step++;renderStep()}}}
  else if(x.k==='num'){box.innerHTML=`<div class="eyebrow">${lab} · step ${n} of ${V.steps.length}</div><h2 class="h3">${x.q}</h2><div class="row"><label class="sr" for="nIn">Your answer</label><input id="nIn" type="number" step="any" inputmode="decimal" class="numin"><span>${x.unit}</span><button class="btn primary" id="nChk">Check</button><button class="btn" id="nGive">Show answer</button></div><div id="sfb" aria-live="polite"></div>`;
   const fin=(ok,given)=>{if(ok&&tries===1&&!given)first++;$('#sfb').innerHTML=`<div class="fb ${ok&&!given?'good':'bad'}"><b>${ok&&!given?'Correct.':'Answer: '+x.ans+' '+x.unit+'.'}</b> ${x.fb}</div><div class="row"><button class="btn primary" id="snext">Continue</button></div>`;$('#nChk').disabled=true;$('#nGive').disabled=true;$('#snext').onclick=()=>{step++;renderStep()};$('#snext').focus()};
   $('#nChk').onclick=()=>{const v=parseFloat($('#nIn').value);if(isNaN(v)){toast('Enter a number');return}tries++;if(Math.abs(v-x.ans)<=x.tol+1e-9)fin(true);else $('#sfb').innerHTML=`<div class="fb bad"><b>Not quite.</b> Re-check your steps and try again, or show the answer.</div>`};
   $('#nGive').onclick=()=>{tries++;fin(true,true)};$('#nIn').onkeydown=e=>{if(e.key==='Enter')$('#nChk').click()}}};
 renderStep()}

/* ---------- Lookup trainer ---------- */
function vLookup(m){const st=stats();const pend=S.pend;S.pend=null;save();let cur=null,t0=0,hints=0,tm=null;let set=m._set||null,si=0;
 m.innerHTML=`${head('Code lookup trainer','Keyword → index → chapter → section or table. Speed and accuracy are tracked separately.')}
 <section class="tiles"><div class="tile"><span class="lab">Lookups done</span><span class="val">${st.lkN}</span></div><div class="tile"><span class="lab">Correct</span><span class="val">${st.lkN?pct(st.lkOk,st.lkN)+'%':'—'}</span></div><div class="tile"><span class="lab">Avg time (correct)</span><span class="val">${st.lkAvg!=null?Math.round(st.lkAvg)+' s':'—'}</span><span class="muted">Target under 90 s</span></div><div class="tile"><span class="lab">Hints used per lookup</span><span class="val">${S.lookups.length?(S.lookups.reduce((a,x)=>a+x.h,0)/S.lookups.length).toFixed(1):'—'}</span></div></section>
 <div class="card stack" id="lk"><p>Open your 2018 IBC. Press start; the timer runs until you submit the section or table number you found.</p><div class="row"><button class="btn primary big" id="lkGo">Start a 5-lookup drill</button><select id="lkD" aria-label="Topic"><option value="all">All topics</option>${[1,2,3,4].map(d=>`<option value="${d}">${DOM[d].name}</option>`).join('')}</select></div></div>
 <section class="card stack"><h2 class="h3">History</h2>${S.lookups.length?`<div class="tbl"><table><thead><tr><th>Lookup</th><th>Result</th><th>Time</th><th>Hints</th></tr></thead><tbody>${S.lookups.slice(-12).reverse().map(x=>`<tr><td>${esc(LKBY[x.id]?LKBY[x.id].prompt:x.id)}</td><td>${x.ok?'✓':'✗'}</td><td class="num">${Math.round(x.ms/1000)} s</td><td class="num">${x.h}</td></tr>`).join('')}</tbody></table></div>`:'<p class="muted">No lookups yet.</p>'}</section>`;
 const box=$('#lk');
 const show=()=>{cur=set[si];hints=0;t0=Date.now();clearInterval(timer);
  box.innerHTML=`<div class="eyebrow">Lookup ${si+1} of ${set.length} · ${DOM[cur.d].name}</div><h2>${esc(cur.prompt)}</h2><div class="timer" id="lt">0 s</div>
  <div class="row"><label class="sr" for="lkIn">Section or table number</label><input id="lkIn" class="numin wide" placeholder="e.g. 1011.2 or Table 1017.2" autocomplete="off"><button class="btn primary" id="lkSub">Submit</button><button class="btn" id="lkHint">Hint (${cur.hints.length})</button></div><ol class="hints" id="lkH"></ol><div id="lkFb" aria-live="polite"></div>`;
  $('#lkIn').focus();timer=setInterval(()=>{const e=$('#lt');if(e)e.textContent=Math.round((Date.now()-t0)/1000)+' s'},500);
  $('#lkHint').onclick=()=>{if(hints<cur.hints.length){$('#lkH').insertAdjacentHTML('beforeend',`<li>${esc(cur.hints[hints])}</li>`);hints++;$('#lkHint').textContent=`Hint (${cur.hints.length-hints} left)`;if(hints>=cur.hints.length)$('#lkHint').disabled=true}};
  const norm=v=>v.toLowerCase().replace(/section|sec\.|§|\s/g,'').replace(/^table/,'table');
  $('#lkSub').onclick=()=>{const v=norm($('#lkIn').value);if(!v){toast('Type the section or table number');return}clearInterval(timer);const ms=Date.now()-t0;const ok=cur.acc.some(a=>v===a||v==='table'+a||v.replace(/^table/,'')===a.replace(/^table/,''));
   S.lookups.push({id:cur.id,at:Date.now(),ms,h:hints,ok});save();
   $('#lkFb').innerHTML=`<div class="fb ${ok?'good':'bad'}"><b>${ok?'Found it':'Not that one'}</b> in ${Math.round(ms/1000)} s with ${hints} hint${hints===1?'':'s'}.<p><b>Answer:</b> ${esc(cur.ans)}</p><p class="ref">Path: ${cur.hints.map(esc).join(' → ')}</p></div><div class="row"><button class="btn primary" id="lkN">${si<set.length-1?'Next lookup':'Finish drill'}</button></div>`;
   $('#lkSub').disabled=true;$('#lkHint').disabled=true;$('#lkIn').disabled=true;$('#lkN').focus();
   $('#lkN').onclick=()=>{si++;if(si<set.length)show();else{const res=S.lookups.slice(-set.length);const c=res.filter(x=>x.ok).length;log('lookup','Lookup drill',pct(c,set.length));autoDone('lookup');m._set=null;vLookup(m);toast(`Drill done: ${c}/${set.length} correct`)}}};
  $('#lkIn').onkeydown=e=>{if(e.key==='Enter')$('#lkSub').click()}};
 $('#lkGo').onclick=()=>{const d=$('#lkD').value;const p=G.LOOKUPS.filter(l=>d==='all'||l.d==d);const recent=new Set(S.lookups.slice(-10).map(x=>x.id));set=shuffle(p).sort((a,b)=>recent.has(a.id)-recent.has(b.id)).slice(0,5);si=0;show()}}

/* ---------- Exam ---------- */
function quotas(n){const per={};let tot=0;[1,2,3,4].forEach(d=>{per[d]=Math.max(d===4?1:0,Math.round(n*DOM[d].w/100));tot+=per[d]});per[3]+=n-tot;return per}
function seenQ(id){return !!S.att[id]||(S.series||[]).some(x=>x.qids.includes(id))}
function buildSeries(){const n=90,per=quotas(n),out=[];const rec=q=>S.lastUsed[q.id]||0;
 [1,2,3,4].forEach(d=>{const subs=DOM[d].subs;const Q=per[d];const pools=subs.map(s=>shuffle(VER.filter(q=>q.d===d&&q.s===s)).sort((a,b)=>(seenQ(a.id)-seenQ(b.id))||(rec(a)-rec(b))));
  // one per subtopic first, then share the rest by how many unseen questions each subtopic still has (cap 40% of the domain)
  const cap=Math.max(2,Math.ceil(Q*0.4));const take=subs.map((s,i)=>pools[i].length?1:0);let left=Q-take.reduce((a,b)=>a+b,0);
  const wt=pools.map(pl=>Math.max(1,pl.filter(q=>!seenQ(q.id)).length));
  while(left>0){let best=-1,bv=-1;pools.forEach((pl,i)=>{if(take[i]>=pl.length||take[i]>=cap)return;const v=wt[i]/(take[i]+1)+Math.random()*0.01;if(v>bv){bv=v;best=i}});if(best<0)break;take[best]++;left--}
  while(left>0){let best=-1,bv=-1;pools.forEach((pl,i)=>{if(take[i]>=pl.length)return;const v=wt[i]/(take[i]+1);if(v>bv){bv=v;best=i}});if(best<0)break;take[best]++;left--}
  pools.forEach((pl,i)=>pl.slice(0,take[i]).forEach(q=>out.push(q.id)))});
 const no=3+(S.series||[]).length+1;S.series=S.series||[];S.series.push({no,at:Date.now(),qids:shuffle(out)});save();return S.series[S.series.length-1]}
function canDraw(n){const per=quotas(n);return [1,2,3,4].every(d=>VER.filter(q=>q.d===d).length>=per[d])}
function vExam(m){if(S.run&&S.run.kind==='exam'){if(S.run.done)return resultView(m,'exam','all');return runView(m,'exam')}
 const SER=G.SERIES||[];const hist=S.runs.filter(r=>r.kind==='exam');const best=id=>{const h=hist.filter(r=>r.ser===id);return h.length?Math.max(...h.map(r=>r.p)):null};
 const gen=[[20,'Quick exam'],[45,'Half-length exam'],[90,'Full-length exam']];
 m.innerHTML=`${head('Practice exams','Verified questions only, weighted by the official outline (19 / 31 / 42 / 8). Timed at the real pace: 4 hours for 90 questions. Explanations come after you submit.')}
 <section class="card stack"><h2>Mock exam series</h2><p class="muted">${SER.length} fixed full-length exams. No question appears in more than one mock, and each mock covers every subtopic in the official outline. Retake a mock to measure progress on the same set.</p>
 <div class="grid3">${SER.map(x=>{const b=best(x.id);const n=hist.filter(r=>r.ser===x.id).length;return `<div class="mock-card"><div class="eyebrow">${x.qids.length} questions · ${fmtT(x.qids.length*SEC_PER_Q)}</div><h3>${esc(x.title)}</h3><p class="muted">${n?`Taken ${n}× · best ${b}%`:'Not taken yet'}</p><button class="btn primary" data-ser="${x.id}">Start ${esc(x.title)}</button></div>`}).join('')}</div></section>
 <section class="card stack series"><div class="vh"><div><div class="eyebrow">Unlimited · full length</div><h2>Exam series</h2><p class="muted">Each new series is a fresh 90-question exam at the official weights (≈ 17 permits · 28 life safety · 38 structural · 7 envelope), spread across every subtopic, with the real 4-hour (240-minute) clock. Questions you have never seen come first, so each series pushes you through more of the bank. ${S.examMark!==false?'Right and wrong show as you answer (change this in Data &amp; settings).':'Answers stay hidden until you submit.'}</p></div></div>
  ${(()=>{const un=VER.filter(q=>!seenQ(q.id)).length;return `<div class="grid3"><div class="stat"><span class="lab">Question bank</span><b>${VER.length}</b><span class="muted">${VER.filter(q=>q.b==='IBC').length} IBC · ${VER.filter(q=>q.b==='CM').length} Concrete Manual · ${VER.filter(q=>q.b==='MATH').length} calculation</span></div><div class="stat"><span class="lab">Not seen yet</span><b>${un}</b><span class="muted">${Math.round((1-un/VER.length)*100)}% of the bank seen</span></div><div class="stat"><span class="lab">Series made</span><b>${(S.series||[]).length}</b><span class="muted">plus Mock Exams 1–3</span></div></div>`})()}
  <div class="row"><button class="btn primary big" id="serNew">Start new series #${3+(S.series||[]).length+1} · 90 questions · 4:00:00</button></div>
  ${(S.series||[]).length?`<details><summary>Retake an earlier series</summary><ul class="plain">${S.series.slice().reverse().map(x=>{const h=hist.filter(r=>r.ser==='X'+x.no);return `<li class="row between"><span>Series #${x.no} · ${new Date(x.at).toLocaleDateString()} · ${h.length?'best '+Math.max(...h.map(r=>r.p))+'%':'not finished'}</span><button class="btn sm" data-xser="${x.no}">Take again</button></li>`}).join('')}</ul></details>`:''}
 </section>
 <section class="card stack"><h2>Shorter generated exam</h2><p class="muted">A fresh draw each time from all ${VER.length} verified questions at the official weights. Questions you saw most recently are drawn last.</p>
  ${gen.map(o=>{const ok=canDraw(o[0]);return `<label class="chk big ${ok?'':'dis'}"><input type="radio" name="exn" value="${o[0]}" ${o[0]===90?'checked':''} ${ok?'':'disabled'}> ${o[1]}: ${o[0]} questions · ${fmtT(o[0]*SEC_PER_Q)}</label>`}).join('')}
  <div class="row"><button class="btn primary big" id="exGo">Start generated exam</button></div></section>
 <section class="card stack"><h2>Exam history</h2>${hist.length?`<div class="tbl"><table><thead><tr><th>Date</th><th>Exam</th><th>Questions</th><th>Score</th><th>Time</th></tr></thead><tbody>${hist.map(r=>`<tr><td>${new Date(r.at).toLocaleDateString()}</td><td>${esc(r.label)}</td><td class="num">${r.n}</td><td class="num">${r.p}%</td><td class="num">${fmtT(r.secs)}</td></tr>`).join('')}</tbody></table></div>`:'<p class="muted">No exams yet.</p>'}</section>`;
 m.querySelectorAll('[data-ser]').forEach(b=>b.onclick=()=>{const x=SER.find(y=>y.id===b.dataset.ser);startRun('exam',x.qids.slice(),x.qids.length*SEC_PER_Q,x.title);S.run.ser=x.id;save();runView(m,'exam')});
 $('#serNew').onclick=()=>{const x=buildSeries();startRun('exam',x.qids.slice(),x.qids.length*SEC_PER_Q,'Exam series #'+x.no);S.run.ser='X'+x.no;save();runView(m,'exam')};
 m.querySelectorAll('[data-xser]').forEach(b=>b.onclick=()=>{const x=S.series.find(y=>y.no===+b.dataset.xser);startRun('exam',shuffle(x.qids),x.qids.length*SEC_PER_Q,'Exam series #'+x.no);S.run.ser='X'+x.no;save();runView(m,'exam')});
 $('#exGo').onclick=()=>{const n=+m.querySelector('input[name=exn]:checked').value;startRun('exam',drawWeighted(n,VER),n*SEC_PER_Q,`Generated exam (${n} Q)`);runView(m,'exam')}}

/* ---------- Flashcards ---------- */
function vCards(m){const decks=[['all','All decks'],['t','Terminology'],['c','Concepts and values'],['l','Reference locations'],['m','My missed questions'],['u','My cards']];let deck=m._deck||'all';
 const {due,nw,all}=dueCards(deck);
 m.innerHTML=`${head('Flashcards','Spaced repetition: cards you know come back less often. New cards are limited to 10 a day.')}
 <div class="seg" role="tablist" aria-label="Deck">${decks.map(d=>{const c=dueCards(d[0]);return `<button role="tab" aria-selected="${deck===d[0]}" data-d="${d[0]}">${d[1]} <span class="muted">${c.due.length+Math.min(10,c.nw.length)} due</span></button>`}).join('')}</div>
 <div class="card stack" id="cv"><p>${due.length} due · ${nw.length} new · ${all.length} total in this deck.</p><div class="row"><button class="btn primary big" id="cGo" ${due.length+nw.length?'':'disabled'}>Review now</button></div></div>
 <details class="card"><summary><b>Add a custom card</b></summary><form id="cAdd" class="stack" style="margin-top:10px"><div class="field"><label for="cF">Front</label><input id="cF" required maxlength="200"></div><div class="field"><label for="cB">Back</label><textarea id="cB" rows="2" required maxlength="400"></textarea></div><div class="row"><button class="btn" type="submit">Add card</button></div></form></details>
 ${S.custom.length?`<section class="card stack"><h2 class="h3">My cards</h2><ul class="plain">${S.custom.map(c=>`<li>${esc(c.f)} <button class="mini" data-del="${c.id}">Delete</button></li>`).join('')}</ul></section>`:''}`;
 m.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{m._deck=b.dataset.d;vCards(m)});
 $('#cAdd').onsubmit=e=>{e.preventDefault();const f=$('#cF').value.trim(),b=$('#cB').value.trim();if(!f||!b)return;S.custom.push({id:'u'+Date.now(),f,b});save();toast('Card added');vCards(m)};
 m.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{S.custom=S.custom.filter(c=>c.id!==b.dataset.del);delete S.cards[b.dataset.del];save();vCards(m)});
 $('#cGo').onclick=()=>{let q=shuffle(due).concat(shuffle(nw).slice(0,10));let n=0;const box=$('#cv');
  const show=()=>{if(!q.length){box.innerHTML=`<p><b>Session done: ${n} cards reviewed.</b></p><div class="row"><a class="btn" href="#home">Dashboard</a></div>`;log('cards','Flashcards ('+n+')',null);autoDone('cards');return}
   const c=q[0];box.innerHTML=`<div class="eyebrow">${q.length} left</div><div class="flash" id="fl" tabindex="0"><div class="front">${esc(c.f)}</div><div class="back" hidden>${esc(c.b)}</div></div><div class="row"><button class="btn primary big" id="flip">Show answer (Space)</button></div><div class="row" id="gr" hidden><button class="btn big" data-g="again">Again</button><button class="btn big" data-g="good">Good</button><button class="btn big" data-g="easy">Easy</button></div>`;
   const flip=()=>{box.querySelector('.back').hidden=false;$('#flip').hidden=true;$('#gr').hidden=false;$('#gr button[data-g=good]').focus()};$('#flip').onclick=flip;
   $('#fl').onkeydown=e=>{if(e.key===' '){e.preventDefault();flip()}};$('#flip').focus();
   box.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{grade(c.id,b.dataset.g);n++;q.shift();if(b.dataset.g==='again')q.push(c);show()})};show()}}

/* ---------- Info ---------- */
function vInfo(m){const E=G.EXAM;m.innerHTML=`${head('Exam information',`Checked ${E.checked} against official ICC sources. Exam requirements only; local licensing is on a separate page.`)}
 <div class="tbl card"><table><thead><tr><th>Item</th><th>Detail</th><th>Status</th><th>Source</th></tr></thead><tbody>${E.rows.map(r=>`<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td>${r[2]==='v'?'<span class="pill ok">Verified</span>':'<span class="pill warn">Pending verification</span>'}</td><td class="muted">${esc(r[3])}</td></tr>`).join('')}</tbody></table></div>
 <section class="card stack prose"><h2>How this exam works</h2>
 <p>Questions come only from the two references named in the ICC bulletin: the <b>2018 International Building Code</b> and the <b>Concrete Manual</b> (the edition tied to the 2021 IBC and ACI 318-19, or the 2015 IBC / ACI 318-14 edition).</p>
 <p>It is <b>open book</b>: you bring your approved printed books into the testing center. The exam is built to test whether you can read a complex construction scenario, pick out its keywords and quickly reach the right section or table through the table of contents or index, not whether you have memorized values.</p>
 <p><b>90 multiple-choice questions in 4 hours (240 minutes)</b>, about 2.7 minutes per question. Weights: Structural Systems 42% (foundations, concrete, masonry, steel and wood) · Building Planning & Life Safety 31% (occupancy, fire-resistance ratings, means of egress, accessibility) · Permits & General Regulations 19% (administration, inspections, stop work orders) · Building Envelope 8% (roof assemblies, weather protection, exterior walls, glazing).</p>
 <div class="row wrap"><a class="btn primary" href="#exam">Take an exam series</a><a class="btn" href="#reader">Open my code books</a><a class="btn" href="#guides">Open-book method</a></div></section>
 <section class="card stack"><h2>Official content outline</h2><div class="wbar" role="img" aria-label="Exam weights 19, 31, 42, 8 percent">${E.domains.map(d=>`<div style="flex:${d.w};background:${DCOL[d.d]}"><b>${d.w}%</b></div>`).join('')}</div>
 <div class="grid4">${E.domains.map(d=>`<div class="dom" style="--c:${DCOL[d.d]}"><h3>${esc(d.name)} · ${d.w}%</h3><p class="muted">≈ ${Math.round(90*d.w/100)} of 90 questions</p><ul class="tight">${d.subs.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></div>`).join('')}</div></section>
 <section class="card stack"><h2>Question bank coverage</h2><p class="muted">${VER.length} verified questions mapped to every subtopic of the official outline, citing ${chapCount()} chapters of the 2018 IBC.</p>
 <div class="tbl"><table><thead><tr><th>Domain</th><th>Subtopic</th><th>Verified questions</th></tr></thead><tbody>${E.domains.map(d=>d.subs.map((s,i)=>`<tr>${i===0?`<td rowspan="${d.subs.length}"><b style="color:${DCOL[d.d]}">${esc(d.name)}</b><br><span class="muted">${d.w}% · ${VER.filter(q=>q.d===d.d).length} Q</span></td>`:''}<td>${esc(s)}</td><td class="num">${VER.filter(q=>q.s===s).length}</td></tr>`).join('')).join('')}</tbody></table></div>
 <p class="muted">Chapters cited: ${chapList()}.</p></section>
 <section class="card stack"><h2>Do not assume the newest code</h2><p>G11 uses the <b>2018 IBC</b> even though newer editions exist. F11 is the same exam class on the 2015 IBC. Page references in this course are from the 2018 IBC first printing (August 2017).</p><a class="btn" href="#local">Colorado licensing (separate from the exam)</a></section>
 <section class="card stack"><h2>Sources</h2><ul class="plain">${E.sources.map(s=>`<li>${s[1]?`<a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a>`:esc(s[0])} <span class="muted">· checked ${esc(s[2])}</span></li>`).join('')}</ul></section>`}
function chapOf(r){if(!r)return null;let m=r.match(/(?:§|Table )\s*(\d+)/);if(!m)return null;const n=m[1];if(r.startsWith('§202')||n==='202')return 2;return +(n.length<=3?n[0]:n.slice(0,n.length-2))}
function chapCount(){return new Set(VER.filter(q=>q.b==='IBC').map(q=>chapOf(q.r)).filter(Boolean)).size}
function chapList(){const c={};VER.filter(q=>q.b==='IBC').forEach(q=>{const k=chapOf(q.r);if(k)c[k]=(c[k]||0)+1});return Object.keys(c).sort((a,b)=>a-b).map(k=>`Ch. ${k} (${c[k]})`).join(' · ')}
function vLocal(m){const L=G.LOCAL;m.innerHTML=`<nav class="crumbs"><a href="#info">Exam info</a> › Local licensing</nav>${head('Colorado licensing','Separate from exam requirements. Checked '+esc(L.checked)+'.')}
 <div class="callout warn">${esc(L.note)}</div><div class="tbl card"><table><thead><tr><th>Jurisdiction</th><th>What it lists</th><th>Status</th></tr></thead><tbody>${L.rows.map(r=>`<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])} <a href="${r[3]}" target="_blank" rel="noopener">Source</a></td><td>${esc(r[2])}</td></tr>`).join('')}</tbody></table></div>`}

/* ---------- Data & settings ---------- */
function vData(m){m.innerHTML=`${head('Data and settings','Progress is saved in this browser. Export a copy to move it or keep a backup.')}
 <section class="card stack"><h2 class="h3">Appearance</h2><div class="seg" role="radiogroup" aria-label="Theme">${[['system','Match system'],['light','Light'],['dark','Dark']].map(t=>`<button role="radio" aria-checked="${S.theme===t[0]}" data-th="${t[0]}">${t[1]}</button>`).join('')}</div></section>
 <section class="card stack"><h2 class="h3">Answer effects</h2>
  <label class="chk big"><input type="checkbox" id="setFx" ${S.fx!==false?'checked':''}> Fireworks when you get it right, shake when it's wrong</label>
  <label class="chk big"><input type="checkbox" id="setMark" ${S.examMark!==false?'checked':''}> Show right and wrong as you answer in timed exams</label>
  <p class="muted small">Turn the second one off for a realistic exam rehearsal where you only see your score at the end. Once an exam answer is shown, it is locked.</p>
  <div class="row"><button class="btn sm" id="setTry">Try the fireworks</button></div></section>
 <section class="card stack"><h2 class="h3">Export progress</h2><p class="muted">Copy this text and save it somewhere safe (a note or email to yourself).</p><div class="row"><button class="btn" id="exMk">Show export</button><button class="btn" id="exCp" hidden>Copy to clipboard</button></div><textarea id="exT" rows="5" readonly hidden aria-label="Exported progress"></textarea></section>
 <section class="card stack"><h2 class="h3">Import progress</h2><p class="muted">Choose an exported file or paste exported text. This replaces your current progress.</p><div class="field"><label for="imF">File</label><input id="imF" type="file" accept=".json,.txt,application/json,text/plain"></div><div class="field"><label for="imT">Or paste</label><textarea id="imT" rows="4"></textarea></div><div class="row"><button class="btn" id="imGo">Import</button></div><div id="imC"></div></section>
 <section class="card stack danger"><h2 class="h3">Reset all progress</h2><p>This deletes your profile, plan, answers, notes, bookmarks, flashcard history and exam results in this browser. It cannot be undone. Export first if you might want it back.</p><div class="field"><label for="rsT">Type RESET to confirm</label><input id="rsT" autocomplete="off"></div><div class="row"><button class="btn bad" id="rsGo">Reset everything</button></div></section>
 <section class="card stack"><h2 class="h3">About</h2><p>Independent exam preparation. Not affiliated with, endorsed by or sponsored by the International Code Council. All questions are original practice items, not ICC exam questions. Code references are pointers to the 2018 IBC and the Concrete Manual; the text of the books is not reproduced. The code-book reader only opens PDF files you add yourself, and keeps them on your device. Items marked "Demonstration" are pending verification and never appear in scored exams.</p><p class="muted">Content: ${G.LESSONS.length} lessons · ${VER.length} verified questions · ${G.Q.length-VER.length} demonstration · ${G.SCENARIOS.length} scenarios · ${G.LOOKUPS.length} lookup drills · ${G.CARDS.length} seed flashcards.</p></section>`;
 m.querySelectorAll('[data-th]').forEach(b=>b.onclick=()=>{S.theme=b.dataset.th;applyTheme();save();vData(m)});
 $('#setFx').onchange=e=>{S.fx=e.target.checked;save();toast(S.fx?'Effects on':'Effects off')};$('#setMark').onchange=e=>{S.examMark=e.target.checked;save();toast(S.examMark?'Right/wrong shown during exams':'Answers hidden until you submit')};
 $('#setTry').onclick=e=>{window.G11FX.off=false;window.G11FX.right(e.target)};
 $('#exMk').onclick=()=>{const t=$('#exT');t.value=JSON.stringify(Object.assign({},S,{run:null,exported:new Date().toISOString(),app:'g11prep'}));t.hidden=false;$('#exCp').hidden=false;t.select()};
 $('#exCp').onclick=()=>{const t=$('#exT');navigator.clipboard&&navigator.clipboard.writeText(t.value).then(()=>toast('Copied'),()=>{t.select();toast('Press Ctrl+C or Cmd+C to copy')})||(t.select(),toast('Press Ctrl+C or Cmd+C to copy'))};
 $('#imF').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$('#imT').value=r.result};r.readAsText(f)};
 $('#imGo').onclick=()=>{let d;try{d=JSON.parse($('#imT').value)}catch(e){$('#imC').innerHTML='<p class="err">That text is not valid export data. Paste the full exported text.</p>';return}
  if(!d||d.app!=='g11prep'||d.v!==1){$('#imC').innerHTML='<p class="err">This does not look like a G11 Exam Prep export.</p>';return}
  $('#imC').innerHTML=`<div class="confirm"><b>Replace current progress with the export from ${esc(d.exported||'unknown date')}?</b><div class="row"><button class="btn primary" id="imY">Replace</button><button class="btn" id="imN">Cancel</button></div></div>`;
  $('#imY').onclick=()=>{S=Object.assign(blank(),d);delete S.exported;delete S.app;save();applyTheme();toast('Progress imported');go('home')};$('#imN').onclick=()=>$('#imC').innerHTML=''};
 $('#rsGo').onclick=()=>{if($('#rsT').value.trim()!=='RESET'){toast('Type RESET exactly to confirm');return}const th=S.theme;S=blank();S.theme=th;try{localStorage.removeItem(KEY)}catch(e){}save();toast('All progress reset');go('home')}}

/* ---------- boot ---------- */
const API={get S(){return S},save,toast,esc,head,say,go};
load();applyTheme();
$('#nav').innerHTML=NAV.map(n=>`<a href="#${n[0]}" data-r="${n[0]}">${n[1]}</a>`).join('');
$('#thBtn').onclick=()=>{S.theme=S.theme==='dark'?'light':S.theme==='light'?'system':'dark';applyTheme();save();toast('Theme: '+(S.theme==='system'?'match system':S.theme))};
route();
})();
