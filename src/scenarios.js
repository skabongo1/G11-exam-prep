/* ============================================================
   Branching scenarios. Each gen(rnd) returns a fresh variant.
   Step kinds: inspect, choice, multi, num, explain.
   All rules cited are checked against the 2018 IBC (1st printing).
   ============================================================ */
(function(){
const pick=(r,a)=>a[Math.floor(r()*a.length)];
const ceil=Math.ceil, fmt=n=>(+n).toLocaleString('en-US',{maximumFractionDigits:2});
const CODE='<span class="tag code">Code requirement</span>', BEST='<span class="tag best">Best practice, not code</span>', ASSUME='<span class="tag assume">Assumption</span>';

G11.SCENARIOS = [
/* ---------------- S1 Egress layout ---------------- */
{id:'S1', d:2, mod:'B', title:'Second-floor office: stair width check', blurb:'Evaluate an egress layout on a tenant floor.', gen(r){
  const A=pick(r,[4500,6000,7200,9000,12000]), W=pick(r,[34,36,40,44]);
  const OL=ceil(A/150), minW=OL<50?36:44, cap=+(OL*0.3).toFixed(1), req=Math.max(minW,cap), fail=W<req;
  const svg=`<svg viewBox="0 0 560 300" role="img" aria-label="Second floor plan with two stairs">
   <rect x="30" y="30" width="500" height="230" class="svwall"/>
   <rect x="40" y="40" width="70" height="90" class="svstair"/><text x="46" y="88" class="svl">STAIR 1</text>
   <rect x="450" y="160" width="70" height="90" class="svstair"/><text x="456" y="208" class="svl">STAIR 2</text>
   <text x="210" y="150" class="svt">OPEN OFFICE</text><text x="210" y="172" class="svl">${fmt(A)} sq ft gross</text>
   <text x="40" y="285" class="svl">Sheet A-201 · 2nd floor plan · NTS</text>
   <circle cx="125" cy="85" r="11" class="svpin"/><text x="121" y="90" class="svpt">1</text>
   <circle cx="435" cy="205" r="11" class="svpin"/><text x="431" y="210" class="svpt">2</text>
   <circle cx="300" cy="200" r="11" class="svpin"/><text x="296" y="205" class="svpt">3</text></svg>`;
  return {facts:`<ul class="tight"><li>Two-story office building. Second floor is one tenant, Group B business use.</li><li>Second floor area: <b>${fmt(A)} sq ft gross</b>, no fixed seating.</li><li>Two exit stairs serve the floor.</li><li>No emergency voice/alarm communication system is provided.</li><li>Code: 2018 IBC as given on the code summary sheet.</li></ul>`,
   svg, hot:[['1 · Stair 1 section','Clear width between handrails and walls: <b>'+W+' in</b>. Risers 7 in, treads 11 in.'],['2 · Stair 2 section','Clear width: <b>'+W+' in</b>. Same as Stair 1.'],['3 · Code summary sheet','Occupancy B. Occupant load not shown on drawings.']],
   steps:[
    {k:'choice',q:'What is the issue in what is shown?',o:[
      {t:'Stair width is below the code minimum',ok:fail,fb:fail?'Right. Compare the stair width with §1011.2 after computing the occupant load.':`Check again: ${W} in meets the ${req} in required here.`},
      {t:'Not enough exits from the story',ok:false,fb:`Two exits are provided. Table 1006.3.2 requires 2 for 1–500 occupants; this floor has ${OL}.`},
      {t:'No egress-width issue in what is shown',ok:!fail,fb:!fail?'Right. Calculated capacity and minimum width are both met.':`Not quite. ${W} in is less than the ${req} in required.`},
      {t:'Insufficient information to decide',ok:false,fb:'The facts are enough: use, gross area and stair width are given, and the voice-alarm exception is ruled out.'}]},
    {k:'choice',q:'Which references decide this?',o:[
      {t:'Table 1004.5, §1005.3.1 and §1011.2',ok:true,fb:'Right: occupant load factor, stair capacity factor, then the stair minimum width.'},
      {t:'Table 1017.2 only',ok:false,fb:'Table 1017.2 is travel distance, not width.'},
      {t:'§1015.3 and §1014.2',ok:false,fb:'Those are guard and handrail heights.'},
      {t:'§1020.4',ok:false,fb:'That is dead-end corridors.'}]},
    {k:'num',q:'What minimum clear width (inches) must each stair have?',ans:req,tol:0.05,unit:'in',fb:`Occupant load ${fmt(A)} ÷ 150 = ${OL}. Capacity ${OL} × 0.3 = ${cap} in. Minimum ${minW} in (§1011.2${OL<50?', Exception 1 for fewer than 50':''}). Larger governs: ${req} in.`},
    {k:'explain',html:`<p><b>Result:</b> required stair width ${req} in; provided ${W} in → <b>${fail?'does not comply':'complies'}</b>.</p>
     <ol class="tight"><li>Occupant load: ${fmt(A)} ÷ 150 gross (Table 1004.5, p. 259) = <b>${OL}</b>.</li><li>Stair capacity: ${OL} × 0.3 in (§1005.3.1, p. 260) = ${cap} in total.</li><li>Minimum width: ${minW} in (§1011.2, p. 276). The larger value governs each stair.</li><li>Exits: ${OL} occupants → 2 required (Table 1006.3.2, p. 263); 2 provided.</li></ol>
     <p>${ASSUME} Area is gross; business use only; no emergency voice/alarm system, so the 0.2 in stair exception does not apply.</p>
     <p>${CODE} Minimum width and capacity above. ${BEST} Wider stairs ease furniture moves and two-way traffic.</p>`}
   ]};
}},
/* ---------------- S2 Occupancy and sprinklers ---------------- */
{id:'S2', d:2, mod:'B', title:'Restaurant tenant: occupancy and sprinklers', blurb:'Review a proposed occupancy and its sprinkler trigger.', gen(r){
  const Dn=pick(r,[450,600,900,1200,1500]), K=pick(r,[400,600,800]);
  const F=Math.round((Dn*1.3+K+350)/50)*50;
  const OL=ceil(Dn/15)+ceil(K/200), A2=OL>=50;
  const levelKnown=r()<0.75;
  const trig=A2&&(F>5000||OL>=100), needLevel=A2&&!trig&&!levelKnown;
  const spr = !A2?'no': trig?'yes': needLevel?'insufficient':'no';
  const svg=`<svg viewBox="0 0 560 280" role="img" aria-label="Restaurant tenant floor plan">
   <rect x="30" y="30" width="500" height="210" class="svwall"/>
   <line x1="350" y1="30" x2="350" y2="240" class="svthin"/><line x1="350" y1="160" x2="530" y2="160" class="svthin"/>
   <text x="120" y="130" class="svt">DINING</text><text x="110" y="152" class="svl">${fmt(Dn)} sq ft net</text><text x="96" y="172" class="svl">tables and chairs</text>
   <text x="400" y="95" class="svt">KITCHEN</text><text x="392" y="117" class="svl">${fmt(K)} sq ft gross</text>
   <text x="380" y="205" class="svl">Restrooms / storage</text>
   <text x="40" y="265" class="svl">Tenant space total: ${fmt(F)} sq ft gross · one fire area</text>
   <circle cx="300" cy="60" r="11" class="svpin"/><text x="296" y="65" class="svpt">1</text>
   <circle cx="500" cy="60" r="11" class="svpin"/><text x="496" y="65" class="svpt">2</text></svg>`;
  const sprOpt=v=>v==='yes'?'Yes, §903.2.1.2 requires sprinklers':v==='no'?'No, §903.2.1.2 does not require them':'Insufficient information';
  return {facts:`<ul class="tight"><li>New restaurant in a tenant space; the tenant space is its own fire area of <b>${fmt(F)} sq ft</b>.</li><li>Dining: <b>${fmt(Dn)} sq ft net</b>, unconcentrated (tables and chairs). Kitchen: <b>${fmt(K)} sq ft gross</b> (commercial kitchen).</li><li>${levelKnown?'The tenant space is on the <b>level of exit discharge</b> (ground floor).':'<b>The drawings do not state which floor</b> the tenant space is on.'}</li><li>Code: 2018 IBC.</li></ul>`,
   svg, hot:[['1 · Dining area tag',`${fmt(Dn)} sq ft net; tables and chairs; no fixed seating.`],['2 · Kitchen tag',`${fmt(K)} sq ft gross; commercial kitchen.`]],
   steps:[
    {k:'num',q:'What is the occupant load of the tenant space?',ans:OL,tol:0,unit:'occupants',fb:`Dining ${fmt(Dn)} ÷ 15 net = ${ceil(Dn/15)}; kitchen ${fmt(K)} ÷ 200 gross = ${ceil(K/200)}; total ${OL} (Table 1004.5, rounded up each).`},
    {k:'choice',q:'How is the tenant space classified?',o:[
      {t:'Group A-2',ok:A2,fb:A2?'Right: food and drink assembly with 50 or more occupants (§303.3).':`With ${OL} occupants (fewer than 50), §303.1.1 classifies the tenant space as Group B.`},
      {t:'Group B',ok:!A2,fb:!A2?'Right: §303.1.1 makes an assembly tenant space with fewer than 50 occupants Group B.':`${OL} occupants is 50 or more, so it is A-2 (§303.3).`},
      {t:'Group M',ok:false,fb:'Mercantile is the sale of merchandise, not food and drink consumption.'},
      {t:'Insufficient information',ok:false,fb:'Use and occupant load are enough to classify it.'}]},
    {k:'choice',q:'Which section sets the occupant-load threshold you just applied?',o:[
      {t:'§303.1.1 Small buildings and tenant spaces',ok:true,fb:'Right (p. 45).'},
      {t:'§304.1 Business Group B',ok:false,fb:'§304.1 lists business uses; the < 50 rule for assembly tenant spaces is §303.1.1.'},
      {t:'§903.2.1.2',ok:false,fb:'That is the A-2 sprinkler trigger, used next.'},
      {t:'Table 1004.5',ok:false,fb:'That gives the factors, not the classification threshold.'}]},
    {k:'choice',q:'Does §903.2.1.2 require an automatic sprinkler system for this fire area?',o:['yes','no','insufficient'].map(v=>({t:sprOpt(v),ok:spr===v,fb:spr===v?'Right.':
      (!A2?'§903.2.1.2 applies to Group A-2; this tenant is Group B.': trig?`Triggered: ${F>5000?'fire area over 5,000 sq ft':''}${F>5000&&OL>=100?' and ':''}${OL>=100?'occupant load of 100 or more':''}.`: needLevel?'Area and occupant load do not trigger it, but the third condition (floor other than level of exit discharge) cannot be checked: the floor is not stated.':'None of the three conditions is met: area ≤ 5,000 sq ft, fewer than 100 occupants, on the level of exit discharge.')}))},
    {k:'explain',html:`<p><b>Result:</b> occupant load ${OL}; classification <b>${A2?'A-2':'B'}</b>; §903.2.1.2 sprinklers: <b>${spr==='yes'?'required':spr==='no'?'not required by this section':'cannot be decided yet'}</b>.</p>
     <ol class="tight"><li>Table 1004.5 (p. 259): unconcentrated assembly 15 net; commercial kitchens 200 gross.</li><li>§303.1.1 (p. 45): assembly tenant space under 50 → Group B. §303.3 (p. 46): restaurants → A-2.</li><li>§903.2.1.2 (p. 218): A-2 fire area > 5,000 sq ft, OR ≥ 100 occupants, OR on a floor other than the level of exit discharge.</li></ol>
     ${spr==='insufficient'?`<p><b>Missing information:</b> ask the architect which floor the tenant is on. If it is not the level of exit discharge, sprinklers are required.</p>`:''}
     <p>${ASSUME} The tenant space is one fire area; other building-wide sprinkler triggers are not evaluated here.</p><p>${CODE} Classification and §903.2.1.2. ${BEST} Many owners sprinkler restaurants even when not required, for insurance.</p>`}
   ]};
}},
/* ---------------- S3 Concrete placement plan ---------------- */
{id:'S3', d:3, mod:'A', title:'Footing and slab plan review', blurb:'Identify issues in a concrete placement plan before the pour.', gen(r){
  const T=pick(r,[3,3.5,4]), mil=pick(r,[4,6,10]), lap=pick(r,[4,6,12]);
  const frostKnown=r()<0.7, frost=pick(r,[30,36]), depth=pick(r,[24,30,36,42]);
  const items=[
    {id:'slab',t:`Slab thickness ${T} in`,bad:T<3.5,why:`§1907.1 requires at least 3½ in.`},
    {id:'mil',t:`Vapor retarder ${mil}-mil polyethylene`,bad:mil<6,why:'§1907.1 calls for 6-mil polyethylene or an approved equivalent.'},
    {id:'lap',t:`Vapor retarder laps ${lap} in`,bad:lap<6,why:'§1907.1 requires joints lapped at least 6 in.'},
    {id:'frost',t:`Footing bottom ${depth} in below undisturbed grade`,bad:frostKnown&&depth<frost,why:frostKnown?`Frost depth is ${frost} in; §1809.5 requires extending below the frost line (or another listed method).`:'Cannot be judged: frost depth is not given.'},
    {id:'missing',t:'Frost depth not provided; needed to check footing depth',bad:!frostKnown,why:'The jurisdiction sets the frost line. Without it, §1809.5 cannot be checked.'}
  ];
  const svg=`<svg viewBox="0 0 560 260" role="img" aria-label="Footing and slab section">
   <line x1="20" y1="90" x2="540" y2="90" class="svgrade"/><text x="440" y="82" class="svl">finish grade</text>
   <rect x="60" y="62" width="460" height="${T*6}" class="svconc"/><text x="300" y="58" class="svl">slab ${T} in</text>
   <line x1="60" y1="${62+T*6+3}" x2="520" y2="${62+T*6+3}" class="svvr"/><text x="300" y="${62+T*6+18}" class="svl">vapor retarder ${mil}-mil, ${lap} in laps</text>
   <rect x="40" y="62" width="30" height="${40+depth*2.4}" class="svconc"/><rect x="20" y="${92+depth*2.4}" width="70" height="26" class="svconc"/>
   <line x1="110" y1="90" x2="110" y2="${118+depth*2.4}" class="svdim"/><text x="116" y="${110+depth*1.2}" class="svl">${depth} in to bottom of footing</text>
   ${frostKnown?`<line x1="20" y1="${90+frost*2.4}" x2="260" y2="${90+frost*2.4}" class="svfrost"/><text x="150" y="${86+frost*2.4}" class="svl">frost line ${frost} in</text>`:''}
   <text x="300" y="245" class="svl">S-301 · Typical foundation section · NTS</text></svg>`;
  return {facts:`<ul class="tight"><li>One-story heated office building, slab on ground, continuous spread footings.</li><li>Plan notes are shown on the section. ${frostKnown?`The building department's design criteria list a <b>frost depth of ${frost} in</b>.`:'<b>No frost depth</b> is given on the drawings or in the project data.'}</li><li>Code: 2018 IBC.</li></ul>`,
   svg, hot:[['Slab and vapor retarder note',`Slab ${T} in; ${mil}-mil polyethylene vapor retarder; ${lap} in laps.`],['Footing note',`Bottom of footing ${depth} in below undisturbed grade; 12 in min width.`],['General notes',frostKnown?`Frost depth ${frost} in per jurisdiction.`:'No design criteria table on this set.']],
   steps:[
    {k:'multi',q:'Select every item that is a problem or needs information before approval.',items},
    {k:'choice',q:'Which section sets the slab thickness and vapor retarder requirements?',o:[
      {t:'§1907.1',ok:true,fb:'Right (p. 462).'},{t:'§1809.4',ok:false,fb:'Footing depth and width.'},{t:'§1805.3',ok:false,fb:'Waterproofing.'},{t:'Table 1806.2',ok:false,fb:'Presumptive bearing values.'}]},
    {k:'choice',q:'When may concrete be placed in the footings?',o:[
      {t:'As soon as excavation is complete',ok:false,fb:'The footing inspection comes first.'},
      {t:'After the footing inspection is approved: excavation complete, required reinforcing in place, forms in place for concrete foundations',ok:true,fb:'Right: §110.3.1 sets when the inspection is made, and §110.6 bars work beyond that point until approved.'},
      {t:'After the frame inspection',ok:false,fb:'Framing comes much later.'},
      {t:'Any time a special inspector is on site',ok:false,fb:'Special inspection does not replace the building official\'s footing inspection.'}]},
    {k:'explain',html:`<p><b>Findings:</b></p><ul class="tight">${items.map(i=>`<li>${i.bad?'❌':'✅'} ${i.t}: ${i.why}${i.bad?'':(i.id==='missing'?'':' OK.')}</li>`).join('')}</ul>
     <p>References: §1907.1 (p. 462), §1809.4–1809.5 (p. 443), §110.3.1 (p. 8), §110.6 (p. 9).</p>
     <p>${ASSUME} A heated office building: the §1809.5 exception for small free-standing Risk Category I buildings and the §1907.1 vapor retarder exceptions do not apply. ${BEST} 4 in slabs and 10- or 15-mil vapor retarders are common upgrades; the code minimum is 3½ in and 6-mil. ${CODE} Footings must also be at least 12 in below undisturbed ground (§1809.4).</p>`}
   ]};
}},
/* ---------------- S4 Framing inspection ---------------- */
{id:'S4', d:3, mod:'A', title:'Framing inspection: notches, holes and plates', blurb:'Inspect a floor and wall framing detail.', gen(r){
  const loc=pick(r,['near the end (bearing)','outer third of the span','middle third of the span']);
  const nd=pick(r,[1.25,1.5,2.0,2.5]);
  const sn=pick(r,[0.75,0.875,1.25]), sh=pick(r,[1.25,1.375,2.0]), sp=pick(r,[24,48,60]);
  const D=9.25, endLim=D/4, tbLim=D/6;
  const notchBad = loc.startsWith('near')? nd>endLim : (loc.startsWith('middle')? true : nd>tbLim);
  const items=[
    {id:'n',t:`2×10 joist: ${nd} in top notch, ${loc}`,bad:notchBad,why:loc.startsWith('near')?`End notches may be up to ¼ of depth: ${fmt(endLim)} in.`:loc.startsWith('middle')?'Top and bottom notches are not allowed in the middle third of the span.':`Top/bottom notches limited to ⅙ of depth: ${fmt(tbLim)} in.`},
    {id:'s',t:`Bearing-wall 2×4 stud notched ${sn} in`,bad:sn>0.875,why:'Bearing studs: 25% of 3½ in = 0.875 in.'},
    {id:'h',t:`Single bearing 2×4 stud with a ${sh} in bored hole`,bad:sh>1.4,why:'Bored holes up to 40% of 3½ in = 1.4 in (60% only if doubled or nonbearing).'},
    {id:'p',t:`Double top plate splices offset ${sp} in`,bad:sp<48,why:'End joints offset at least 48 in.'}
  ];
  const svg=`<svg viewBox="0 0 560 250" role="img" aria-label="Joist elevation and stud wall detail">
   <rect x="30" y="40" width="380" height="37" class="svwood"/><text x="40" y="34" class="svl">2×10 joist (9¼ in actual), simple span</text>
   <line x1="157" y1="80" x2="157" y2="96" class="svthin"/><line x1="283" y1="80" x2="283" y2="96" class="svthin"/><text x="180" y="110" class="svl">middle third</text>
   <rect x="${loc.startsWith('near')?34:loc.startsWith('outer')?100:210}" y="40" width="26" height="${nd*4}" class="svnotch"/>
   <rect x="440" y="40" width="14" height="150" class="svwood"/><rect x="470" y="40" width="14" height="150" class="svwood"/><rect x="500" y="40" width="14" height="150" class="svwood"/>
   <rect x="436" y="28" width="84" height="6" class="svwood"/><rect x="436" y="20" width="84" height="6" class="svwood"/>
   <rect x="470" y="100" width="${sn*4}" height="14" class="svnotch"/><circle cx="512" cy="150" r="${sh*2.4}" class="svnotch"/>
   <text x="430" y="214" class="svl">bearing wall, 2×4 studs</text><text x="30" y="240" class="svl">Field observations · NTS</text></svg>`;
  return {facts:`<ul class="tight"><li>Wood light-frame building, conventional construction under §2308.</li><li>Floor joists: sawn 2×10 (9¼ in actual). Studs: 2×4 (3½ in actual) in a bearing wall.</li><li>Observations from the frame walk are shown on the detail.</li><li>Code: 2018 IBC.</li></ul>`,
   svg, hot:[['Joist',`${nd} in deep notch at the top edge, ${loc}.`],['Stud wall',`One stud notched ${sn} in; another single stud bored ${sh} in.`],['Top plates',`Splices offset ${sp} in.`]],
   steps:[
    {k:'multi',q:'Select every observation that fails the code.',items},
    {k:'num',q:'For this 2×10, what is the maximum notch depth (inches) allowed in the top edge outside the middle third?',ans:+(tbLim).toFixed(2),tol:0.03,unit:'in',fb:`9.25 ÷ 6 = ${fmt(tbLim)} in (§2308.4.2.4).`},
    {k:'choice',q:'Which section limits stud notching in bearing walls?',o:[
      {t:'§2308.5.9',ok:true,fb:'Right (p. 520).'},{t:'§2308.5.10',ok:false,fb:'That is bored holes.'},{t:'§2308.4.2.4',ok:false,fb:'That is joists.'},{t:'§2308.5.3.2',ok:false,fb:'That is top plates.'}]},
    {k:'explain',html:`<ul class="tight">${items.map(i=>`<li>${i.bad?'❌':'✅'} ${i.t}: ${i.why}</li>`).join('')}</ul>
     <p>References: §2308.4.2.4 (p. 509), §2308.5.9 and §2308.5.10 (p. 520), §2308.5.3.2 (p. 519).</p>
     <p>${ASSUME} Sawn lumber under conventional light-frame rules. Engineered products (I-joists, trusses, SCL) may only be cut where the manufacturer or a registered design professional allows (§2308.4.3). ${BEST} Ask the engineer for a repair detail rather than adding scabs on your own.</p>`}
   ]};
}},
/* ---------------- S5 Corridor rating and dead end ---------------- */
{id:'S5', d:2, mod:'B', title:'Office corridor: rating and dead end', blurb:'Resolve a fire-resistance question and find missing information first.', gen(r){
  const OL=pick(r,[35,45,80,120]), status=pick(r,['yes','no','unknown','unknown']), hidden=pick(r,['yes','no']);
  const L=pick(r,[18,30,45,60]), Win=pick(r,[44,60]);
  const svg=`<svg viewBox="0 0 560 220" role="img" aria-label="Office corridor plan with dead end">
   <rect x="30" y="80" width="460" height="${Win/1.2}" class="svwall"/><rect x="490" y="70" width="34" height="${Win/1.2+20}" class="svexit"/><text x="494" y="62" class="svl">exit</text>
   <line x1="30" y1="160" x2="${30+L*3}" y2="160" class="svdim"/><text x="34" y="180" class="svl">dead end ${L} ft</text>
   <text x="200" y="${80+Win/2.4+5}" class="svl">corridor, ${Win} in clear</text>
   ${[90,170,250,330,410].map(x=>`<rect x="${x}" y="40" width="60" height="40" class="svthin2"/>`).join('')}
   <text x="30" y="210" class="svl">A-102 · Office suite corridor · NTS</text></svg>`;
  const known=status!=='unknown', sp=known?status:hidden;
  const rating=sp==='yes'?0:1, limit=sp==='yes'?50:20, deOK=L<=limit;
  const steps=[];
  if(!known){
    steps.push({k:'choice',q:'What fire-resistance rating do the corridor walls need?',o:[
      {t:'0 hours',ok:false,fb:'Only if the building is sprinklered. The drawings do not say.'},
      {t:'1 hour',ok:false,fb:'Only if the building is not sprinklered. The drawings do not say.'},
      {t:'2 hours',ok:false,fb:'Table 1020.1 does not require 2 hours for Group B corridors.'},
      {t:'Insufficient information: sprinkler status is needed',ok:true,fb:'Right. Table 1020.1 has separate columns for buildings with and without sprinklers.'}]});
    steps.push({k:'choice',q:'What do you ask the design team for?',o:[
      {t:'Whether the building is sprinklered throughout per §903.3.1.1 (NFPA 13)',ok:true,fb:`Answer received: the building ${hidden==='yes'?'<b>is</b> sprinklered throughout per §903.3.1.1':'is <b>not</b> sprinklered'}.`},
      {t:'The corridor paint color',ok:false,fb:'Not relevant to the rating.'},
      {t:'The number of offices',ok:false,fb:'Occupant load is already given.'},
      {t:'Nothing; assume sprinklers',ok:false,fb:'Never assume the condition that changes the answer.'}]});
  }
  steps.push({k:'choice',q:`${known?'':'Now that you know the sprinkler status: '}what rating do the corridor walls need?`,o:[
    {t:'0 hours',ok:rating===0,fb:rating===0?'Right: Group B, more than 30 occupants, with sprinklers.':'Without sprinklers, Group B corridors serving more than 30 need 1 hour.'},
    {t:'1 hour',ok:rating===1,fb:rating===1?'Right: Group B, more than 30 occupants, without sprinklers.':'With sprinklers, Table 1020.1 gives 0 hours.'},
    {t:'2 hours',ok:false,fb:'Not in Table 1020.1 for Group B.'}]});
  steps.push({k:'choice',q:`Is the ${L} ft dead end acceptable?`,o:[
    {t:'Yes',ok:deOK,fb:deOK?`Right: limit is ${limit} ft.`:`Limit is ${limit} ft, and the 2.5 × width exception does not apply (2.5 × ${Win} in = ${fmt(2.5*Win/12)} ft).`},
    {t:'No',ok:!deOK,fb:!deOK?`Right: ${L} ft exceeds the ${limit} ft limit.`:`${L} ft is within the ${limit} ft limit.`},
    {t:'Insufficient information',ok:false,fb:'Sprinkler status is now known, and length and width are given.'}]});
  steps.push({k:'explain',html:`<p><b>Result:</b> sprinklered: ${sp==='yes'?'yes (§903.3.1.1)':'no'} → corridor rating <b>${rating} hour${rating===1?'':'s'}</b>; dead-end limit <b>${limit} ft</b>; ${L} ft ${deOK?'complies':'does not comply'}.</p>
   <ol class="tight"><li>Table 1020.1 (p. 287): A, B, E, F, M, S, U with more than 30 occupants: 1 h without sprinklers, 0 h with.</li><li>§1020.4 (pp. 287–288): 20 ft; 50 ft in Group B sprinklered per §903.3.1.1; no limit where the dead end is shorter than 2.5 × its least width.</li></ol>
   <p>${ASSUME} Group B office; occupant load served by the corridor is ${OL}. ${CODE} Rating and dead-end limit. ${BEST} Ask for missing design criteria in writing (an RFI) instead of guessing.</p>`});
  return {facts:`<ul class="tight"><li>Office suite, Group B, single tenant floor.</li><li>Corridor serves <b>${OL} occupants</b>; clear width ${Win} in.</li><li>${known?(status==='yes'?'Code summary: building <b>sprinklered throughout per §903.3.1.1</b>.':'Code summary: building <b>not sprinklered</b>.'):'<b>The code summary sheet is missing</b>; sprinkler status is not stated anywhere in the set.'}</li><li>Code: 2018 IBC.</li></ul>`,
   svg, hot:[['Corridor',`${Win} in clear; serves ${OL}.`],['Dead end',`${L} ft from the end of the corridor to the point where two directions of travel are available.`],['Code summary',known?(status==='yes'?'Sprinklered throughout (NFPA 13).':'Not sprinklered.'):'Sheet missing from the set.']],
   steps};
}}
];
})();
