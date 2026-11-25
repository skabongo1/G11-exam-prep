/* ============================================================
   Animated explainers outside the lessons, plus the plain-words glossary
   used by "Explain it simply". Facts follow the app's verified rules
   (2018 IBC 1st printing; Concrete Manual 2021 IBC / ACI 318-19 ed.).
   Keys: G: guide tabs · M:<n> calculators · R:<subtopic> rule sheets · S:<id> scenarios · X:mastery
   ============================================================ */
(function(){
const S=(b)=>`<svg viewBox="0 0 200 120" role="img" aria-hidden="true">${b}</svg>`;const gr='<path class="ink" d="M10 104H190"/>';
Object.assign(G11.ART,{
tabs:S(`<rect class="soft" x="50" y="18" width="90" height="88" rx="4"/><rect class="f1" x="50" y="18" width="10" height="88"/>${[['f3',26],['f2',44],['f4',62],['f1',80]].map((t,i)=>`<rect class="${t[0]} ${i%2?'pop':'pop2'}" x="140" y="${t[1]}" width="20" height="12" rx="2"/>`).join('')}<path class="ink" d="M70 36h56M70 50h56M70 64h40M70 78h50"/>`),
highlight:S(`<rect class="soft" x="40" y="16" width="120" height="90" rx="4"/><rect class="hy draw2" x="52" y="28" width="70" height="10"/><rect class="hb pop" x="52" y="46" width="50" height="10"/><rect class="hp pop2" x="52" y="64" width="86" height="10"/><rect class="hg pop" x="52" y="82" width="40" height="10"/><path class="ink" d="M52 33h90M52 51h90M52 69h90M52 87h90" stroke-width="2"/>`),
index:S(`<rect class="soft" x="46" y="18" width="70" height="88" rx="3"/><text class="lbl" x="56" y="36">INDEX</text><path class="ink" d="M56 48h44M56 60h50M56 72h40M56 84h46"/><g class="mv"><circle class="ink" cx="134" cy="62" r="20" fill="none" stroke-width="6"/><path class="ink" d="M148 76l18 18" stroke-width="8"/></g>`),
block:S(`${gr}${[0,1,2].map(r=>[0,1,2,3].map(c=>`<rect class="${(r+c)%2?'f3':'soft'} ${r===2?'pop':''}" x="${36+c*32+(r%2?16:0)}" y="${80-r*22}" width="30" height="20" rx="1"/>`).join('')).join('')}`),
roof:S(`${gr}<path class="f2" d="M40 90L100 40l60 50z"/><rect class="soft" x="52" y="90" width="96" height="14"/><path class="ink pop" d="M100 40v50M100 90h60"/><text class="lbl pop" x="104" y="70">rise</text><text class="lbl pop" x="118" y="86">12</text>`),
board:S(`<path class="f3" d="M30 60l120-24 20 8-120 24z"/><path class="f3" d="M30 60v14l20 8v-14z" opacity=".8"/><path class="f3" d="M50 68l120-24v14L50 82z" opacity=".9"/><text class="lbl pop" x="100" y="100" text-anchor="middle">T × W × L ÷ 12</text>`),
bell:S(`${gr}<path class="f1" d="M20 104C60 104 70 24 100 24s40 80 80 80z" opacity=".85"/><path class="ink pop" d="M100 24v80M134 60v44" stroke-dasharray="4 4"/><text class="lbl pop" x="138" y="58">target</text>`),
flame:S(`<path class="f2 mv" d="M100 16c16 20 32 34 32 58a32 32 0 0 1-64 0c0-14 8-22 14-30 2 10 8 14 12 14-6-14 0-28 6-42z"/><path class="f3" d="M100 60c8 8 14 14 14 24a14 14 0 0 1-28 0c0-8 6-14 14-24z"/>`),
bellalarm:S(`<path class="f3 mv" d="M70 80c0-30 10-50 30-50s30 20 30 50l8 10H62z"/><circle class="f3" cx="100" cy="98" r="7"/><path class="ink pop" d="M52 40l-10-8M148 40l10-8M46 62H32M154 62h14"/>`),
window:S(`${gr}<rect class="soft" x="60" y="22" width="80" height="70"/><path class="ink" d="M100 22v70M60 57h80" stroke-width="4"/><path class="ink pop" d="M150 92v12M44 22v82" stroke-dasharray="3 3"/><text class="lbl pop" x="38" y="100" text-anchor="end">18"</text>`),
chimney:S(`${gr}<path class="f2" d="M20 104V70l60-30 60 30v34z" opacity=".7"/><rect class="f3" x="104" y="20" width="22" height="70"/><path class="ink pop" d="M134 20v40M130 20h8M130 60h8"/><text class="lbl pop" x="142" y="44">2 ft</text>`),
shingles:S(`<path class="f2" d="M20 96L100 30l80 66z" opacity=".25"/>${[0,1,2,3].map(r=>`<path class="f2 ${r%2?'pop':'pop2'}" d="M${40+r*8} ${86-r*13}h${120-r*16}v10H${40+r*8}z"/>`).join('')}<text class="lbl" x="100" y="112" text-anchor="middle">2:12 minimum</text>`),
soil:S(`<rect class="f3" x="20" y="40" width="160" height="22" opacity=".5"/><rect class="f3" x="20" y="62" width="160" height="22" opacity=".75"/><rect class="f3" x="20" y="84" width="160" height="22"/><rect class="soft pop" x="80" y="20" width="40" height="30"/><path class="ink" d="M20 40h160"/><text class="lbl pop" x="100" y="16" text-anchor="middle">1,500 psf clay</text>`),
joist:S(`<rect class="f3" x="20" y="40" width="160" height="30"/><path class="soft pop" d="M90 40h20v8H90z"/><circle class="soft pop2" cx="60" cy="55" r="5"/><path class="ink" d="M73 30v52M127 30v52" stroke-dasharray="4 4"/><text class="lbl" x="100" y="98" text-anchor="middle">middle third: no notch</text>`),
ladder:S(`<path class="ink" d="M70 108V12M130 108V12" stroke-width="5"/>${[1,2,3,4].map(k=>`<g class="${k%2?'pop':'pop2'}"><path class="ink" d="M70 ${112-k*24}h60" stroke-width="5"/><circle class="${k===4?'f4':'f1'}" cx="150" cy="${112-k*24}" r="9"/><text x="150" y="${116-k*24}" text-anchor="middle" fill="#fff" font-weight="800" font-size="10">${k}</text></g>`).join('')}`),
access:S(`<rect class="f1" x="50" y="20" width="100" height="84" rx="10"/><circle cx="104" cy="38" r="7" fill="#fff"/><path d="M100 48v22h22l8 18M100 58H86" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M90 66a18 18 0 1 0 28 18" stroke="#fff" stroke-width="5" fill="none"/>`),
ceiling:S(`${gr}<path class="ink" d="M30 24h140" stroke-width="5"/><path class="ink pop" d="M100 28v74M94 28h12M94 102h12"/><text class="lbl pop" x="108" y="70">7 ft 6 in</text><circle class="f1" cx="60" cy="58" r="8"/><rect class="f1" x="52" y="68" width="16" height="34" rx="5"/>`)
});

const X={};
/* ---------- Book guides ---------- */
X['G:method']=[{a:'magnifier',t:'Finding, not memorizing',c:'90 questions, 4 hours, open book: about 2 min 40 s each.',s:'The exam lets you bring your books. It tests how fast you find the answer, about two minutes forty seconds per question.'},
{a:'book',t:'1 · Name the topic',c:'Underline the nouns. Concrete materials and testing → Concrete Manual; the rest → IBC.',s:'Step one: name the topic. Underline the key nouns, and pick the book.'},
{a:'tabs',t:'2 · Pick the door in',c:'A tab if you have one, otherwise the index or table of contents.',s:'Step two: go in through a tab, or the index, using your strongest keyword.'},
{a:'flow',t:'3 · Read the rule and exceptions',c:'Check occupancy, sprinklers and units; wrong answers hide in the next row.',s:'Step three: read the rule and its exceptions. Check the occupancy, sprinklers and units.'},
{a:'calc',t:'4 · Calculate if needed',c:'Work it on paper, then compare with any minimum.',s:'Step four: calculate on scratch paper, then compare with any minimum.'},
{a:'clock',t:'5 · Answer and move on',c:'Past 4 minutes? Flag it, pick your best answer, come back.',s:'Step five: answer and move on. If it takes more than four minutes, flag it and come back later.'}];
X['G:ibc']=[{a:'tabs',t:'Tab the book',c:'About 30 tabs: chapters, key tables and the index.',s:'Put about thirty tabs in your I B C: the main chapters, the key tables and the index.'},
{a:'highlight',t:'Four highlight colors',c:'Yellow numbers · Blue defined words · Pink exceptions · Green tables and section starts.',s:'Use four colors. Yellow for numbers and limits, blue for defined words, pink for exceptions, and green for tables and section starts.'},
{a:'table',t:'Mark the tables',c:'Most answers sit in a few tables: 1004.5, 1607.1, 601, 1806.2…',s:'Many answers sit in a handful of tables, so tab and mark them first.'},
{a:'check',t:'Check the rules first',c:'Confirm with ICC and Pearson VUE what marks are allowed.',s:'Before you mark your book, check the testing rules for what tabs and highlights are allowed.'}];
X['G:cm']=[{a:'book',t:'The Concrete Manual',c:'26 chapters on concrete practice; cited by section, table and chapter.',s:'The Concrete Manual has twenty six chapters. Questions point to its sections and tables.'},
{a:'index',t:'Use the contents and index',c:'Go in by chapter title, then the section.',s:'Use the table of contents to find the chapter, then the section.'},
{a:'tabs',t:'Tab the high-priority chapters',c:'Ch. 3, 9, 11–19 and 26 carry most exam questions.',s:'Tab chapters three, nine, eleven through nineteen, and twenty six. They carry most of the questions.'},
{a:'highlight',t:'Highlight key values',c:'Cover, slump, test frequency, curing days, placing temperatures.',s:'Highlight the key values: cover, slump, test frequency, curing time and placing temperatures.'}];
X['G:math']=[{a:'calc',t:'Write the formula',c:'Name each number and its unit before you multiply.',s:'For any calculation, write the formula first and label every number with its unit.'},
{a:'ruler',t:'Watch the units',c:'Inches ↔ feet: divide by 12. Cubic feet ↔ cubic yards: divide by 27.',s:'Watch the units. Divide inches by twelve to get feet, and cubic feet by twenty seven to get cubic yards.'},
{a:'scale',t:'Compare with the minimum',c:'The code minimum may govern over your result.',s:'Then compare with the code minimum. The bigger value usually governs.'}];
/* ---------- Calculators (same order as Book guides → Math & plans) ---------- */
X['M:0']=[{a:'rebar',t:'Concrete volume',c:'Cubic yards = L × W × T (all in feet) ÷ 27.',s:'Concrete volume in cubic yards is length times width times thickness, in feet, divided by twenty seven.'},
{a:'calc',t:'40 × 30 ft, 4 in thick',c:'4 in = 0.333 ft → 40 × 30 × 0.333 = 400 cu ft.',s:'Four inches is one third of a foot, so forty by thirty by one third is four hundred cubic feet.'},
{a:'truck',t:'÷ 27 = 14.81 cu yd',c:'Order about 15.5 cu yd with 5% waste.',s:'Divide by twenty seven: about fourteen point eight cubic yards. Add five percent for waste.'}];
X['M:1']=[{a:'block',t:'CMU block count',c:'One 8 × 16 in block face = 0.889 sq ft → 1.125 blocks per sq ft.',s:'Each eight by sixteen inch block covers about eight ninths of a square foot, so you need one and one eighth blocks per square foot.'},
{a:'calc',t:'60 × 8 ft wall',c:'480 sq ft × 1.125 = 540 blocks (subtract openings first).',s:'A sixty by eight foot wall is four hundred eighty square feet, times one and one eighth, five hundred forty blocks.'}];
X['M:2']=[{a:'roof',t:'Roof slope',c:'Pitch factor = √(rise² + 12²) ÷ 12.',s:'The pitch factor is the square root of rise squared plus twelve squared, divided by twelve.'},
{a:'calc',t:'6:12 → factor 1.118',c:'Plan 30 × 50 ft = 1,500 sq ft × 1.118 = 1,677 sq ft.',s:'For a six in twelve roof the factor is one point one one eight. Fifteen hundred square feet becomes sixteen hundred seventy seven.'},
{a:'shingles',t:'Squares',c:'1 square = 100 sq ft → 16.8 squares.',s:'Roofing is sold by the square, one hundred square feet, so that is sixteen point eight squares.'}];
X['M:3']=[{a:'plans',t:'Reading a scale',c:'Real feet = measured inches ÷ scale (in per ft).',s:'To read a drawing, divide the measured inches by the scale in inches per foot.'},
{a:'ruler',t:'¼ in = 1 ft',c:'3½ in on the plan ÷ 0.25 = 14 ft.',s:'At a quarter inch per foot, three and a half inches on the plan is fourteen feet.'}];
X['M:4']=[{a:'board',t:'Board feet',c:'Thickness (in) × width (in) × length (ft) ÷ 12, nominal sizes.',s:'Board feet equal thickness times width in inches, times length in feet, divided by twelve.'},
{a:'calc',t:'2 × 10, 16 ft long',c:'2 × 10 × 16 ÷ 12 = 26.67 board feet.',s:'One two by ten, sixteen feet long, is twenty six point six seven board feet.'}];
X['M:5']=[{a:'ramp',t:'Slope as a ratio',c:'1:12 means 1 unit up for 12 across.',s:'A slope of one to twelve means one unit up for every twelve across.'},
{a:'calc',t:'Ramp rise 30 in',c:'Run = 30 × 12 = 360 in = 30 ft.',s:'A thirty inch rise at one to twelve needs three hundred sixty inches, thirty feet, of run.'},
{a:'scale',t:'Percent',c:'Rise ÷ run × 100 → 1:12 = 8.33%.',s:'As a percent, rise divided by run times one hundred: one to twelve is eight point three three percent.'}];
X['M:6']=[{a:'people',t:'Occupant load',c:'Area ÷ load factor, rounded up.',s:'Occupant load is the area divided by the load factor, rounded up.'},
{a:'calc',t:'6,000 sq ft office',c:'6,000 ÷ 150 = 40 people.',s:'A six thousand square foot office at one hundred fifty is forty people.'},
{a:'stairs',t:'Stair width',c:'40 × 0.3 = 12 in → the 36 in minimum governs (under 50 people).',s:'The stair needs forty times point three, twelve inches, but the thirty six inch minimum governs.'}];
X['M:7']=[{a:'bell',t:'Aim above f′c',c:'Test results vary, so the mix targets f′cr, higher than f′c.',s:'Strength results vary, so the mix is designed for a higher target, f c r.'},
{a:'calc',t:'Known standard deviation',c:'f′c ≤ 5,000: larger of f′c + 1.34s and f′c + 2.33s − 500.',s:'With a known standard deviation, use the larger of f c plus one point three four s, and f c plus two point three three s minus five hundred.'},
{a:'check',t:'f′c 4,000, s 400',c:'4,536 vs 4,432 → f′cr = 4,536 psi.',s:'For four thousand psi and s of four hundred, the target is four thousand five hundred thirty six psi.'},
{a:'table',t:'Unknown s',c:'+1,000 (under 3,000) · +1,200 (3,000–5,000) · 1.10 f′c + 700 (over 5,000).',s:'If s is unknown, add one thousand, or twelve hundred, or use one point one times f c plus seven hundred.'}];
/* ---------- Rule sheets (16 subtopics) ---------- */
const R=(k,a)=>X['R:'+k]=a;
R('Regulations and Job Planning',[{a:'house',t:'House code option',c:'Detached 1–2 family homes and townhouses ≤ 3 stories may use the IRC.',s:'Detached houses, duplexes and townhouses up to three stories may follow the residential code.'},
{a:'book',t:'Appendices',c:'Apply only when the jurisdiction adopts them.',s:'The appendices count only when your city adopts them.'},
{a:'scale',t:'Conflicts',c:'Specific beats general; then the most restrictive governs.',s:'In a conflict, the specific rule beats the general one, and then the most restrictive wins.'},
{a:'shed',t:'No-permit work',c:'Shed ≤ 120 sq ft · fence ≤ 7 ft · retaining wall ≤ 4 ft, no surcharge.',s:'No permit for a shed up to one hundred twenty square feet, a fence up to seven feet, or a retaining wall up to four feet without extra load.'},
{a:'clock',t:'Permit expires',c:'Not started in 180 days, or stopped for 180 days.',s:'A permit expires if work does not start within one hundred eighty days, or stops for one hundred eighty days.'}]);
R('Code Definitions and Terms',[{a:'book',t:'The code\'s dictionary',c:'Words defined in §202 mean exactly that everywhere.',s:'Words defined in section two oh two mean exactly that, everywhere in the code.'},
{a:'check',t:'"Approved"',c:'Acceptable to the building official.',s:'Approved means acceptable to the building official.'},
{a:'house',t:'Habitable space',c:'Living, sleeping, eating or cooking; not baths, closets, halls or storage.',s:'Habitable space is for living, sleeping, eating or cooking. Bathrooms, closets, halls and storage are not.'},
{a:'scale',t:'Code vs standard',c:'Where they differ, the IBC applies.',s:'If the code and a referenced standard differ, the code applies.'}]);
R('Use & Occupancy & Types of Construction',[{a:'chairs',t:'Small assembly',c:'Assembly space under 50 people → Group B.',s:'A small assembly space with fewer than fifty people is classified as business, group B.'},
{a:'people',t:'Assembly groups',c:'A-1 theaters · A-3 libraries, museums, worship · A-4 arenas with spectator seats.',s:'A one is theaters, A three is libraries, museums and worship, and A four is arenas with seating.'},
{a:'book',t:'College classrooms',c:'Education above 12th grade → Group B.',s:'Classrooms above the twelfth grade are group B, not group E.'},
{a:'table',t:'Table 601 frame ratings',c:'I-A 3 h · I-B 2 h · II-A 1 h · II-B 0.',s:'Structural frame ratings in table six oh one: type one A three hours, one B two hours, two A one hour, two B none.'},
{a:'stairs',t:'Mezzanine',c:'Up to ⅓ of the room\'s floor area.',s:'A mezzanine may be up to one third of the floor area of the room.'}]);
R('Fire & Smoke Alarms & Fire Protection Systems',[{a:'sprinkler',t:'Restaurants (A-2)',c:'Sprinklers if fire area > 5,000 sq ft, or 100+ people, or not on the exit level.',s:'Restaurants need sprinklers when the fire area is over five thousand square feet, or one hundred or more people, or not on the exit level.'},
{a:'house',t:'Group R',c:'Sprinklers throughout buildings with a Group R fire area.',s:'Buildings with a residential fire area need sprinklers throughout.'},
{a:'block',t:'Factories (F-1)',c:'Over 12,000 sq ft, over 3 stories, or combined over 24,000 sq ft.',s:'Factories need sprinklers over twelve thousand square feet, over three stories, or a combined twenty four thousand.'},
{a:'bellalarm',t:'Fire alarms',c:'Assembly: 300+ people · Business: 500+ (or 100+ off the exit level).',s:'Fire alarms are required in assembly with three hundred people, and in business with five hundred, or one hundred off the exit level.'},
{a:'stairs',t:'Standpipes',c:'4+ stories, or a floor more than 30 ft from fire access.',s:'Standpipes are needed at four or more stories, or a floor more than thirty feet from fire department access.'}]);
R('Occupancy Needs & Interior Environment',[{a:'ceiling',t:'Ceiling height',c:'7 ft 6 in · 7 ft in baths, kitchens, storage, laundry.',s:'Ceilings are at least seven feet six inches, or seven feet in baths, kitchens, storage and laundry rooms.'},
{a:'house',t:'Room size',c:'One room 120 sq ft; other habitable rooms 70 sq ft (kitchens excepted).',s:'One room must be at least one hundred twenty square feet, and other habitable rooms seventy.'},
{a:'people',t:'Separate restrooms',c:'Not required with 15 or fewer total occupants.',s:'Separate men\'s and women\'s restrooms are not required with fifteen or fewer people.'},
{a:'wall',t:'Sound between units',c:'STC 50, or 45 if field tested.',s:'Walls between dwelling units need a sound rating of fifty, or forty five if field tested.'}]);
R('Exiting & Means of Egress',[{a:'table',t:'Count people first',c:'Area ÷ Table 1004.5 factor (office 150 gross, chairs 7 net).',s:'Start by counting people: area divided by the factor in table ten oh four point five.'},
{a:'stairs',t:'Width per person',c:'Stairs 0.3 in · other parts 0.2 in.',s:'Stairs need three tenths of an inch per person, and other parts two tenths.'},
{a:'ruler',t:'Minimum widths',c:'Stairs 44 in (36 if under 50) · door 32 in clear.',s:'Stairs are at least forty four inches, or thirty six for fewer than fifty people, and doors thirty two inches clear.'},
{a:'scale',t:'Larger governs',c:'Compare calculated and minimum width.',s:'Compare the calculated width with the minimum. The larger one governs.'}]);
R('Accessibility',[{a:'access',t:'Entrances',c:'At least 60% of public entrances accessible.',s:'At least sixty percent of public entrances must be accessible.'},
{a:'table',t:'Accessible parking',c:'26–50 spaces: 2 · 101–150: 5.',s:'A lot with twenty six to fifty spaces needs two accessible spaces. One hundred one to one hundred fifty needs five.'},
{a:'truck',t:'Van spaces',c:'One of every six accessible spaces is van-accessible.',s:'One out of every six accessible spaces must be van accessible.'},
{a:'stairs',t:'Accessible exit stair',c:'48 in between handrails, unless the building is sprinklered.',s:'An accessible exit stair needs forty eight inches between handrails, unless the building is sprinklered.'}]);
R('Footings and Foundations',[{a:'trench',t:'Footing size',c:'At least 12 in deep and 12 in wide.',s:'Footings are at least twelve inches deep and twelve inches wide.'},
{a:'snow',t:'Frost',c:'Never bear on frozen soil (unless permanently frozen).',s:'Footings may not sit on frozen soil.'},
{a:'soil',t:'Presumptive soil values',c:'Table 1806.2: clay 1,500 psf.',s:'Without a soils report, clay is good for fifteen hundred pounds per square foot.'},
{a:'ramp',t:'Grade away',c:'5% slope for at least 10 ft from the foundation.',s:'The ground must slope away five percent for at least ten feet.'},
{a:'drop',t:'Water pressure',c:'Hydrostatic pressure → waterproofing, not dampproofing.',s:'Where groundwater pushes against the wall, waterproofing is required.'}]);
R('Concrete',[{a:'rebar',t:'Slabs on ground',c:'At least 3½ in · 6-mil poly lapped 6 in.',s:'A slab on ground is at least three and a half inches, over six mil plastic lapped six inches.'},
{a:'drop',t:'Water and strength',c:'More water per cement = weaker, leakier concrete.',s:'More water per pound of cement means weaker, leakier concrete.'},
{a:'cone',t:'Testing',c:'Slump: 12 in cone, 3 layers, 25 rods each.',s:'The slump test uses a twelve inch cone, three layers, twenty five rods each.'},
{a:'thermo',t:'Curing',c:'Moist and above 50 °F for 7 days (3 days high early).',s:'Keep concrete moist and above fifty degrees for seven days.'},
{a:'magnifier',t:'Special inspection',c:'IBC Table 1705.3 lists required concrete inspections.',s:'Required concrete special inspections are listed in table seventeen oh five point three.'}]);
R('Floors',[{a:'table',t:'Live loads',c:'Office 50 · corridor above 1st floor 80 · lobby 100 psf.',s:'Design floor loads: offices fifty, upper corridors eighty, lobbies one hundred pounds per square foot.'},
{a:'wall',t:'Partition load',c:'15 psf unless the live load is 80 psf or more.',s:'Add fifteen pounds for movable partitions, unless the live load is already eighty or more.'},
{a:'joist',t:'Joist notches',c:'⅙ of depth, never in the middle third · ends ¼ · holes ⅓ and 2 in from edges.',s:'Joist notches are limited to one sixth of the depth and never in the middle third. Holes, one third, two inches from the edges.'},
{a:'soil',t:'Decay near ground',c:'Treated wood: joists within 18 in, girders within 12 in of soil.',s:'Use treated wood when joists are within eighteen inches, or girders within twelve, of the ground.'}]);
R('Wall Framing and Stairs',[{a:'stairs',t:'Stair steps',c:'Risers 4–7 in · treads 11 in minimum.',s:'Stair risers are four to seven inches, treads at least eleven.'},
{a:'frame',t:'Stud notches',c:'25% in bearing walls · 40% in nonbearing.',s:'Studs may be notched twenty five percent in bearing walls, forty in non bearing walls.'},
{a:'frame',t:'Stud holes',c:'40% of width · 60% if doubled or nonbearing.',s:'Holes may be forty percent of the stud width, or sixty if doubled or non bearing.'},
{a:'ruler',t:'Top plate splices',c:'Offset at least 48 in.',s:'Splices in a double top plate are offset at least forty eight inches.'},
{a:'flame',t:'Fireblocking',c:'In walls, every 10 ft horizontally.',s:'Fireblocking goes in walls at least every ten feet horizontally.'}]);
R('Roof Ceiling Construction, Roof Assembly',[{a:'roof',t:'Secondary drains',c:'Needed where parapets would trap water.',s:'Where roof edges would trap water, secondary drains or scuppers are required.'},
{a:'frame',t:'Rafter ties',c:'Keep rafters from pushing walls apart.',s:'Rafter ties or ceiling joists keep the rafters from pushing the walls outward.'},
{a:'shingles',t:'Reroofing',c:'No new layer over water-soaked roofs, or over slate, clay or cement tile.',s:'Do not add a new roof over a water soaked roof, or over slate or tile.'}]);
R('Masonry',[{a:'block',t:'Masonry walls',c:'Blocks, mortar and grout follow IBC Chapter 21 and TMS standards.',s:'Masonry follows chapter twenty one and its referenced standards.'},
{a:'chimney',t:'Chimney height',c:'2 ft above anything within 10 ft; 3 ft above the roof.',s:'A chimney rises two feet above anything within ten feet, and three feet above where it passes the roof.'},
{a:'flame',t:'Fireplace clearance',c:'Wood framing 2 in from front and sides, 4 in from the back.',s:'Keep wood framing two inches from the front and sides of a masonry fireplace, and four inches from the back.'}]);
R('Interior Finishes',[{a:'flame',t:'Flame spread classes',c:'A 0–25 · B 26–75 · C 76–200.',s:'Wall and ceiling finishes are rated by flame spread: class A zero to twenty five, B to seventy five, C to two hundred.'},
{a:'table',t:'By occupancy',c:'Table 803.13 sets the class for each space.',s:'Table eight oh three point one three sets the class for each kind of space.'},
{a:'wall',t:'Plaster coats',c:'3 coats over metal lath · 2 coats over other bases.',s:'Plaster takes three coats over metal lath, two over other bases.'}]);
R('Glass and Glazing',[{a:'door',t:'Safety glass in doors',c:'Glass in doors is a hazardous location.',s:'Glass in doors must be safety glass.'},
{a:'window',t:'Next to doors',c:'Within 24 in of the door, bottom edge below 60 in.',s:'Glass within twenty four inches of a door, with its bottom below sixty inches, needs safety glass.'},
{a:'window',t:'Big low windows',c:'Over 9 sq ft, bottom < 18 in, top > 36 in, walkway within 36 in.',s:'Large low windows over nine square feet need safety glass when all four conditions are met.'},
{a:'check',t:'Seven locations',c:'§2406.4.1–.7 list every hazardous location.',s:'Section twenty four oh six point four lists all seven hazardous locations.'}]);
R('Exterior Finishes and Roof Coverings',[{a:'shingles',t:'Asphalt shingles',c:'2:12 minimum · double underlayment from 2:12 to 4:12.',s:'Asphalt shingles need at least a two in twelve slope, with double underlayment up to four in twelve.'},
{a:'snow',t:'Ice barrier',c:'From the eave to 24 in inside the exterior wall line.',s:'In cold areas, the ice barrier runs from the eave to twenty four inches inside the wall.'},
{a:'roof',t:'Built-up roofs',c:'¼ in per 12 minimum (coal-tar ⅛).',s:'Built up roofs need at least a quarter inch per foot.'},
{a:'wall',t:'Vapor retarders',c:'Class I or II inside walls in climate zones 5–8 and Marine 4.',s:'In cold climate zones, walls need a class one or two vapor retarder on the inside.'}]);
/* ---------- Scenarios ---------- */
X['S:S1']=[{a:'plans',t:'Read the plan',c:'Second floor, open office: note the area and stair widths.',s:'Start by reading the plan: the office area and the stair widths.'},
{a:'calc',t:'Count people',c:'Area ÷ 150 (business, gross), rounded up.',s:'Divide the area by one hundred fifty to get the number of people.'},
{a:'stairs',t:'Required width',c:'Larger of people × 0.3 in and the minimum (36 in under 50, else 44 in).',s:'The stair must be the larger of point three inch per person and the minimum width.'},
{a:'check',t:'Pass or fail',c:'Compare the drawn width with the required width.',s:'Compare what is drawn with what is required, and decide.'}];
X['S:S2']=[{a:'chairs',t:'Count the diners',c:'Dining with tables: net area ÷ 15.',s:'Dining with tables and chairs counts at fifteen square feet per person, net.'},
{a:'people',t:'Add the kitchen',c:'Commercial kitchen: area ÷ 200.',s:'Add the kitchen at two hundred square feet per person.'},
{a:'book',t:'50 or more → A-2',c:'Under 50 people is Group B.',s:'Fifty or more people makes it assembly A two. Fewer is business.'},
{a:'sprinkler',t:'Sprinklers?',c:'A-2: fire area > 5,000 sq ft, or 100+ people, or not on the exit level.',s:'An A two needs sprinklers over five thousand square feet, at one hundred people, or off the exit level.'},
{a:'magnifier',t:'Missing facts',c:'If the level is unknown, say what you need first.',s:'If a fact you need is missing, say so instead of guessing.'}];
X['S:S3']=[{a:'rebar',t:'Slab thickness',c:'At least 3½ in.',s:'Check the slab is at least three and a half inches.'},
{a:'drop',t:'Vapor retarder',c:'6-mil poly, joints lapped 6 in.',s:'Check for six mil plastic with six inch laps.'},
{a:'snow',t:'Frost depth',c:'Footing bottom below the frost line; unknown frost depth → can\'t judge yet.',s:'The footing must go below the frost line. If frost depth is not given, you cannot judge yet.'},
{a:'check',t:'List the fixes',c:'Every failing item with its section.',s:'List each problem with the section that requires the fix.'}];
X['S:S4']=[{a:'joist',t:'Joist notch',c:'Ends ¼ depth · elsewhere ⅙ · never the middle third.',s:'Check joist notches: a quarter at the ends, a sixth elsewhere, never in the middle third.'},
{a:'frame',t:'Stud notch and hole',c:'Bearing: notch 25%, hole 40%.',s:'In a bearing wall, studs may be notched twenty five percent and bored forty percent.'},
{a:'ruler',t:'Top plate splice',c:'Offset at least 48 in.',s:'Top plate splices must be offset forty eight inches.'},
{a:'check',t:'Call each item',c:'Pass or fail, with the section.',s:'Call each item pass or fail, with its section.'}];
X['S:S5']=[{a:'people',t:'How many people?',c:'Corridor serving more than 30 occupants?',s:'First, how many people does the corridor serve?'},
{a:'sprinkler',t:'Sprinklered?',c:'Group B > 30: 1 hour without sprinklers, 0 with.',s:'For an office over thirty people, the corridor is one hour without sprinklers, none with.'},
{a:'deadend',t:'Dead end',c:'20 ft · 50 ft if sprinklered (Group B).',s:'A dead end may be twenty feet, or fifty if the office is sprinklered.'},
{a:'magnifier',t:'Find missing info first',c:'Sprinkler status unknown? Get it before deciding.',s:'If you don\'t know whether it is sprinklered, find out before you decide.'}];
/* ---------- Lookup mastery ---------- */
X['X:mastery']=[{a:'ladder',t:'Four tiers per chapter',c:'Locate → Read → Conditions → Speed mix.',s:'Every chapter has four tiers: locate, read, conditions and speed.'},
{a:'index',t:'1 · Locate',c:'Type the section number you found. 90% over 20 lookups.',s:'Tier one: find the section and type its number. Pass at ninety percent.'},
{a:'book',t:'2 · Read',c:'Pull the exact number or rule.',s:'Tier two: read the exact number or rule.'},
{a:'flow',t:'3 · Conditions',c:'Catch the exception that changes the answer.',s:'Tier three: catch the exception or condition that changes the answer.'},
{a:'clock',t:'4 · Speed mix',c:'Mixed questions, 90 seconds each.',s:'Tier four: mixed questions at ninety seconds each.'},
{a:'check',t:'Mastered',c:'All tiers passed; re-check after 14 days.',s:'Pass all four and the chapter is mastered. Re check it after fourteen days.'}];
G11.EXPL=X;

/* ---------- "Explain it simply" ---------- */
G11.SUBPLAIN={'Regulations and Job Planning':'who is in charge, when you need a permit, and how the code applies',
'Code Definitions and Terms':'what a word means in the code\'s own dictionary',
'Use & Occupancy & Types of Construction':'what kind of building this is, and how fire-resistant its structure must be',
'Fire & Smoke Alarms & Fire Protection Systems':'when a building needs sprinklers, alarms or standpipes',
'Occupancy Needs & Interior Environment':'room sizes, ceiling heights, light, air, sound and restrooms',
'Exiting & Means of Egress':'how many people are inside and how they get out safely',
'Accessibility':'making the building usable by people with disabilities',
'Footings and Foundations':'the soil and the concrete base the building sits on',
'Concrete':'making, testing, placing and protecting concrete and its steel',
'Floors':'how much weight floors carry and how floor framing is built',
'Wall Framing and Stairs':'how walls are framed and how stairs are sized',
'Roof Ceiling Construction, Roof Assembly':'how the roof structure is built and drained',
'Masonry':'block and brick walls, fireplaces and chimneys',
'Interior Finishes':'how fire-safe wall, ceiling and floor surfaces must be',
'Glass and Glazing':'where glass must be safety glass, and skylights',
'Exterior Finishes and Roof Coverings':'siding, weather protection and roof coverings'};
G11.GLOSS=[
['occupant load','how many people the code assumes are in a space'],['means of egress','the whole path out of a building: room, hallway, exit, outside'],['egress','the way out'],
['exit access','the part of the way out before you reach a protected exit'],['exit discharge','the part from the exit door to the outside public way'],['corridor','an enclosed hallway leading to exits'],
['dead end','a hallway with only one way out'],['travel distance','how far you walk to reach an exit'],['fire-resistance rating','how long a wall or floor holds back fire, in hours'],
['fire separation distance','the gap from the building to the property line, street center, or an imaginary line between buildings'],['sprinklered','has automatic fire sprinklers throughout'],
['fire area','the floor area inside fire walls or fire barriers'],['occupancy','what the building is used for'],['grade plane','the average ground level around the building'],
['story','a floor level of a building'],['mezzanine','a partial floor inside a room, open to the room below'],['footing','the wide concrete base under a wall or column'],
['frost line','how deep the ground freezes in winter'],['presumptive','the value the code lets you assume without a soils report'],['psf','pounds per square foot'],
['psi','pounds per square inch'],['live load','the weight of people, furniture and stored things'],['dead load','the weight of the building itself'],
['partition','an interior wall that divides space'],['joist','a floor or ceiling beam that runs between supports'],['girder','a big beam that holds up other beams'],
['stud','a vertical board in a framed wall'],['top plate','the board along the top of a framed wall'],['header','the beam over a door or window opening'],
['rafter','a sloped roof beam'],['notch','a cut taken out of the edge of a board'],['bored hole','a hole drilled through a board'],
['fireblocking','pieces that block hidden spaces so fire cannot race through them'],['draftstopping','barriers in floor and attic spaces that slow fire and smoke'],['guard','a barrier at an open edge so people do not fall'],
['handrail','the rail you hold onto on stairs and ramps'],['riser','the vertical height of one step'],['tread','the flat part of a step you stand on'],
['nosing','the front edge of a stair tread'],['flame spread','how fast flame moves across a surface'],['safety glazing','glass that breaks safely, such as tempered or laminated'],
['skylight','a window in the roof'],['underlayment','the waterproof layer under roofing'],['ice barrier','a sticky waterproof sheet at the eaves where ice builds up'],
['slump','how much fresh concrete sags in the cone test: how wet it is'],['hydration','the chemical reaction of cement and water that hardens concrete'],['w/cm','water divided by cement (and similar powders)'],
['water-cement ratio','water divided by cement, by weight'],['f′c','the strength the designer requires, in psi, usually at 28 days'],['curing','keeping new concrete moist and warm so it gains strength'],
['admixture','an additive mixed into concrete to change how it behaves'],['air entrain','mixing in tiny air bubbles so concrete survives freezing'],['aggregate','the sand and gravel in concrete'],
['cylinder','a test sample of concrete broken to measure strength'],['core','a sample drilled out of hardened concrete'],['cover','the concrete thickness over the steel bars'],
['reinforcement','steel bars or mesh inside concrete'],['rebar','steel reinforcing bar'],['stirrup','a bent bar wrapped around the main bars of a beam'],
['vapor retarder','a plastic sheet that slows moisture coming up from the ground'],['waterproofing','protection against water under pressure'],['dampproofing','protection against ground dampness without water pressure'],
['special inspection','an extra expert check of critical work, hired by the owner'],['building official','the city officer who enforces the code'],['approved','acceptable to the building official'],
['permit','official permission to build'],['certificate of occupancy','the city\'s OK to move in'],['IRC','the separate code for houses'],
['IEBC','the code for work on existing buildings'],['appendix','an optional chapter that applies only if adopted'],['exception','a listed case where the rule does not apply'],
['ASTM','the standards group whose test methods the codes point to'],['ACI 318','the concrete design standard the IBC adopts'],['retemper','adding water to concrete that has started to stiffen'],
['bleed water','water that rises to the top of fresh concrete'],['consolidat','shaking out air pockets with a vibrator'],['formwork','the molds that hold concrete until it hardens'],
['shoring','temporary supports under forms'],['camber','a slight upward curve built in so a beam ends up level'],['prestressed','concrete squeezed by tensioned steel cables'],
['calcium chloride','a salt that speeds up setting; banned in some uses'],['CMU','concrete masonry unit: a concrete block'],['mortar','the paste that bonds blocks or bricks'],
['grout','a fluid concrete that fills block cells'],['accessible route','a continuous path a wheelchair user can travel'],['van-accessible','an accessible parking space wide enough for a van lift'],
['STC','sound transmission class: how well a wall blocks sound'],['habitable space','a room for living, sleeping, eating or cooking'],['noncombustible','will not burn'],
['Type I','the most fire-resistant construction type (concrete or protected steel)'],['Type V','construction that can be all wood'],['tributary','the area a member supports'],
['surcharge','extra load pushing on a wall, such as a slope or a driveway'],['hydrostatic','water pressure from groundwater'],['parapet','the part of a wall that sticks up above the roof'],
['scupper','an opening in a parapet that lets roof water out'],['penetration','a pipe, duct or wire that passes through a wall or floor'],['standpipe','a water pipe in a building for fire hoses']];
})();
