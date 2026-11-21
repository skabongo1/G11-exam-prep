/* ============================================================
   Concrete Manual coverage, batch 1: Chapters 13, 18 and 19.
   One original question for every item in the 2021 Concrete Manual Workbook for these chapters.
   Answers come from the workbook's answer key; "sec" is the Manual section the key cites; "wk" = workbook chapter-item.
   Wording is our own. True/false items become "agrees / does not agree with the Manual" questions:
   a statement the key marks false is only ever used as the wrong-statement answer, never rewritten into a "fact".
   Each item also feeds a Tier 1 lookup (topic → Manual section) in Lookup mastery.
   ============================================================ */
(function(){
const CH={13:'Testing and Controlling the Concrete',18:'The Reinforcement',19:'Hot and Cold Weather Concreting'};
const out=[],LKC=[];
const NO='Not what the Concrete Manual gives (per the workbook answer key).';
const mk=(id,ch,sec,wk,topic,q,o,a,ex,df)=>{out.push({id,d:3,s:'Concrete',df:df||2,q,o,a,ex,w:o.map((_,i)=>i===a?null:NO),r:'Concrete Manual '+sec,p:null,f:'Concrete Manual → Chapter '+ch+', '+CH[ch]+' → '+sec,v:true,b:'CM',ch,wk,src:'wb'});LKC.push([sec.replace(/^(Section|Sec\.)\s*/,''),topic,null,ch,1,/^(Table|Figure)/.test(sec)?1:0,id])};
/* MC: [wk, sec, topic, question, [4 options], answerIndex, explanation] */
const MC=(ch,rows)=>rows.forEach(r=>mk('k'+r[0].replace('-','_'),ch,r[1],r[0],r[2],r[3],r[4],r[5],r[6]));
/* Statements: T = [wk, sec, topic, true statement, its negation]; F = [wk, sec, topic, statement the key marks false] */
function TF(ch,T,F){
 T.forEach((t,i)=>{const others=T.filter((_,j)=>j!==i);const rot=others.slice(i%others.length).concat(others.slice(0,i%others.length));const neg=[...new Set([t[4],...rot.map(x=>x[4]),...F.map(x=>x[3])])].slice(0,3);
  mk('k'+t[0].replace('-','_'),ch,t[1],t[0],t[2],'Which statement agrees with the Concrete Manual?',[t[3],...neg],0,'Agrees: '+t[3]+' ('+t[1]+'). The other three reverse statements the Manual makes.')});
 F.forEach((f,i)=>{const tr=[T[i%T.length],T[(i+1)%T.length],T[(i+2)%T.length]].map(x=>x[3]);
  mk('k'+f[0].replace('-','_'),ch,f[1],f[0],f[2],'Which statement does NOT agree with the Concrete Manual?',[f[3],...tr],0,'Does not agree: "'+f[3]+'" ('+f[1]+'). The other three statements match the Manual.')})}

/* ---------------- Chapter 13 Testing and Controlling the Concrete ---------------- */
MC(13,[
 ['13-1','13.1','Water content and slump','Raising the total water in a mix by about how much raises the slump by roughly 1 inch?',['1 percent','3 percent','6 percent','10 percent'],1,'About 3% more total water gives about 1 in more slump (13.1).'],
 ['13-2','13.4','Mixer uniformity tests','Which of these is used as a mixer-performance (uniformity) test?',['Slump','Unit weight','Air content','All of these, plus strength'],3,'Slump, unit weight, air content and strength are all used to check mixer uniformity (13.4).'],
 ['13-3','13.2','What a proper test requires','A test gives dependable results only when:',['Standard methods are followed','Qualified people perform it with proper equipment','The results are interpreted correctly','All of these'],3,'Standard methods, qualified people, proper equipment and correct interpretation are all needed (13.2).'],
 ['13-4','13.5','Most common cylinder size','The most common compressive-strength cylinder is:',['4 × 8 in','6 × 12 in','8 × 12 in','3 × 6 in'],1,'6 × 12 in is the most common size (13.5).'],
 ['13-5','13.4','Slump test: filling the cone','The slump cone is filled in how many layers of equal volume?',['Two','Three','Four','Five'],1,'Three equal layers (13.4).'],
 ['13-6','13.8','Sampling hardened concrete','The most common way to sample hardened concrete is:',['Breaking off a piece','Rebound (Swiss) hammer','Penetration (Windsor) probe','Drilling cores'],3,'Cores are the most common sample of hardened concrete (13.8).'],
 ['13-7','13.1','Ways to lower the w/c','Which of these can help lower the water-cement ratio?',['Only using larger coarse aggregate','Only entraining air','Less sand, larger coarse aggregate, entrained air and better sand grading: all of them','None of them'],2,'All four help reduce the water needed, and with it the w/c (13.1).'],
 ['13-8','13.5','Cylinder temperature at testing','When cylinders are broken in the lab, they should be:',['At room temperature','Between 60 and 80 °F','Below 50 °F','Coated with oil'],0,'Cylinders are tested at room temperature (13.5).'],
 ['13-9','13.4','Where field cylinders are left','Strength specimens are made where they can stay undisturbed for at least:',['6 hours','12 hours','24 hours','48 hours'],1,'At least 12 hours (13.4).'],
 ['13-10','13.10','Rebound (Swiss) hammer accuracy','The accuracy of a rebound (Swiss) hammer, depending on calibration, is about:',['±2–3%','±5–8%','±10–20%','±25–30%'],2,'About 10 to 20 percent (13.10).'],
 ['13-11','13.6','Uses of the maturity method','The maturity method can help judge strength for:',['Form removal only','Post-tensioning only','Joint sawing only','Form removal, post-tensioning, joint sawing and accelerated curing control'],3,'All of those uses (13.6).'],
 ['13-12','13.6','7-day vs 28-day data','Reporting 7-day versus 28-day cylinder strengths is reporting:',['Durability data','Frequency data','Maturity data','Petrographic data'],2,'Strength-versus-age results are maturity data (13.6).'],
 ['13-13','13.5','Advantages of 4 × 8 cylinders','Compared with 6 × 12 cylinders, 4 × 8 cylinders:',['Are easier to cast and handle','Need less sample','Need less curing space','All of these'],3,'All of these (13.5).'],
 ['13-24','13.4','Slump units and meaning','Slump is measured in ___; a low slump means a ___ mix.',['Inches; stiff or dry','Inches; soft or wet','Seconds; stiff','Percent; wet'],0,'Inches; low slump = stiff or dry, high slump = soft or wet (13.4).'],
 ['13-25','13.2','Following test procedures','Strictly following test procedures is what gives results their:',['Speed','Accuracy and reliability','Low cost','Strength'],1,'Strict observance gives accuracy and reliability (13.2).'],
 ['13-26','13.1','Coarse aggregate grading and sand','A change in coarse aggregate grading can change the aggregate\'s:',['Color and shape','Voids and rodded unit weight, which changes the sand needed','Cement content only','Air content only'],1,'Voids and rodded unit weight change, so the sand requirement changes (13.1).'],
 ['13-27','13.4','Reusing air-meter concrete','Concrete from an air meter filled with water must not be used for:',['Temperature tests','Slump tests or strength specimens','Unit weight','Visual checks'],1,'Not for slump tests or strength specimens (13.4).'],
 ['13-28','13.3','Why hardened concrete is tested','Tests of hardened concrete are made to:',['Set the mix design','Verify or refute its quality','Measure slump','Replace cylinders'],1,'To verify or refute its quality (13.3).'],
 ['13-29','13.2','Basic rule of sampling','The basic requirement of any sampling procedure is a sample that is:',['Large','Hot','Truly representative','Taken from the first concrete out of the truck'],2,'A truly representative sample (13.2).']]);
TF(13,[
 ['13-14','13.9','Cores vs cylinders','Extracted cores generally test lower than standard cylinders of the same age.','Extracted cores generally test higher than standard cylinders of the same age.'],
 ['13-16','13.10','Probe vs hammer depth','A penetration (Windsor) probe measures hardness deeper than a rebound (Swiss) hammer.','A rebound hammer measures hardness deeper than a penetration probe.'],
 ['13-17','13.4','Types of air meters','The two air meters in regular use are the pressure and the volumetric types.','Only the pressure-type air meter is in regular use.'],
 ['13-19','13.4','Low unit weight meaning','An abnormally low unit weight points to high air or too much water.','An abnormally low unit weight points to too much cement.'],
 ['13-21','13.6','Maturity curve first','A laboratory maturity curve for the specific mix is needed before job maturity can be judged.','Job maturity can be judged without any laboratory maturity curve.'],
 ['13-22','13.5','4 × 8 vs 6 × 12 strength','The strength difference between 4 × 8 and 6 × 12 cylinders is insignificant.','4 × 8 cylinders always test far lower than 6 × 12 cylinders.'],
 ['13-23','13.4','Cast-in-place cylinder molds','Cylinders cast in place in cylinder molds give a way to judge in-place strength.','Cylinders cast in place in molds cannot indicate in-place strength.']],
[
 ['13-15','13.2','What tests reveal','Tests do three things: show quality, show uniformity, and verify total volume.'],
 ['13-18','13.10','Rebound hammer readings','With a rebound hammer, the usual practice is to average 15 readings.'],
 ['13-20','13.6','Rapid strength methods','Most rapid strength-measurement procedures rely on heat to speed up hydration.']]);

/* ---------------- Chapter 18 The Reinforcement ---------------- */
MC(18,[
 ['18-1','18.5','Effect of heavy rust','Heavy rust on reinforcement weakens the steel and also causes:',['Small voids','An expansion in volume that can spall and crack the concrete','Loss of waterproofing only','Nothing else'],1,'Rust expands, which can spall and crack the concrete (18.5).'],
 ['18-2','18.4','What does not hurt bond','Which surface condition does NOT interfere with bond?',['Paint','Grease or oil','Loose mill scale','Light rust'],3,'Light rust does not interfere with bond (18.4).'],
 ['18-3','18.6','Checking epoxy-coated bars','Epoxy-coated reinforcement should be checked for:',['Mechanical splices','Rust','Smoothness','Damage to the coating'],3,'Check for damaged coating (18.6).'],
 ['18-4','18.2','#5 bar diameter','A No. 5 bar is about how large in diameter?',['5/16 in','1/2 in','5/8 in','3/4 in'],2,'About 5/8 in: bar number ≈ eighths of an inch (18.2).'],
 ['18-5','18.2','Advantage of WWR','A main advantage of welded wire reinforcement is:',['Lighter weight','Use in columns and beams','Higher tensile strength','Speed and ease of installation'],3,'Speed and ease of installation (18.2).'],
 ['18-6','18.5','Kinds of welded splices','Welded splices are either lap welds or:',['Hooked welds','Tied welds','Butt welds','Mechanical welds'],2,'Lap or butt welds (18.5).'],
 ['18-7','18.5','Keeping bars in position','To resist displacement, reinforcing bars must be:',['Welded together','Tied together','Hooked','Painted'],1,'Tied together (18.5).'],
 ['18-8','18.5','Risk of field bending','Field bending of reinforcement tends to cause:',['Loss of ductility','Loss of compressive strength','Loss of bond','Expansion'],0,'Loss of ductility (18.5).'],
 ['18-9','18.2','Carbon-steel bar grades','Carbon-steel reinforcing bars come in Grades:',['35, 40 and 50','40, 50 and 60','40, 60 and 75','60, 75 and 90'],2,'Grades 40, 60 and 75 (18.2).'],
 ['18-10','18.2','Third rib on a bar','A third longitudinal rib on a bar, besides the two main ribs, indicates:',['Low-alloy steel','Grade 60','Grade 75','Rail steel'],1,'Grade 60 (18.2).'],
 ['18-11','18.5','Wire bar supports','Factory-made wire bar supports may be made of:',['Plain wire','Galvanized wire','Stainless steel wire','Any of these'],3,'Any of these (18.5).'],
 ['18-12','18.4','Rebar shipment list','A fabricator\'s rebar shipment comes with a list called a:',['Manifest','Invoice','Batch ticket','Bill of lading only'],0,'A manifest (18.4).'],
 ['18-13','18.2','Most-used bar steel','The most widely used reinforcing bars are:',['Rail steel','Axle steel','Carbon steel','Low-alloy steel'],2,'Carbon steel (18.2).'],
 ['18-14','18.1','Why concrete is reinforced','Reinforcement in concrete helps resist:',['Tension only','Shrinkage only','Cracking only','Tension, shrinkage, cracking and expansion'],3,'All of these (18.1).'],
 ['18-16','Figure 18-15','Placing drawing: grade beam stirrups','On the Manual\'s placing drawing (Figure 18-15), the stirrups at each end of grade beam GB1 are:',['3 at 5 in','3 at 6 in','4 at 5 in','4 at 6 in'],3,'4 at 6 in, read from Figure 18-15.'],
 ['18-17','Figure 18-15','Placing drawing: footing F2 bars','On the Manual\'s placing drawing (Figure 18-15), footing F2 reinforcement each way is:',['12 #19','24 #19','10 #22','16 #22'],0,'12 #19, read from Figure 18-15.'],
 ['18-18','Figure 18-15','Placing drawing: dowel tolerance','On Figure 18-15, the column D1 footing dowels may extend how far into the column and still be within ±2 in?',['2 ft 0 in','2 ft 6 in','2 ft 8 in','3 ft 0 in'],2,'2 ft 8 in is within tolerance (Figure 18-15).'],
 ['18-19','18.5','Supports for WWR on grade','Suggested support spacing for D9 WWR at 14-in wire spacing in a slab-on-ground:',['2–3 ft','3–4 ft','4–6 ft','6–8 ft'],2,'4 to 6 ft (18.5).'],
 ['18-20','18.5','Welding #6 carbon bars, no mill report','Without a mill test report, #6 carbon-steel bars may be welded if preheated to:',['100 °F','200 °F','300 °F','500 °F'],2,'300 °F (18.5).'],
 ['18-21','18.5','Welding #6 low-alloy bars, no mill report','Without a mill test report, #6 low-alloy (A706) bars may be welded with a preheat of:',['50 °F','200 °F','300 °F','No preheat required'],3,'No preheat is required (18.5).'],
 ['18-22','Table 18.6','Cover tolerance: 8-in panel','An 8-in tilt-up panel shows 1½ in cover to the vertical bars. Minimum acceptable measured cover:',['3/4 in','1 in','1-1/8 in','1-1/4 in'],2,'1-1/8 in: 1½ in minus the 3/8 in tolerance for members 8 in or less deep (workbook key: Table 18.6). Check the table number in your Manual.'],
 ['18-23','Table 18.7','Cover tolerance: 24-in beam','A 24-in deep spandrel beam shows 1½ in clear cover to the bottom bars. Minimum acceptable measured cover:',['1 in','1-1/8 in','1-1/4 in','1-3/8 in'],0,'1 in: 1½ in minus the ½ in tolerance for members deeper than 8 in (workbook key: Table 18.7). Check the table number in your Manual.'],
 ['18-24','Table 18.7','Bar end location tolerance','Bottom bars in an end span are to stop 3 ft from the center of the interior support. Minimum acceptable measured distance:',['2 ft 8 in','2 ft 9 in','2 ft 10 in','3 ft 0 in'],2,'2 ft 10 in, a 2 in tolerance (workbook key: Table 18.7).'],
 ['18-45','18.2','Grade marks on bars','Grade 60 bars are marked with ___ longitudinal line or the number 60; Grade 75 with ___ lines or the number 75.',['One; two','Two; three','One; three','No; one'],0,'One line or "60"; two lines or "75" (18.2).'],
 ['18-46','18.5','Draping rolled wire fabric','Rolled wire fabric is draped from near the top of the slab over the beams to the ___ at midspan, keeping the required cover.',['Top','Bottom','Middle','Subgrade'],1,'To the bottom at midspan (18.5).'],
 ['18-47','18.6','Why epoxy coating began','Epoxy-coated bars were first developed for highway bridge decks exposed to:',['Sulfate soils','Freezing, thawing and deicing salts','Seawater only','High heat'],1,'Freezing, thawing and deicing salts (18.6).'],
 ['18-48','18.4','Storing rebar on site','On site, steel is stored:',['Directly on the ground','On platforms or supports off the ground, away from mud splatter','Under water','In the sun only'],1,'On platforms or other supports, protected from damage, dirt, mud and rust (18.4).'],
 ['18-49','18.3','What a bar list classifies','A bar list classifies bars by:',['Supplier','Size, length, and straight or bent','Color','Weight only'],1,'Size, length, and whether straight or bent (18.3).'],
 ['18-50','18.3','Straight bar tolerance','The typical fabrication tolerance for the length of a straight bar is:',['±1/4 in','±1/2 in','±1 in','±2 in'],2,'Plus or minus 1 in (18.3).'],
 ['18-51','18.5','Holding bars off the forms','Distances from subgrade and forms are kept with:',['Bricks','Chairs, ties, hangers or other approved supports','Wood blocks only','Nothing'],1,'Chairs, ties, hangers or other approved supports (18.5).'],
 ['18-52','18.4','Heating bars to bend','Heating reinforcement to bend it is allowed only with approval of:',['The ironworker foreman','The building official, with the engineer\'s concurrence','The supplier','The owner'],1,'Building official with the engineer\'s concurrence; heat and air-cool slowly (18.4).'],
 ['18-53','18.1','Slab temperature reinforcement','Temperature reinforcement in slabs controls cracks from expansion and contraction, but it does not:',['Carry load','Prevent cracking','Need cover','Need ties'],1,'It does not prevent cracking (18.1).'],
 ['18-54','18.2','Who specifies bar grade','Reinforcing steel grades are specified by the designer and shown on the:',['Delivery ticket only','Plans and bar lists','Mill report only','Permit'],1,'Plans and bar lists (18.2).']]);
TF(18,[
 ['18-25','18.2','Bar mats','Bar mats are like WWR but made with reinforcing bars.','Bar mats are WWR made of smooth wire.'],
 ['18-27','18.5','When bars are tied','Bars are tied after they are placed and spaced properly.','Bars are tied before they are placed and spaced.'],
 ['18-28','18.5','Purpose of cover','The main purpose of concrete cover is to protect the steel from weathering.','Concrete cover exists mainly to save concrete.'],
 ['18-29','18.2','Heavy WWR use','Heavy WWR comes in flat sheets and is used mainly as structural reinforcement.','Heavy WWR comes only in rolls and is never structural.'],
 ['18-32','18.5','Class 1 supports','Class 1 metal supports are plastic-protected wire supports for moderate to severe exposure.','Class 1 metal supports are bare wire for interior exposure only.'],
 ['18-33','18.6','Supports for epoxy bars','Supports for epoxy-coated bars should be coated with a dielectric such as plastic.','Supports for epoxy-coated bars should be bare steel.'],
 ['18-34','18.3','Standard 180° hook','A standard 180° hook is the bend plus 4 bar diameters, but not less than 2½ in at the free end.','A standard 180° hook needs no extension past the bend.'],
 ['18-35','18.5','Pre-assembled cages','Bars, stirrups and ties can be pre-assembled into cages at a convenient spot.','Reinforcement may never be pre-assembled into cages.'],
 ['18-39','Table 18.2','#9 vs bar marked 19','If the drawings call for #9 and the bar is marked 19, the inspector should tell the contractor it is the wrong size.','A bar marked 19 is the same as a #9 bar.'],
 ['18-41','18.4','Epoxy as surface condition','Epoxy coating is an acceptable surface condition for reinforcement.','Epoxy coating is an unacceptable surface condition.'],
 ['18-42','18.9','FRP bars','FRP bars greatly improve longevity where corrosion is a major factor.','FRP bars shorten the life of structures exposed to corrosion.'],
 ['18-44','18.2','WWR sheet length','A WWR flat sheet\'s length dimension includes the end overhangs.','A WWR flat sheet\'s length excludes the end overhangs.']],
[
 ['18-26','18.3','Hot bending in cold weather','All bends are made at room temperature, except that hot bending is allowed in cold weather.'],
 ['18-30','18.4','Light rust and bond','A light coat of rust can reduce bond and cause spalling and cracking.'],
 ['18-31','18.2','WWR smooth-wire letter','In WWR designations, smooth wire is marked with the letter "F".'],
 ['18-37','18.2','How bars are made','Reinforcing bars are cold rolled to size and deformation pattern.'],
 ['18-38','18.2','Metric bar sizes','US metric bar sizes approximate the inch-pound diameter in meters.'],
 ['18-40','Figure 18-4','#14 Grade 75 marked 43/5','A bar marked 43 with grade mark 5, placed where a Grade 75 #14 is specified, is the wrong bar.'],
 ['18-43','18.2','WWR sheet width','A WWR flat sheet\'s width dimension includes the end overhangs.']]);

/* ---------------- Chapter 19 Hot and Cold Weather Concreting ---------------- */
MC(19,[
 ['19-1','19.1','Effects of hot weather','Which is NOT an effect of hot weather on concrete?',['Faster setting','More plastic shrinkage','A lower mixing-water demand','Faster slump loss'],2,'Hot weather raises water demand; it does not lower it (19.1).'],
 ['19-2','19.3','Start of cold weather precautions','Cold-weather considerations should begin when the temperature drops below:',['25 °F','32 °F','40 °F','50 °F'],2,'40 °F (19.3).'],
 ['19-3','19.4','Never place on','Concrete should never be placed:',['On unreinforced slabs','On a frozen subgrade','Above 85 °F','Below 45 °F'],1,'Never on a frozen subgrade (19.4).'],
 ['19-4','19.4','Accelerating prestressed in cold','Which should NOT be used to accelerate prestressed concrete in cold weather?',['Air entrainment','Calcium chloride','A water-reducing admixture','Steam'],1,'Calcium chloride (19.4).'],
 ['19-5','19.2','Cheapest way to cool concrete','An economical, effective way to reduce hot-weather effects is to cool the:',['Mixing water','Sand','Cement','Subgrade'],0,'Cool the mixing water (19.2).'],
 ['19-6','Figure 19-3','Extra water when concrete warms','Using Figure 19-3: a 10 cu yd batch warms from 50 °F to 75 °F in transit. About how much extra water keeps the same slump?',['10 gal','20 gal','30 gal','40 gal'],1,'About 20 gal for 10 cu yd, read from Figure 19-3.'],
 ['19-7','19.3','Cold weather effects','Without precautions, cold weather can cause:',['Slower setting and strength gain','Permanent damage from early freezing','Reduced durability','All of these'],3,'All of these (19.3).'],
 ['19-8','19.2','Ways to cool ingredients','Which are acceptable ways to cool concrete ingredients in hot weather?',['Sprinkling coarse aggregate piles','Ice as part of the mixing water','Liquid nitrogen in the truck, or cold air in the bins','All of these'],3,'All of these (19.2).'],
 ['19-16','19.4','Heating aggregates','Aggregates should NOT be heated when:',['It is below freezing','Heating the mixing water alone would deliver concrete at the required temperature','The aggregate is wet','Using Type III cement'],1,'Heat only the water if that is enough; uniform heating of aggregate is difficult (19.4).'],
 ['19-17','19.3','Cool-cured strength','Concrete made and cured between about ___ develops higher later strength than standard-cured concrete.',['20 and 40 °F','40 and 70 °F','70 and 90 °F','90 and 110 °F'],1,'Between 40 and 70 °F (19.3).'],
 ['19-18','19.2','Mixing in hot weather','In hot weather, mixing should be:',['As long as possible','The minimum that gives uniformity and quality; avoid overmixing','Doubled','Done with extra water'],1,'Minimum mixing for uniformity and quality; avoid overmixing (19.2).'],
 ['19-19','19.1','Hot weather and durability','Poor hot-weather precautions tend to:',['Improve durability','Hurt durability and freeze-thaw resistance, and reduce resistance to aggressive solutions','Have no effect','Only change color'],1,'A negative effect on durability and resistance (19.1).'],
 ['19-20','19.3','Indirect cold-weather damage','An indirect effect of low temperature is:',['Faster strength gain','Cracking of dried areas when the surface is not protected from heaters','More bleeding','Higher slump'],1,'Dehydrated areas crack when not protected from heaters; corners and edges of green concrete can freeze (19.3).']]);
TF(19,[
 ['19-11','19.2','Hot weather placing plan','In hot weather, plan to receive and place concrete as fast as possible, with enough equipment and workers.','In hot weather, slow placement with a small crew is best.'],
 ['19-12','19.1','High temperature and strength','High temperatures can lower ultimate strength compared with concrete placed at moderate temperatures.','High temperatures always raise ultimate strength.'],
 ['19-14','Figure 19-3','Lab at 50 °F, batch at 75 °F','A mix designed at 50 °F needs more water and cement when batched at 75 °F to keep strength and slump.','A mix designed at 50 °F needs no change when batched at 75 °F.']],
[
 ['19-9','19.1','Water per 10 °F rise','Concrete needs about 7 pounds more water for each 10 °F rise in temperature.'],
 ['19-10','19.4','Heated water temperature','Heated mixing water should be over 175 °F.'],
 ['19-13','19.2','Drying between waterings','In hot weather, letting the surface dry between waterings is harmless except with Type III cement.'],
 ['19-15','19.2','Calcium chloride to cool','Calcium chloride is an economical admixture for cooling concrete in hot weather.']]);

G11.Q.push(...out);
G11.LKCM=(G11.LKCM||[]).concat(LKC);
})();
