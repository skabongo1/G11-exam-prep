/* ============================================================
   ToonBee Method · Concrete Manual, batch 2 (Ch. 1–12 and 16).
   Facts come from (a) verified bank questions and (b) answers confirmed by the
   2021 Concrete Manual Workbook answer key, with the Manual section it cites.
   New questions are original wording; field wk = workbook chapter-item that confirms the fact.
   ============================================================ */
(function(){
const E=G11.TOON.episodes, RM=G11.TOON.roadmap.CM;
const A=(q,o,a,fb)=>({q,o,a,fb});
const ep=x=>{x.status='ready';x.book='CM';x.n=1;E.push(x)};
// Ch. 1–2 and 9–10 are taught together.
RM.splice(RM.findIndex(r=>r[0]===2),1);RM.find(r=>r[0]===1)[1]='Fundamentals and The Fresh Concrete (Ch. 1–2)';
RM.splice(RM.findIndex(r=>r[0]===10),1);RM.find(r=>r[0]===9)[1]='Water and Admixtures; Accessory Materials (Ch. 9–10)';
const CH={1:'Fundamentals of Concrete',2:'The Fresh Concrete',3:'The Strength of Concrete',4:'The Durability of Concrete',5:'Volume Changes and Other Properties',6:'Cracks and Blemishes',7:'Portland Cement',8:'Aggregates',9:'Water and Admixtures',10:'Accessory Materials',11:'Formwork',12:'Proportioning the Concrete Mixture',16:'Slabs-on-Ground'};
const NO='Not the value or rule the Manual gives.';
const W=(id,ch,sec,wk,q,o,a,ex)=>({id,d:3,s:ch===16?'Floors':'Concrete',df:2,q,o,a,ex,w:o.map((_,i)=>i===a?null:NO),r:'Concrete Manual '+sec,p:null,f:'Concrete Manual → Chapter '+ch+', '+CH[ch]+' → '+sec,v:true,b:'CM',ch,wk});
const P='Concrete Manual Chapter ';

/* ---------- Ch. 16 Slabs-on-Ground ---------- */
ep({id:'C16-1',ch:16,part:P+'16',title:'Slab Day',
 blurb:'A warehouse floor and a sidewalk. Subgrade, vapor retarder, screeds, spreading, joints and slope.',
 scenes:[
 {who:'N',say:'Tomorrow the crew places a 6-inch warehouse slab. Today Luis walks the subgrade with Maya.',look:['subgrade','vapor retarder','slab-on-ground']},
 {who:'M',say:'The subgrade comes first. A dry subgrade pulls water out of the slab.',
  ask:A('Before the slab is placed, the subgrade should be:',['Left dry','Saturated about one day before and damp (not muddy) when concrete is placed','Frozen','Flooded during placement'],1,'16.1. Never place on a frozen subgrade (Ch. 19).')},
 {who:'L',say:'The floor will get vinyl tile, and there is moisture in the ground.',
  ask:A('An interior floor slab with moisture under it should be built on:',['Bare soil','A vapor retarder, lapped at least 6 in with penetrations sealed','Sand only','Plywood'],1,'16.1 (bank: laps at least 6 in, penetrations sealed).')},
 {who:'N',say:'The finishers set a wet screed along the wall.',
  ask:A('A wet screed is a strip of concrete about how wide, placed just before the slab?',['2 in','6 in','12 in','24 in'],1,'16.1.')},
 {who:'M',say:'Someone grabbed a rake to spread the concrete.',
  ask:A('Rakes should not be used to spread slab concrete because they cause:',['Bleeding','Segregation','Air loss','Cold joints'],1,'Ch. 16 (bank). A darby or a bullfloat is used, one or the other, before bleed water appears.')},
 {who:'L',say:'Now joints. The slab is 6 inches thick.',look:['contraction joints'],
  ask:A('Contraction joint spacing should not exceed about how many times the slab thickness (normal shrinkage)?',['10','20','30','50'],2,'16.2: 30 × 6 in = 180 in = 15 ft. Sawed joints are usually cut about 4–12 hours after placing.')},
 {who:'M',say:'Where the new slab meets the old loading dock, the slabs have to move independently.',
  ask:A('Isolation joints allow a slab to:',['Bond to the old slab','Move vertically and horizontally','Hold more load','Skip curing'],1,'16.2. The filler goes full depth and not above the surface.')},
 {who:'N',say:'Outside, the sidewalk and the wash bay need to drain.',
  ask:A('Minimum drainage slope: interior slabs ___ per foot; exterior slabs ___ per foot.',['1/16 in; 1/8 in','1/8 in; 1/4 in','1/4 in; 1/2 in','1/2 in; 1 in'],1,'16.1. Anything less is likely to pond.')},
 {who:'N',say:'Method recap: subgrade, vapor retarder, screeds, spreading, joints and slope. Each step has a number in Chapter 16.'}],
 recap:[['Subgrade and vapor retarder','16.1','Ch. 16'],['Screeds, spreading, bullfloating','16.1','Ch. 16'],['Drainage slope','16.1','Ch. 16'],['Contraction and isolation joints','16.2','Ch. 16'],['Floor classes and slump','16.3','Ch. 16']],
 exam:['w1601','w1602','w1603','w1604','w1605','g038','g039','g040','c102','c103','c104','c105','c106','c107','c108','c110'],
 next:'Next: back to basics. What concrete is, and how fresh concrete behaves.'});

/* ---------- Ch. 1–2 ---------- */
ep({id:'C01-1',ch:1,part:P+'1–2',title:'What Concrete Is, and How It Behaves Fresh',
 blurb:'Luis\'s first week. Hydration, mortar versus grout, green concrete, workability, bleeding and air.',
 scenes:[
 {who:'N',say:'Luis\'s first week on a concrete crew. Maya starts with the basics.',look:['hydration','water-cement ratio']},
 {who:'M',say:'Concrete does not dry to get hard. Why does it gain strength?',
  ask:A('Portland cement concrete gains strength mainly because:',['Water evaporates','Cement reacts chemically with water (hydration), which also produces heat','The sand compacts','Air escapes'],1,'1.2 (bank and workbook): hydration produces heat. It nearly stops as temperatures approach freezing.')},
 {who:'L',say:'Mortar, grout, concrete. What is the difference?',
  ask:A('A pourable mix of cement and water, with or without sand, wetter than mortar, is:',['Concrete','Mortar','Grout','Slurry wall'],2,'Ch. 1 (bank). Cement, water and sand with no coarse aggregate is mortar.')},
 {who:'M',say:'And the first law of concrete?',
  ask:A('The first law of concrete to be researched and observed is the:',['Slump law','Water-cement ratio','Fineness modulus','Maturity rule'],1,'1.1.')},
 {who:'N',say:'They strip a wall the next morning. It is still dark and soft.',
  ask:A('Freshly stripped concrete that is still wet, weak and must stay supported is called:',['Green concrete','Plastic concrete','Lean concrete','Cold concrete'],0,'Ch. 1. Fresh concrete is plastic (1.3).')},
 {who:'M',say:'Chapter 2: fresh concrete. Workability is one of its most important properties.',look:['workability','bleeding'],
  ask:A('Water rises to the top of a fresh slab. The finisher should:',['Trowel it in','Wait until it disappears','Dust it with cement','Broom it'],1,'Ch. 2 and 17.1: never work the surface while bleed water is present.')},
 {who:'L',say:'How much air is in concrete without an air-entraining agent?',
  ask:A('Air in nonair-entrained concrete is about:',['0%','1–2%','4–7%','10%'],1,'2.8.')},
 {who:'M',say:'A harsh, unworkable mix. What usually causes it?',
  ask:A('A harsh and unworkable mix can result from:',['High cement content','Low cement content','Too much air','Cold water'],1,'2.4.')},
 {who:'N',say:'Method recap: Chapter 1 gives the vocabulary; Chapter 2 tells you how fresh concrete should behave and what to do when it does not.'}],
 recap:[['History and the water-cement ratio law','1.1','Ch. 1'],['Hydration','1.2','Ch. 1'],['Fresh concrete is plastic','1.3','Ch. 1'],['Five fundamentals of durable concrete','1.8','Ch. 1'],['Workability and cohesiveness','2.1 · 2.2','Ch. 2'],['Harshness and segregation','2.4 · 2.5','Ch. 2'],['Air in fresh concrete','2.8','Ch. 2']],
 exam:['g000','g001','c000','c003','c004','c002','w0101','w0102','g004','c005','c006','c008','c009','w0201','w0202'],
 next:'Next: strength. How it is measured and what lowers it.'});

/* ---------- Ch. 3 ---------- */
ep({id:'C03-1',ch:3,part:P+'3',title:'How Strong Is It?',
 blurb:'Cylinders, beams, cores and a fire in the boiler room. Strength age, temperature and the tests for it.',
 scenes:[
 {who:'N',say:'The structural drawings say f′c = 4,000 psi. Luis asks what that number really means.',look:['compressive strength','acceptance']},
 {who:'M',say:'Read the age. Acceptance strength is measured at a set age.',
  ask:A('For evaluation and acceptance, compressive strength tests are usually made at:',['3 days','7 days','28 days','90 days'],2,'3.3.')},
 {who:'L',say:'Is there a minimum for structural concrete?',
  ask:A('Minimum specified compressive strength for structural concrete:',['2,000 psi','2,500 psi','3,000 psi','4,000 psi'],1,'3.2 (ACI 318). Foundations in Seismic Design Category D, E or F need at least 3,000 psi.')},
 {who:'M',say:'Temperature matters more than people think.',
  ask:A('Other factors aside, the best range of temperature for placing concrete is:',['32–50 °F','40–80 °F','70–100 °F','Above 90 °F'],1,'3.11. Concrete made and cured at 50 °F is weaker at 3 days but stronger at 28 days than concrete made and cured at 90 °F.')},
 {who:'N',say:'The engineer also wants flexural and tensile strength.',look:['modulus of rupture','split cylinder'],
  ask:A('Tensile strength of concrete is measured indirectly with:',['A slump cone','A split cylinder test','A Swiss hammer','A core'],1,'3.5. Flexural strength (modulus of rupture) is tested on 6 × 6 in beams with third-point loading (3.4).')},
 {who:'L',say:'They cored a column top and bottom.',
  ask:A('Compared with cores from near the bottom of a column, cores from near the top usually show:',['Higher strength','Lower strength','The same','No strength'],1,'3.7.')},
 {who:'M',say:'A boiler-room fire heated a wall for hours.',
  ask:A('Concrete heated to 800 °F for a long time and then cooled loses about how much strength permanently?',['10%','25%','50%','None'],2,'Table 3.5. Load-bearing members exposed to continuous heat over 500 °F should generally be avoided (3.17).')},
 {who:'N',say:'Method recap: know the test, the age and the conditions. The number on the drawings only means something with the test behind it.'}],
 recap:[['Minimum strength','3.2','Ch. 3'],['Acceptance age','3.3','Ch. 3'],['Flexural and tensile strength','3.4 · 3.5','Ch. 3'],['Cores and specimens','3.7','Ch. 3'],['Factors affecting strength (temperature, W/C)','3.11','Ch. 3'],['Accelerating strength','3.13','Ch. 3'],['Heat effects','Table 3.5 · 3.17','Ch. 3']],
 exam:['w0301','a087','c010','w0302','w0303','c012','w0304','w0305','w0306','w0307','g007','c011','c013','c014','c016','g006'],
 next:'Next: durability. Freezing, salts, seawater and reactive aggregate.'});

/* ---------- Ch. 4 ---------- */
ep({id:'C04-1',ch:4,part:P+'4',title:'Will It Last?',
 blurb:'A parking deck in Colorado and a seawall on the coast. Freezing, de-icers, reactive aggregate and seawater.',
 scenes:[
 {who:'N',say:'Maya\'s company bids a Colorado parking deck. Snow, de-icing salt and freeze-thaw every winter.',look:['durability','freeze-thaw']},
 {who:'M',say:'Poor durability is almost never the cement\'s fault.',
  ask:A('Poor durability in concrete is rarely caused by:',['Workmanship','Cement','Exposure','Water content'],1,'4.2.')},
 {who:'L',say:'What if a pour freezes before it sets?',
  ask:A('Freezing in the plastic state can reduce durability, weather resistance and strength by as much as:',['10%','One-quarter','One-half','Nothing'],2,'4.5.')},
 {who:'M',say:'Exterior slabs need entrained air and time to dry before the first freeze.',
  ask:A('Recommended air content for exterior slabs exposed to freezing is about:',['1–2%','4–7%','10–12%','0%'],1,'Ch. 4 (bank). They should also air-dry about 30 days after moist curing before freeze-thaw exposure.')},
 {who:'N',say:'The owner wants to use a cheap de-icer.',
  ask:A('Which de-icing agent is NOT recommended?',['Sodium chloride','Calcium chloride','Ammonium sulfate','Sand'],2,'4.3. Ammonium salts release ammonia and hydrogen ions that attack concrete.')},
 {who:'L',say:'The aggregate pit has chert in it.',look:['reactive aggregate'],
  ask:A('Which is considered a reactive aggregate?',['Granite','Limestone','Chert','Basalt'],2,'4.4. Map cracking that widens over years is typical of alkali-silica reaction.')},
 {who:'M',say:'And the seawall job.',
  ask:A('Concrete in seawater should use which cement and avoid which admixture?',['Type III; air-entraining agent','Type II or V (low C3A); calcium chloride','Type I; retarder','Type IV; water reducer'],1,'Ch. 4 (bank); 12.1 sets Type II, w/c not over 0.50 and 4,000 psi for seawater. Cover in seawater is commonly 3 in.')},
 {who:'N',say:'Method recap: identify the exposure (freezing, salts, chemicals, seawater, abrasion), then read the protection the Manual gives for it.'}],
 recap:[['Causes of poor durability','4.1 · 4.2','Ch. 4'],['Chemical attack and de-icers','4.3','Ch. 4'],['Reactive aggregates','4.4','Ch. 4'],['Freezing in the plastic state','4.5','Ch. 4'],['Seawater exposure','Ch. 4 · 12.1','Ch. 4'],['Cavitation','4.10','Ch. 4']],
 exam:['w0401','w0402','w0403','w0404','c019','c020','c018','g008','g009','c017','c021','w0405'],
 next:'Next: concrete moves. Shrinkage, temperature and watertightness.'});

/* ---------- Ch. 5 ---------- */
ep({id:'C05-1',ch:5,part:P+'5',title:'Concrete Moves',
 blurb:'A long slab shrinks, a hot day expands it, and a basement leaks. Shrinkage, thermal movement and watertightness.',
 scenes:[
 {who:'N',say:'An 80-foot slab has cracked across the middle. The owner asks why concrete "moves."',look:['drying shrinkage','volume change']},
 {who:'M',say:'Water is the big driver of shrinkage.',
  ask:A('A critical factor for minimizing shrinkage is:',['Cement brand','Total water per cubic yard','Form type','Slab color'],1,'5.1. Calcium chloride used as an accelerator increases shrinkage.')},
 {who:'L',say:'How much does normal concrete shrink?',
  ask:A('Typical drying shrinkage of normal concrete is about:',['0.004–0.006%','0.04–0.06%','0.4–0.6%','4–6%'],1,'Ch. 5 (bank). 0.05% is about 1/16 in in 10 ft.')},
 {who:'M',say:'Temperature moves it too.',
  ask:A('The property that shows how concrete changes volume with temperature is its:',['Modulus of rupture','Coefficient of expansion','Fineness modulus','k value'],1,'5.7. With about 5.5 millionths per °F, an 80 ft slab cooling 50 °F shortens about ¼ in.')},
 {who:'N',say:'Hot, dry wind on the slab during finishing.',
  ask:A('The main causes of high evaporation from fresh concrete are:',['High humidity and calm air','Low humidity and wind (air temperature also matters)','Shade','Cold water'],1,'5.1.')},
 {who:'L',say:'And the leaking basement?',look:['watertightness'],
  ask:A('Lack of watertightness can almost always be traced to:',['The cement type','Poor construction practices','Too much curing','Air entrainment'],1,'5.11. Watertight concrete (exposure class W1) needs a maximum w/cm of 0.50.')},
 {who:'N',say:'Method recap: shrinkage and thermal movement are normal. Control them with water content, joints and good practice.'}],
 recap:[['Shrinkage and evaporation','5.1','Ch. 5'],['Volume change','5.2','Ch. 5'],['Coefficient of expansion','5.7','Ch. 5'],['Modulus of elasticity and k value','5.8','Ch. 5'],['Watertightness','5.11','Ch. 5']],
 exam:['w0501','w0502','w0503','w0504','w0505','g010','c022','c023','c024','c025','c026'],
 next:'Next: cracks and blemishes, and how to fix them.'});

/* ---------- Ch. 6 ---------- */
ep({id:'C06-1',ch:6,part:P+'6',title:'Cracks, Popouts and Patches',
 blurb:'A punch list of defects. Plastic and drying shrinkage cracks, efflorescence, popouts, scaling and repairs.',
 scenes:[
 {who:'N',say:'Final walkthrough of a parking garage. The owner has a list of every crack and stain.',look:['cracks','blemishes','repair']},
 {who:'M',say:'First, when did the crack happen? Plastic or hardened?',
  ask:A('Which is NOT a crack that forms while concrete is still plastic?',['Plastic shrinkage','Settlement','Drying shrinkage','Form movement'],2,'6.2. Drying shrinkage cracks come from water loss after the concrete hardens (6.4).')},
 {who:'L',say:'There is white powder on the wall.',
  ask:A('Crystalline salts deposited on the surface as water evaporates are called:',['Laitance','Efflorescence','Scaling','Dusting'],1,'6.16.')},
 {who:'N',say:'Little cone-shaped pieces broke out of the slab.',
  ask:A('A small cone-shaped piece breaking away from a slab surface is a:',['Spall','Popout','Pit','Blister'],1,'6.20. Thin flakes peeling off the surface is scaling (6.18).')},
 {who:'M',say:'Joints control many cracks. Read the joint spacing for walls.',
  ask:A('Contraction joints in foundation walls are spaced at no more than about:',['10 ft','20 ft','40 ft','60 ft'],1,'Ch. 6 (bank): and they reduce the wall thickness by at least 20%.')},
 {who:'L',say:'How do we repair the bad areas?',look:['repair'],
  ask:A('The first step in repairing concrete is to:',['Patch immediately','Diagnose the damage, including its cause and extent','Paint it','Seal it'],1,'6.21. Preparation begins by removing unsound concrete (6.22).')},
 {who:'M',say:'A bonded overlay on the worn ramp.',
  ask:A('A bonded overlay for slab repair should be at least:',['½ in','1 in','2 in','4 in'],1,'6.26.')},
 {who:'N',say:'Method recap: identify the defect and when it formed, then find its section for cause and repair.'}],
 recap:[['Plastic cracks','6.2 · 6.3','Ch. 6'],['Drying shrinkage cracks','6.4','Ch. 6'],['Joints and isolation','6.6 · 6.9','Ch. 6'],['Discoloration and efflorescence','6.15 · 6.16','Ch. 6'],['Scaling and popouts','6.18 · 6.20','Ch. 6'],['Repairs','6.21 – 6.27','Ch. 6']],
 exam:['w0601','w0602','w0603','w0604','w0605','w0606','g011','c030','c029','c031','c032','c033','g012','c027'],
 next:'Next: portland cement, the types and what each is for.'});

/* ---------- Ch. 7 ---------- */
ep({id:'C07-1',ch:7,part:P+'7',title:'Choosing the Cement',
 blurb:'Five jobs, five cements. Types I to V, blended cements, pozzolans and storage.',
 scenes:[
 {who:'N',say:'The batch plant offers several cements. Maya quizzes Luis on which job gets which.',look:['cement type','ASTM C150']},
 {who:'L',say:'The precast yard needs strength fast.',
  ask:A('Which cement type is used when high early strength is wanted?',['Type I','Type II','Type III','Type IV'],2,'7.4. Type III concrete at 7 days is roughly equal to Type I at 28 days.')},
 {who:'M',say:'A dam needs the opposite: low heat.',
  ask:A('Type IV cement, low heat of hydration, is used in mass concrete such as:',['Sidewalks','Large dams','Precast beams','Driveways'],1,'7.4.')},
 {who:'L',say:'And high sulfate soils?',
  ask:A('Which cement type is for high sulfate resistance?',['Type II','Type III','Type V','Type IP'],2,'Ch. 7 (bank).')},
 {who:'N',say:'The supplier lists Type IS, IP, IL and IT.',look:['blended cement'],
  ask:A('Portland limestone cement is designated:',['Type IS','Type IP','Type IL','Type IT'],2,'7.5: IS slag, IP pozzolan, IL limestone, IT ternary blended.')},
 {who:'M',say:'What controls the setting time of portland cement?',
  ask:A('A small amount of ___ is interground with the clinker to control setting time.',['Fly ash','Gypsum','Lime','Calcium chloride'],1,'7.2. Specific gravity of portland cement is about 3.15 (7.9).')},
 {who:'L',say:'The cement bags are stacked in the shed.',
  ask:A('Cement sacks may be stacked directly on a warehouse floor:',['Never','If no moisture comes through the floor','Only in summer','Only on pallets outdoors'],1,'7.10. Bags of different brands are stored and used separately.')},
 {who:'N',say:'Method recap: match the job (early strength, low heat, sulfates) to the cement type, then read the storage and blending rules.'}],
 recap:[['Making cement','7.2','Ch. 7'],['Cement types I–V','7.4','Ch. 7'],['Blended cements','7.5','Ch. 7'],['Fineness and properties','7.8 · 7.9','Ch. 7'],['Storage','7.10','Ch. 7'],['Pozzolans, fly ash, silica fume','7.11','Ch. 7']],
 exam:['w0701','w0702','w0703','w0704','w0705','g013','g014','g015','c035','c036','c038','c040','c041','c042','c043'],
 next:'Next: aggregates, the 60–80% of the mix.'});

/* ---------- Ch. 8 ---------- */
ep({id:'C08-1',ch:8,part:P+'8',title:'Rock and Sand',
 blurb:'A new gravel pit wants to supply the job. Grading, shape, absorption, deleterious substances, stockpiles and sampling.',
 scenes:[
 {who:'N',say:'A new pit offers cheaper aggregate. Maya sends Luis to check it.',look:['aggregate','ASTM C33']},
 {who:'M',say:'Aggregate is most of the concrete.',
  ask:A('Aggregates occupy about how much of concrete volume?',['20–40%','40–60%','60–80%','90%'],2,'8.0.')},
 {who:'L',say:'Where is the line between sand and gravel?',
  ask:A('Fine aggregate (sand) passes which sieve?',['No. 4','No. 8','No. 100','No. 200'],0,'8.4.')},
 {who:'M',say:'The pit\'s rock is sharp and angular.',
  ask:A('Which particle shape tends to make a harsh mix?',['Rounded','Angular','Cubical','Smooth'],1,'8.3. A rough texture does give better bond with the paste.')},
 {who:'N',say:'The sand has some clay lumps.',
  ask:A('Clay lumps and friable particles in fine aggregate are limited to about:',['0.5%','3%','10%','No limit'],1,'8.3 and ASTM C33 (bank).')},
 {who:'L',say:'The stockpile is one tall cone.',look:['stockpiling','segregation'],
  ask:A('To avoid segregation in stockpiles:',['Build high cone-shaped piles','Handle as few times as possible, avoid high cones, stockpile in layers and remove in vertical slices','Drop from conveyors','Mix all sizes together'],1,'8.6.')},
 {who:'M',say:'Now sample it.',
  ask:A('A sand sample for testing should be about:',['5 lb','10 lb','50 lb','500 lb'],2,'8.7. Coarse aggregate samples are reduced by quartering.')},
 {who:'N',say:'Method recap: check grading, shape, absorption and harmful substances against the limits, then stockpile and sample correctly.'}],
 recap:[['Classes of rock','8.1','Ch. 8'],['Characteristics and limits','8.3','Ch. 8'],['Grading and beneficiation','8.4','Ch. 8'],['Stockpiling','8.6','Ch. 8'],['Sampling','8.7','Ch. 8']],
 exam:['w0801','w0802','w0803','w0804','w0805','w0806','c044','c046','c047','c048','g016','g017','c049','c050','c051'],
 next:'Next: water and admixtures.'});

/* ---------- Ch. 9–10 ---------- */
ep({id:'C09-1',ch:9,part:P+'9–10',title:'Water, Admixtures and Sealants',
 blurb:'The admixture truck shows up with five jugs. Water quality, accelerators, retarders, air, superplasticizers, then sealants and epoxies.',
 scenes:[
 {who:'N',say:'The plant manager shows Luis the admixture dispensers.',look:['admixture','mixing water']},
 {who:'M',say:'Water first. Can we use the farm well?',
  ask:A('Which is an acceptable source of mixing water?',['A stream with sugar or tannic acid','A private well','Seawater','Wash water from trucks'],1,'9.1. Questionable water is acceptable if its 7-day cylinders reach at least 90% of control cylinders.')},
 {who:'L',say:'What does a retarder do?',
  ask:A('A retarder:',['Speeds hydration','Slows hydration','Adds air','Colors concrete'],1,'9.2. An accelerator speeds setting and early strength. Calcium chloride is limited to 2% by weight of cement and never used in prestressed concrete.')},
 {who:'M',say:'Can anything lower the freezing point safely?',
  ask:A('Is there a material that lowers the freezing point of fresh concrete without damaging it?',['Yes, antifreeze','Yes, salt','No','Yes, alcohol'],2,'9.2.')},
 {who:'N',say:'Air content for a moderate freeze-thaw exposure with ¾-inch aggregate.',look:['air entrainment'],
  ask:A('Total air content, moderate exposure, ¾ in maximum aggregate:',['2%','5%','8%','12%'],1,'9.2. Severe exposure (F2/F3) with ¾ in aggregate is about 6%. Delivered air tolerance is ±1.5%.')},
 {who:'L',say:'Two admixtures in the same dispenser?',
  ask:A('When more than one admixture is used, they should:',['Be premixed','Not be intermixed before entering the mixer unless the manufacturers allow it','Be added to the cement','Be doubled'],1,'9.2. Calcium chloride and air-entraining agent are added separately.')},
 {who:'M',say:'Chapter 10, accessory materials: epoxy for the crack repair.',look:['epoxy','sealant'],
  ask:A('Epoxy resins usually consist of:',['One part','A basic resin and a curing agent','Cement and sand','Rubber and water'],1,'10.3. Epoxy will not normally adhere to greased surfaces. Epoxy systems are covered by ASTM C881.')},
 {who:'N',say:'Method recap: identify what the admixture or material must do, then read its limits and how it is dispensed.'}],
 recap:[['Mixing water','9.1','Ch. 9'],['Admixtures (accelerators, retarders, air, superplasticizers)','9.2 · 9.3','Ch. 9'],['Sealants','10.1 · 10.2','Ch. 10'],['Epoxy resins','10.3','Ch. 10'],['Surface retarders','10.7','Ch. 10']],
 exam:['w0901','w0902','w0903','w0904','w0905','g018','g019','g020','g021','c052','c053','c054','c058','c060','w1001','w1002','c061'],
 next:'Next: formwork.'});

/* ---------- Ch. 11 ---------- */
ep({id:'C11-1',ch:11,part:P+'11',title:'Building the Forms',
 blurb:'Wall forms, shores and camber. Ties, form oil, chamfers, form pressure and the next lift.',
 scenes:[
 {who:'N',say:'The carpenters build forms for a 10-ft wall and a suspended slab.',look:['formwork','ties','shores']},
 {who:'M',say:'Most forms are still made of one material.',
  ask:A('The most common material used for forms is:',['Steel','Aluminum','Wood','Plastic'],2,'11.2.')},
 {who:'L',say:'How much pressure is on the bottom of this wall form?',
  ask:A('Fully fluid concrete 10 ft deep (150 pcf) exerts about:',['150 psf','750 psf','1,500 psf','3,000 psf'],2,'Ch. 11 (bank): forms are designed for concrete as a fluid of about 145–150 pcf.')},
 {who:'M',say:'The slab forms should be cambered.',
  ask:A('A common camber allowance for suspended slab and beam forms is:',['⅛ in per 10 ft','¼ in per 16 ft of span','1 in per 10 ft','None'],1,'11.1, to allow for sagging or settlement.')},
 {who:'N',say:'The crew grabs used motor oil for form release.',
  ask:A('Which is NOT used as a form oil or compound?',['Commercial form oil','Motor oil','Form coating','Release agent'],1,'11.5. Release agent must not be applied to reinforcing steel or construction joints.')},
 {who:'L',say:'The wall goes in two lifts.',
  ask:A('To avoid a disfiguring joint between lifts, form anchorages are set about how far below the top of the lift?',['1 in','4 in','12 in','24 in'],1,'11.1.')},
 {who:'M',say:'The edges will be exposed.',
  ask:A('To bevel the edges of exposed concrete, place ___ in the form corners.',['Spreaders','Chamfer strips','Snap ties','Sonotubes'],1,'11.1. Wood spreaders are removed as the concrete rises.')},
 {who:'N',say:'Method recap: material, pressure, camber, release agent, ties and lifts. Shores never go on frozen ground.'}],
 recap:[['Form design, camber, lifts, chamfers','11.1','Ch. 11'],['Form materials','11.2 · 11.3','Ch. 11'],['Ties','11.4','Ch. 11'],['Form oils','11.5','Ch. 11'],['Shoring and reshoring','11.6','Ch. 11'],['Slipforms and modular forms','11.7 · 11.9','Ch. 11']],
 exam:['w1101','w1102','w1103','w1104','w1105','g022','g023','c062','c063','c064','c065','c066','c067','c068'],
 next:'Next: proportioning the mix.'});

/* ---------- Ch. 12 ---------- */
ep({id:'C12-1',ch:12,part:P+'12',title:'Designing the Mix',
 blurb:'A mix submittal lands on Maya\'s desk. Aggregate size limits, W/C for exposure, trial batches and yield.',
 scenes:[
 {who:'N',say:'The supplier submits a mix for a 5-inch slab with bars at 4 inches clear.',look:['mix proportions','maximum size aggregate']},
 {who:'M',say:'Start with maximum aggregate size. There are three limits.',
  ask:A('Maximum aggregate size may not exceed one-third of the slab depth, three-quarters of the clear bar spacing, or ___ of the narrowest form dimension.',['One-half','One-third','One-fifth','One-tenth'],2,'12.3.')},
 {who:'L',say:'So for a 5-inch slab, one-third is about 1⅝ inches.',
  ask:A('All aggregate particles in concrete should be:',['Dry','Surrounded by paste','Flat','The same size'],1,'12.0.')},
 {who:'M',say:'No test history from this plant.',
  ask:A('Without enough field test results for statistics, the mix proportions are found by:',['Guessing','Laboratory trial batches','Copying another job','Adding cement'],1,'12.1. Statistical proportioning (f′cr) is now in ACI 301 4.2.3.')},
 {who:'N',say:'Part of the job is a seawall.',look:['exposure'],
  ask:A('Concrete exposed to seawater: cement type and maximum W/C?',['Type I, 0.60','Type II, 0.50 (with 4,000 psi minimum)','Type III, 0.45','Type IV, 0.40'],1,'12.1. Exposure class F3 (freezing with deicers) needs a W/C of 0.40 or less.')},
 {who:'L',say:'Strength says 0.50 and durability says 0.45.',
  ask:A('When strength and durability give different W/C values, use:',['The higher','The lower','The average','Either'],1,'Ch. 12 (bank).')},
 {who:'M',say:'And after the first truck: did we get the volume we paid for?',
  ask:A('Relative yield is the actual yield divided by:',['The cement weight','The designed volume of the batch','The slump','The water'],1,'12.6.')},
 {who:'N',say:'Method recap: aggregate size limits, exposure W/C, strength target, trial batches and yield. The lower W/C governs.'}],
 recap:[['Basics of proportioning','12.0','Ch. 12'],['Methods and exposure (seawater)','12.1','Ch. 12'],['Material properties','12.2','Ch. 12'],['Estimating proportions, MSA limits','12.3','Ch. 12'],['Admixtures in proportioning','12.5','Ch. 12'],['Yield','12.6','Ch. 12'],['Gap grading','12.9','Ch. 12']],
 exam:['w1201','w1202','w1203','w1204','w1205','g024','g025','g027','c069','c070','c071','c072','c073','c074','c075','c076'],
 next:'Next batch: precast, lightweight, special techniques, waterproofing, inspection and quality control.'});

/* ---------- New original questions (facts confirmed by the workbook answer key) ---------- */
G11.Q.push(
 W('w1601',16,'16.1','16-23','Before a slab is placed on a dry subgrade, the Manual says the subgrade should be:',['Left dry so the slab bonds','Saturated about a day before, and damp (not wet) at placement','Sealed with oil','Heated'],1,'16.1: saturate about one day before; damp when the concrete is placed.'),
 W('w1602',16,'16.1','16-22','A wet screed placed just ahead of a slab is a strip of concrete about:',['2 in wide','6 in wide','18 in wide','36 in wide'],1,'16.1.'),
 W('w1603',16,'16.1','16-24','Minimum drainage slope for an interior floor and an exterior slab:',['1/16 in/ft and 1/8 in/ft','1/8 in/ft and 1/4 in/ft','1/4 in/ft and 1/2 in/ft','1/2 in/ft and 1 in/ft'],1,'16.1: less slope is likely to pond.'),
 W('w1604',16,'16.2','16-10','With normal shrinkage, contraction joint spacing should not exceed about:',['10 × slab thickness','30 × slab thickness','50 × slab thickness','100 × slab thickness'],1,'16.2.'),
 W('w1605',16,'16.3','16-2','Maximum recommended slump for a medium-duty floor:',['2 in','4 in','6 in','8 in'],1,'16.3.'),
 W('w0101',1,'1.1','1-5','Which relationship was the first "law" of concrete to be researched?',['Slump and air','The water-cement ratio','Fineness modulus','Maturity'],1,'1.1.'),
 W('w0102',1,'1.2','1-4','Besides strength gain, the hydration of cement produces:',['Air','Heat','Sand','Bleed water only'],1,'1.2.'),
 W('w0201',2,'2.8','2-1','Concrete without an air-entraining agent normally contains about how much air?',['Less than 0.5%','1 to 2%','4 to 7%','8 to 10%'],1,'2.8.'),
 W('w0202',2,'2.4','2-4','A harsh, unworkable mix commonly results from:',['A high cement content','A low cement content','Entrained air','Cool weather'],1,'2.4.'),
 W('w0301',3,'3.3','3-1','Compressive strength for evaluation and acceptance is usually tested at an age of:',['3 days','7 days','28 days','56 days'],2,'3.3.'),
 W('w0302',3,'3.11','3-2','Other factors aside, the best temperature range for placing concrete is about:',['32–50 °F','40–80 °F','75–100 °F','Over 90 °F'],1,'3.11.'),
 W('w0303',3,'3.11','3-30','Compared with concrete made and cured at 90 °F, concrete made and cured at 50 °F is:',['Stronger at 3 days and at 28 days','Weaker at 3 days but stronger at 28 days','Weaker at both ages','The same'],1,'3.11.'),
 W('w0304',3,'3.5','3-13','Tensile strength of concrete is measured indirectly by:',['A slump test','A split cylinder test','A rebound hammer','A unit weight test'],1,'3.5. There is no field test for direct tension under axial load.'),
 W('w0305',3,'3.7','3-14','Cores from near the top of a column generally show ___ strength than cores from near its bottom.',['Higher','Lower','Exactly the same','Double the'],1,'3.7.'),
 W('w0306',3,'Table 3.5','3-19','Concrete held at 800 °F for a long time and then cooled keeps a permanent strength loss of about:',['5%','20%','50%','90%'],2,'Table 3.5.'),
 W('w0307',3,'3.17','3-26','Load-bearing concrete members exposed to continuous heat above about ___ should generally be avoided.',['150 °F','300 °F','500 °F','1,200 °F'],2,'3.17.'),
 W('w0401',4,'4.2','4-5','Poor durability of concrete is rarely caused by the:',['Workmanship','Cement','Exposure','Water content'],1,'4.2.'),
 W('w0402',4,'4.5','4-4','Freezing while still plastic can cut durability, weather resistance and strength by as much as:',['One-tenth','One-quarter','One-half','Nothing'],2,'4.5.'),
 W('w0403',4,'4.3','4-7','Which de-icer should NOT be used on concrete?',['Sodium chloride','Calcium chloride','Ammonium sulfate','Sand'],2,'4.3.'),
 W('w0404',4,'4.4','4-6','Which aggregate is considered reactive?',['Granite','Chert','Basalt','Quartzite sand'],1,'4.4.'),
 W('w0405',4,'4.3','4-9','Embedded aluminum in moist concrete is:',['Unaffected','Attacked by caustic alkalies','Stronger','Required'],1,'4.3.'),
 W('w0501',5,'5.1','5-9','The critical factor for limiting drying shrinkage is:',['Cement brand','Total water per cubic yard','Form material','Color'],1,'5.1.'),
 W('w0502',5,'5.1','5-2','Used as an accelerator, ___ increases drying shrinkage.',['Fly ash','Calcium chloride','Air-entraining agent','Slag'],1,'5.1.'),
 W('w0503',5,'5.7','5-6','The ability of concrete to change volume with temperature is its:',['k value','Coefficient of expansion','Modulus of rupture','Fineness modulus'],1,'5.7.'),
 W('w0504',5,'5.1','5-15','The main causes of high evaporation from fresh concrete are:',['High humidity and calm air','Low humidity and wind','Shade and cool air','Fog'],1,'5.1: air temperature can also matter.'),
 W('w0505',5,'5.11','5-1','A lack of watertightness can almost always be traced to:',['Cement type','Poor construction practices','Aggregate color','Too much curing'],1,'5.11.'),
 W('w0601',6,'6.2','6-1','Which crack does NOT form while the concrete is still plastic?',['Plastic shrinkage crack','Settlement crack','Drying shrinkage crack','Crack from form movement'],2,'6.2 and 6.4.'),
 W('w0602',6,'6.16','6-4','White crystalline salts left on the surface as water evaporates are:',['Laitance','Efflorescence','Popouts','Dusting'],1,'6.16.'),
 W('w0603',6,'6.20','6-7','A cone-shaped fragment broken out of a slab surface is a:',['Scale','Popout','Craze crack','Bug hole'],1,'6.20.'),
 W('w0604',6,'6.11','6-6','Unvented heaters in a cold-weather enclosure damage the fresh surface because of:',['Water vapor','Carbon dioxide','Nitrogen','Oxygen'],1,'6.11: the surface carbonates and becomes soft.'),
 W('w0605',6,'6.21','6-20','The first step in repairing concrete is to:',['Apply a patch','Diagnose the damage, its cause and its extent','Seal the surface','Grind it smooth'],1,'6.21.'),
 W('w0606',6,'6.18','6-22','Thin flakes peeling off a horizontal surface are called:',['Popouts','Scaling','Efflorescence','Crazing'],1,'6.18.'),
 W('w0701',7,'7.4','7-4','The cement type used when high early strength is needed is:',['Type I','Type II','Type III','Type V'],2,'7.4.'),
 W('w0702',7,'7.4','7-2','Type IV, low-heat cement, is used in mass concrete such as:',['Sidewalks','Large dams','Thin precast panels','Grout'],1,'7.4.'),
 W('w0703',7,'7.5','7-19','The blended cement designations IS, IP, IL and IT stand for slag, pozzolan, ___ and ternary blended.',['Lightweight','Limestone','Low heat','Iron'],1,'7.5.'),
 W('w0704',7,'7.2','7-20','The material interground with clinker to control setting time is:',['Lime','Gypsum','Fly ash','Silica fume'],1,'7.2.'),
 W('w0705',7,'7.10','7-9','Cement sacks may be stacked directly on a warehouse floor when:',['Never','No moisture comes through the floor','The floor is wood','Covered with plastic'],1,'7.10.'),
 W('w0801',8,'8.0','8-10','Aggregates take up roughly what share of concrete volume?',['25–35%','40–50%','60–80%','85–95%'],2,'8.0.'),
 W('w0802',8,'8.4','8-8','Fine aggregate is the material that passes the:',['No. 4 sieve','No. 16 sieve','No. 50 sieve','No. 200 sieve'],0,'8.4.'),
 W('w0803',8,'8.3','8-5','The particle shape most likely to make a harsh mix is:',['Rounded','Angular','Spherical','Smooth'],1,'8.3.'),
 W('w0804',8,'8.6','8-25','Which stockpiling practice reduces segregation?',['High cone-shaped piles','Building in layers and removing in vertical slices','Dropping from a high conveyor','Combining all sizes'],1,'8.6.'),
 W('w0805',8,'8.7','8-3','A sand sample for testing should weigh about:',['5 lb','10 lb','50 lb','200 lb'],2,'8.7.'),
 W('w0806',8,'8.3','8-16','The average specific gravity of sand or gravel is about:',['1.0','2.0','2.65','3.15'],2,'8.3: 3.15 is portland cement.'),
 W('w0901',9,'9.1','9-5','Which is an acceptable source of concrete mixing water?',['A stream carrying sugar or tannic acid','A private well','Sewage effluent','Seawater for reinforced work'],1,'9.1 and 4.2.'),
 W('w0902',9,'9.2','9-1','A retarder ___ the hydration of cement.',['Speeds up','Slows','Stops permanently','Does not affect'],1,'9.2.'),
 W('w0903',9,'9.2','9-8','An admixture that safely lowers the freezing point of fresh concrete:',['Is calcium chloride','Is salt','Does not exist','Is antifreeze'],2,'9.2.'),
 W('w0904',9,'9.2','9-4','Target total air for a moderate freeze-thaw exposure with ¾ in maximum aggregate:',['2%','5%','8%','10%'],1,'9.2.'),
 W('w0905',9,'9.2','9-12','When more than one admixture is used, they are:',['Premixed in one tank','Not intermixed before the mixer unless the manufacturers allow it','Added to the aggregate','Doubled in dose'],1,'9.2.'),
 W('w1001',10,'10.3','10-11','Epoxy resin systems are usually made of:',['A single powder','A basic resin and a curing agent','Cement and latex','Asphalt and sand'],1,'10.3.'),
 W('w1002',10,'10.3','10-2','Epoxy resins will not normally adhere to:',['Dry concrete','Greased surfaces','Steel','Sandblasted concrete'],1,'10.3.'),
 W('w1101',11,'11.2','11-1','The most common form material is:',['Wood','Steel','Fiberglass','Aluminum'],0,'11.2.'),
 W('w1102',11,'11.1','11-16','A common camber allowance for suspended slab forms is:',['⅛ in per 8 ft','¼ in per 16 ft of span','1 in per 10 ft','2 in per 20 ft'],1,'11.1.'),
 W('w1103',11,'11.5','11-4','Which is NOT a form release material?',['Commercial form oil','Motor oil','Form coating','Lacquer-type compound'],1,'11.5.'),
 W('w1104',11,'11.1','11-17','To avoid a disfiguring joint between lifts, form anchorages are set about ___ below the top of the lift.',['1 in','4 in','12 in','18 in'],1,'11.1.'),
 W('w1105',11,'11.7','11-5','A form that is raised vertically as the concrete is placed is a:',['Flying form','Slipform','Waste mold','Modular form'],1,'11.7.'),
 W('w1201',12,'12.3','12-20','Maximum aggregate size may not exceed one-fifth of the:',['Slab depth','Narrowest dimension between form sides','Clear bar spacing','Cover'],1,'12.3: also one-third of slab depth and three-quarters of the clear bar spacing.'),
 W('w1202',12,'12.1','12-5','When there are not enough field results for statistics, proportions are set by:',['Rule of thumb','Laboratory trial batches','The finisher','The cement mill'],1,'12.1.'),
 W('w1203',12,'12.1','12-23','Concrete exposed to seawater: cement type and maximum W/C?',['Type I, 0.60','Type II, 0.50','Type III, 0.55','Type IV, 0.45'],1,'12.1: with a corresponding minimum strength of 4,000 psi.'),
 W('w1204',12,'12.6','12-2','Relative yield is the actual yield divided by the:',['Cement content','Designed volume of the batch','Water content','Slump'],1,'12.6.'),
 W('w1205',12,'Table 12.1','12-8','Nonair-entrained concrete with ¾ in maximum aggregate has about how much entrapped air?',['0.5%','2.0%','5.0%','7.0%'],1,'Table 12.1.')
);
})();
