"use client";
import {useEffect,useState} from "react";

/* ──────────────────────────────────────────────────────────────────
   SYLLABUS TREE — subjects → topics → subtopics
   Each leaf is a tag key: "Subject|Topic|Subtopic"
   ────────────────────────────────────────────────────────────────── */
const TREE=[
{s:"Indian Polity & Constitution",topics:[
 {t:"Constitutional Framework",sub:["Basic Structure","Preamble","Fundamental Rights","DPSP","Fundamental Duties","Amendments"]},
 {t:"Union Executive",sub:["President","Vice President","Prime Minister","Council of Ministers","Attorney General"]},
 {t:"Parliament",sub:["Lok Sabha","Rajya Sabha","Legislative Process","Parliamentary Committees","Anti-Defection"]},
 {t:"Judiciary",sub:["Supreme Court","High Courts","Judicial Review","PIL","Judicial Activism"]},
 {t:"State Government",sub:["Governor","Chief Minister","State Legislature","State Council of Ministers"]},
 {t:"Local Government",sub:["Panchayati Raj","Municipalities","Urban Local Bodies","73rd & 74th Amendments"]},
 {t:"Constitutional Bodies",sub:["Election Commission","CAG","UPSC","Finance Commission","NCBC","NCSC"]},
 {t:"Federalism",sub:["Centre-State Relations","Inter-State Council","Zonal Councils","Centre's Emergency Powers"]},
]},
{s:"Indian History & Culture",topics:[
 {t:"Ancient India",sub:["Indus Valley","Vedic Age","Buddhism & Jainism","Maurya Empire","Gupta Empire"]},
 {t:"Medieval India",sub:["Delhi Sultanate","Mughal Empire","Bhakti Movement","Sufi Movement","Maratha Empire"]},
 {t:"Modern India",sub:["Advent of British","1857 Revolt","Indian National Movement","Gandhian Era","Partition"]},
 {t:"Art & Culture",sub:["Architecture","Painting","Music & Dance","Literature","Festivals"]},
]},
{s:"Rajasthan History & Culture",topics:[
 {t:"Early History",sub:["Rajput Dynasties","Prithviraj Chauhan","Mewar Dynasty","Marwar Dynasty"]},
 {t:"Freedom Struggle",sub:["1857 in Rajasthan","Praja Mandal Movement","Integration of Rajasthan","Role of Leaders"]},
 {t:"Art & Culture",sub:["Folk Dances","Folk Music","Paintings","Crafts","Fairs & Festivals"]},
 {t:"Architecture",sub:["Forts","Palaces","Temples","Step Wells"]},
]},
{s:"Indian Geography",topics:[
 {t:"Physical Geography",sub:["Physiography","Drainage System","Climate","Soils","Natural Vegetation"]},
 {t:"Economic Geography",sub:["Agriculture","Minerals","Industries","Transport","Energy"]},
 {t:"Human Geography",sub:["Population","Settlements","Migration","Literacy"]},
]},
{s:"Rajasthan Geography",topics:[
 {t:"Physical",sub:["Physiography","Desert","Aravalli Range","Drainage","Climate"]},
 {t:"Resources",sub:["Minerals","Soils","Irrigation","Forest Cover"]},
 {t:"Administrative",sub:["Districts","Divisions","Demographics","Livestock"]},
]},
{s:"Indian Economy",topics:[
 {t:"Basic Concepts",sub:["National Income","GDP & GVA","Inflation","Money Supply","Banking System"]},
 {t:"Public Finance",sub:["Union Budget","Tax Structure","Fiscal Policy","Government Schemes"]},
 {t:"Sectors",sub:["Agriculture","Industry","Services","External Sector","Balance of Payments"]},
 {t:"Financial Markets",sub:["RBI","Stock Market","Insurance","Pension System"]},
]},
{s:"Rajasthan Economy",topics:[
 {t:"State Finance",sub:["State Budget","Tax Revenue","Plan Outlay","Flagship Schemes"]},
 {t:"Sectors",sub:["Agriculture","Industries","Tourism","Handicrafts","Power Sector"]},
 {t:"Development",sub:["Rajasthan Model","Investment Potential","MSME","Skill Development"]},
]},
{s:"Science & Technology",topics:[
 {t:"Physical Sciences",sub:["Physics Basics","Chemistry Basics","Space Technology","Nuclear Science"]},
 {t:"Life Sciences",sub:["Biology Basics","Human Health","Biotechnology","Diseases & Vaccines"]},
 {t:"IT & Digital",sub:["Digital India","AI & ML","Cybersecurity","E-Governance"]},
 {t:"Defence & Space",sub:["ISRO Missions","DRDO","Defence Systems","Nuclear Program"]},
]},
{s:"Environment & Ecology",topics:[
 {t:"Ecology",sub:["Ecosystems","Biodiversity","Food Chains","Conservation"]},
 {t:"Environmental Issues",sub:["Pollution","Climate Change","Global Warming","Waste Management"]},
 {t:"Conservation",sub:["Wildlife Protection","National Parks","Tiger Reserves","Biosphere Reserves"]},
 {t:"Policies & Laws",sub:["Environmental Clearance","Forest Act","Wildlife Act","Paris Agreement"]},
]},
{s:"Current Affairs",topics:[
 {t:"National Affairs",sub:["Government Schemes","Policy Changes","Judgments","Elections"]},
 {t:"International Affairs",sub:["Foreign Policy","Treaties","UN & Global Bodies","Geopolitics"]},
 {t:"Rajasthan Affairs",sub:["State Policies","Schemes","Appointments","Key Events"]},
 {t:"Sports & Awards",sub:["Sports Events","Awards & Honours","Books & Authors","Obituaries"]},
]},
{s:"Reasoning & Mental Ability",topics:[
 {t:"Verbal Reasoning",sub:["Analogy","Classification","Series","Coding-Decoding","Blood Relations"]},
 {t:"Non-Verbal",sub:["Mirror Images","Paper Folding","Embedded Figures","Pattern Completion"]},
 {t:"Quantitative",sub:["Number System","Percentage","Ratio","Time & Work","Data Interpretation"]},
]},
{s:"Public Administration",topics:[
 {t:"Administrative Theory",sub:["Principles","Organisation","Good Governance","Accountability"]},
 {t:"Rajasthan Administration",sub:["State Secretariat","District Administration","Panchayati Raj","Urban Administration"]},
 {t:"Civil Services",sub:["RAS Examination","Role of RAS Officer","Ethics in Administration","RTI"]},
 {t:"Public Policy",sub:["Policy Formulation","Implementation","Evaluation","Citizen-Centric Administration"]},
]},
{s:"Ethics & Integrity",topics:[
 {t:"Ethics Basics",sub:["Ethical Theories","Values","Integrity","Probity in Governance"]},
 {t:"Case Studies",sub:["Administrative Dilemmas","Conflict of Interest","Corruption","Whistleblowing"]},
 {t:"Aptitude",sub:["Emotional Intelligence","Attitude","Leadership","Decision Making"]},
]},
{s:"International Relations",topics:[
 {t:"India's Foreign Policy",sub:["Non-Alignment","Neighborhood Policy","Look East/Act East"]},
 {t:"Major Powers",sub:["India-US","India-Russia","India-China","India-EU"]},
 {t:"Multilateral",sub:["UNO","SAARC","BRICS","WTO","G20"]},
]},
{s:"Social Issues & Schemes",topics:[
 {t:"Social Sector",sub:["Education","Health","Women & Child","Poverty","Employment"]},
 {t:"Welfare Schemes",sub:["Central Schemes","Rajasthan Schemes","Subsidies","Social Security"]},
 {t:"Vulnerable Groups",sub:["SC/ST","OBC","Minorities","Persons with Disabilities","Senior Citizens"]},
]},
];

/* Flatten for quick lookups */
const ALL_SUBJECTS=TREE.map(x=>x.s);
function tagKey(s,t,st){return st?`${s}|${t}|${st}`:`${s}|${t}`}

const defaults={model:"sarvam-105b",apiUrl:"",apiKey:""};
async function safeJson(r){const raw=await r.text();let d;try{d=JSON.parse(raw)}catch{throw Error(raw?.slice(0,800)||`Server returned non-JSON response (${r.status})`)}return d}

export default function Home(){
const[q,setQ]=useState([]),[text,setText]=useState(""),[busy,setBusy]=useState(false),[msg,setMsg]=useState(""),[settings,setSettings]=useState(defaults),[showSettings,setShowSettings]=useState(false),[search,setSearch]=useState(""),[subject,setSubject]=useState("All"),[test,setTest]=useState(null),[pos,setPos]=useState(0),[picked,setPicked]=useState(null),[score,setScore]=useState(0),[selected,setSelected]=useState(new Set()),[editing,setEditing]=useState(null),[attempting,setAttempting]=useState(null),[attemptPick,setAttemptPick]=useState(null),[attemptReveal,setAttemptReveal]=useState(false);

/* ── Dashboard state ── */
const[view,setView]=useState("bank"); /* "bank" | "dashboard" */
const[dashSel,setDashSel]=useState(new Set()); /* selected tag keys */
const[expandedSubj,setExpandedSubj]=useState(new Set([ALL_SUBJECTS[0]]));
const[expandedTopic,setExpandedTopic]=useState(new Set());
const[attempts,setAttempts]=useState({}); /* {tagKey: {correct, total}} */

/* ── Load from localStorage ── */
useEffect(()=>{try{
  const s=localStorage.getItem("adaptive-settings"),b=localStorage.getItem("adaptive-bank"),a=localStorage.getItem("adaptive-attempts");
  if(s)setSettings({...defaults,...JSON.parse(s)});if(b)setQ(JSON.parse(b));if(a)setAttempts(JSON.parse(a))
}catch{}},[]);

/* ── Persist ── */
useEffect(()=>{localStorage.setItem("adaptive-bank",JSON.stringify(q))},[q]);
useEffect(()=>{localStorage.setItem("adaptive-attempts",JSON.stringify(attempts))},[attempts]);

/* ── Attempt tracking ── */
function recordAttempt(question,correct){
  if(!question.subject)return;
  const keys=new Set();
  if(question.subject)keys.add(tagKey(question.subject,question.topic,question.subtopic));
  if(question.subject&&question.topic)keys.add(tagKey(question.subject,question.topic,null));
  keys.forEach(k=>{
    const cur=attempts[k]||{correct:0,total:0};
    setAttempts(prev=>({...prev,[k]:{correct:cur.correct+(correct?1:0),total:cur.total+1}}));
  });
}
function acc(k){const a=attempts[k];if(!a||a.total===0)return null;return a.correct/a.total}
function colorForTag(k){
  const a=acc(k);
  if(a===null)return"white";     /* not attempted */
  if(a<0.2)return"red";         /* under 20% */
  if(a<0.5)return"yellow";      /* 20-50% */
  if(a<0.8)return"green";       /* 50-80% */
  return"blue";                 /* near-perfect 80%+ */
}
const TAG_STYLE={white:{background:"#fff",color:"#172033",border:"1px solid #ccd4df"},red:{background:"#fff1f1",color:"#c33",border:"1px solid #c33"},yellow:{background:"#fffdf0",color:"#b8860b",border:"1px solid #e0c040"},green:{background:"#effaf1",color:"#1a7a32",border:"1px solid #238636"},blue:{background:"#e8f0ff",color:"#1a4fa0",border:"1px solid #3b6fd4"}};

/* ── Dashboard expand/collapse ── */
function toggleSubj(s){setExpandedSubj(p=>{const n=new Set(p);if(n.has(s))n.delete(s);else n.add(s);return n})}
function toggleTopic(t){setExpandedTopic(p=>{const n=new Set(p);if(n.has(t))n.delete(t);else n.add(t);return n})}

/* ── Dashboard selection ── */
function toggleDashTag(key){
  setDashSel(p=>{const n=new Set(p);if(n.has(key))n.delete(key);else n.add(key);return n});
}
function selectAllSubj(s){
  const subj=TREE.find(x=>x.s===s);if(!subj)return;
  const keys=new Set(dashSel);
  let allSelected=true;
  for(const tp of subj.topics){
    const tk=tagKey(s,tp.t,null);
    if(!keys.has(tk))allSelected=false;
    for(const st of tp.sub){const k=tagKey(s,tp.t,st);if(!keys.has(k))allSelected=false}
  }
  if(allSelected){for(const tp of subj.topics){keys.delete(tagKey(s,tp.t,null));for(const st of tp.sub)keys.delete(tagKey(s,tp.t,st))}}
  else{for(const tp of subj.topics){keys.add(tagKey(s,tp.t,null));for(const st of tp.sub)keys.add(tagKey(s,tp.t,st))}}
  setDashSel(keys);
}

/* ── Build test from dashboard selection ── */
function startDashTest(){
  if(!dashSel.size){setMsg("Select topics from the dashboard first.");return}
  const pool=q.filter(x=>{
    if(!x.subject)return false;
    const k1=tagKey(x.subject,x.topic,x.subtopic);
    const k2=tagKey(x.subject,x.topic,null);
    return dashSel.has(k1)||dashSel.has(k2);
  });
  if(!pool.length){setMsg("No questions match the selected topics. Extract and label questions first.");return}
  const a=[...pool].sort(()=>Math.random()-0.5).slice(0,20);
  setTest(a);setPos(0);setPicked(null);setScore(0);setView("bank");
}

/* ── Parse pasted text into questions ── */
async function process(){
  if(!text.trim()){setMsg("Paste extracted question-paper text first.");return}
  setBusy(true);setMsg("Extracting questions…");
  try{
    const r=await fetch("/api/parse",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text,...settings})}),d=await safeJson(r);
    if(!r.ok)throw Error(d.error||"Question extraction failed");
    const incoming=(d.questions||[]).map((x,i)=>({...x,id:crypto.randomUUID?.()||Date.now()+i,source:"Pasted text"}));
    if(!incoming.length)throw Error("No questions detected. Use ? at the beginning of each question.");
    setQ(incoming);setMsg(`${incoming.length} questions extracted. Click AI Label to classify them.`)
  }catch(e){setMsg(e.message)}finally{setBusy(false)}
}

/* ── AI labeling — one question at a time ── */
async function tagOne(question){
  const r=await fetch("/api/tag",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({questions:[question],batchSize:1,...settings})}),d=await safeJson(r);
  if(!r.ok)throw Error(d.error||"AI labeling failed");
  return(d.questions||[])[0]||question;
}
async function tag(){
  const targets=q.length?q:[];if(!targets.length)return;
  setBusy(true);const updated=[...q];
  for(let i=0;i<targets.length;i++){
    setMsg(`Labeling Q${i+1} of ${targets.length}…`);
    try{const labeled=await tagOne(targets[i]);const idx=q.indexOf(targets[i]);if(idx>=0)updated[idx]={...updated[idx],...labeled};setQ([...updated])}
    catch(e){setMsg(`AI labeling error at Q${i+1}: ${e.message}`);setBusy(false);return}
  }
  setMsg("AI labeling complete.");setBusy(false)
}
async function tagSelected(){
  const targets=q.filter(x=>selected.has(x.id));if(!targets.length){setMsg("Select questions first.");return}
  setBusy(true);const updated=[...q];
  for(let i=0;i<targets.length;i++){
    setMsg(`Labeling Q${i+1} of ${targets.length}…`);
    try{const labeled=await tagOne(targets[i]);const idx=q.indexOf(targets[i]);if(idx>=0)updated[idx]={...updated[idx],...labeled};setQ([...updated])}
    catch(e){setMsg(`AI labeling error at Q${i+1}: ${e.message}`);setBusy(false);return}
  }
  setMsg(`Labeled ${targets.length} selected questions.`);setSelected(new Set());setBusy(false)
}

/* ── Selection helpers (question bank) ── */
function toggleSel(id){setSelected(s=>{const n=new Set(s);if(n.has(id))n.delete(id);else n.add(id);return n})}
function toggleAll(){if(selected.size===filtered.length)setSelected(new Set());else setSelected(new Set(filtered.map(x=>x.id)))}

/* ── Manual label / edit / delete ── */
function manualLabel(id,field,val){setQ(q.map(x=>x.id===id?{...x,[field]:val}:x))}
function editQ(id,field,val){setQ(q.map(x=>x.id===id?{...x,[field]:val}:x))}
function editOption(id,idx,val){setQ(q.map(x=>{if(x.id!==id)return x;const opts=[...(x.options||[])];opts[idx]=val;return{...x,options:opts}}))}
function deleteQ(id){setQ(q.filter(x=>x.id!==id));if(editing===id)setEditing(null);if(attempting===id)setAttempting(null)}

/* ── Inline attempt (practice a single question) ── */
function startAttempt(id){setAttempting(id);setAttemptPick(null);setAttemptReveal(false)}
function attemptAnswer(i){if(attemptReveal)return;setAttemptPick(i);setAttemptReveal(true);
  const x=q.find(qq=>qq.id===attempting);
  if(x&&x.answer!=null)recordAttempt(x,x.answer===i);
}

/* ── Full test mode ── */
const filtered=q.filter(x=>(subject==="All"||x.subject===subject)&&(x.text||"").toLowerCase().includes(search.toLowerCase()));
function startTest(){const a=[...filtered].sort(()=>Math.random()-0.5).slice(0,20);if(a.length){setTest(a);setPos(0);setPicked(null);setScore(0)}}
function answer(i){if(picked!==null)return;setPicked(i);if(test[pos].answer!=null&&test[pos].answer===i)setScore(s=>s+1)}
function next(){
  if(pos+1>=test.length){
    const graded=test.filter(q=>q.answer!=null).length;
    alert(`Score: ${score}/${graded}${graded<test.length?` (${test.length-graded} without answer key)`:``}`);setTest(null)
  }else{setPos(pos+1);setPicked(null)}
}
function save(){localStorage.setItem("adaptive-settings",JSON.stringify(settings));setShowSettings(false);setMsg("Settings saved.")}

/* ══════════════════════════════════════════════════════════════════
   TEST MODE RENDER
   ══════════════════════════════════════════════════════════════════ */
if(test)return (
<main style={S.page}><header style={S.header}>
<button style={S.brand} onClick={()=>{setTest(null)}}>Adaptive Syllabus</button>
<nav><small>TEST {pos+1}/{test.length} · Score: {score}</small></nav>
</header>
<section style={S.wrap}><small>TEST {pos+1}/{test.length}</small>
<h1>{test[pos].text}</h1>
{(test[pos].options||[]).map((o,i)=>(
<button key={i} onClick={()=>answer(i)} style={{...S.option,...(picked===i?(test[pos].answer==null?S.neutral:(test[pos].answer===i?S.good:S.bad)):{})}}>{String.fromCharCode(65+i)}. {o}</button>
))}
{picked!==null&&<div style={S.review}>{test[pos].answer==null?<small>No answer key for this question.</small>:<small>Correct answer: {String.fromCharCode(65+test[pos].answer)}</small>}</div>}
{picked!==null&&<button style={S.primary} onClick={next}>{pos+1===test.length?"Finish":"Next"}</button>}
</section></main>
);

/* ══════════════════════════════════════════════════════════════════
   MAIN RENDER (Bank or Dashboard)
   ══════════════════════════════════════════════════════════════════ */
return (
<main style={S.page}>
<header style={S.header}>
<button style={S.brand} onClick={()=>location.reload()}>Adaptive Syllabus <small>TEXT ⇄ AI ⇉ TEST</small></button>
<nav>
<button style={view==="bank"?S.navActive:S.navBtn} onClick={()=>setView("bank")}>Bank</button>
<button style={view==="dashboard"?S.navActive:S.navBtn} onClick={()=>setView("dashboard")}>Dashboard</button>
<button onClick={()=>setShowSettings(true)}>⚙</button>
</nav>
</header>

{view==="dashboard"?(
/* ══════════ DASHBOARD VIEW ══════════ */
<section style={S.wrap}>
<div style={S.dashHero}>
<div>
<small>SYLLABUS DASHBOARD</small>
<h1>Track your progress across the syllabus.</h1>
<p>Click any topic or subtopic to select it. Color shows your accuracy: <span style={S.lgWhite}>White</span> = not attempted, <span style={S.lgRed}>Red</span> = under 20%, <span style={S.lgYellow}>Yellow</span> = 20-50%, <span style={S.lgGreen}>Green</span> = 50-80%, <span style={S.lgBlue}>Blue</span> = 80%+.</p>
</div>
<div style={S.dashStat}>
<b style={{fontSize:32}}>{dashSel.size}</b><small>topics selected</small>
<button style={{...S.primary,marginTop:10}} onClick={startDashTest} disabled={!dashSel.size||!q.length}>▶ Start Test ({dashSel.size?Math.min(20,q.filter(x=>{const k1=tagKey(x.subject,x.topic,x.subtopic),k2=tagKey(x.subject,x.topic,null);return dashSel.has(k1)||dashSel.has(k2)}).length,0):0} questions)</button>
</div>
</div>

{msg&&<div style={S.msg}>{msg}</div>}

{/* Legend */}
<div style={S.legend}>
<span style={{...S.tagPill,...TAG_STYLE.white}}>Not attempted</span>
<span style={{...S.tagPill,...TAG_STYLE.red}}>< 20%</span>
<span style={{...S.tagPill,...TAG_STYLE.yellow}}>20-50%</span>
<span style={{...S.tagPill,...TAG_STYLE.green}}>50-80%</span>
<span style={{...S.tagPill,...TAG_STYLE.blue}}>80%+</span>
</div>

{/* Tree */}
<div style={S.treeWrap}>
{TREE.map(subj=>{
  const isExp=expandedSubj.has(subj.s);
  const subjAllSel=isExp&&subj.topics.every(tp=>dashSel.has(tagKey(subj.s,tp.t,null)));
  return (
  <div key={subj.s} style={S.treeSubj}>
    <div style={S.treeRow} onClick={()=>toggleSubj(subj.s)}>
      <span style={S.arrow}>{isExp?"▾":"▸"}</span>
      <input type="checkbox" checked={subjAllSel} onClick={e=>e.stopPropagation()} onChange={()=>selectAllSubj(subj.s)} style={S.treeChk}/>
      <b style={{fontSize:15}}>{subj.s}</b>
      {(()=>{
        const allKeys=[];subj.topics.forEach(tp=>{allKeys.push(tagKey(subj.s,tp.t,null));tp.sub.forEach(st=>allKeys.push(tagKey(subj.s,tp.t,st)))});
        const att=allKeys.filter(k=>acc(k)!==null).length;
        return <small style={{color:"#888"}}>{att}/{allKeys.length} attempted</small>
      })()}
    </div>
    {isExp&&subj.topics.map(tp=>{
      const tk=tagKey(subj.s,tp.t,null);
      const tpExp=expandedTopic.has(tk);
      const tpAllSel=dashSel.has(tk)&&tp.sub.every(st=>dashSel.has(tagKey(subj.s,tp.t,st)));
      return (
      <div key={tk} style={S.treeTopic}>
        <div style={{...S.treeRow,paddingLeft:28}} onClick={()=>toggleTopic(tk)}>
          <span style={S.arrow}>{tpExp?"▾":"▸"}</span>
          <input type="checkbox" checked={tpAllSel} onClick={e=>e.stopPropagation()} onChange={()=>{const keys=new Set(dashSel);const allSel=dashSel.has(tk)&&tp.sub.every(st=>dashSel.has(tagKey(subj.s,tp.t,st)));if(allSel){keys.delete(tk);tp.sub.forEach(st=>keys.delete(tagKey(subj.s,tp.t,st)))}else{keys.add(tk);tp.sub.forEach(st=>keys.add(tagKey(subj.s,tp.t,st)))}setDashSel(keys)}} style={S.treeChk}/>
          <span style={{fontWeight:600,fontSize:14,color:"#2a3a5a"}}>{tp.t}</span>
          <span style={{...S.tagPill,...TAG_STYLE[colorForTag(tk)],fontSize:11}}>
            {acc(tk)===null?"—":`${Math.round(acc(tk)*100)}% (${attempts[tk]?.total||0})`}
          </span>
        </div>
        {tpExp&&<div style={{paddingLeft:48,display:"flex",gap:6,flexWrap:"wrap",margin:"4px 0 8px"}}>
          {tp.sub.map(st=>{
            const k=tagKey(subj.s,tp.t,st);
            const sel=dashSel.has(k);
            const c=colorForTag(k);
            const a=acc(k);
            return (
            <span key={k} onClick={()=>toggleDashTag(k)} style={{...S.tagPill,...TAG_STYLE[c],cursor:"pointer",border:sel?"2px solid #172033":TAG_STYLE[c].border,fontWeight:sel?700:400}}>
              {st}
              <small style={{opacity:0.7,marginLeft:4}}>{a===null?"":`${Math.round(a*100)}%`}</small>
            </span>
            )
          })}
        </div>}
      </div>
      )
    })}
  </div>
  )
})}
</div>
</section>
):(
/* ══════════ QUESTION BANK VIEW ══════════ */
<section style={S.wrap}>
{/* Hero */}
<div style={S.heroo}><div>
<small>PERSONAL RAS QUESTION BANK</small>
<h1>Paste extracted text. Let AI do the rest.</h1>
<p>Use any OCR/text extractor, add <b>?</b> at the beginning of each question, and paste the text. Questions are split locally; Sarvam 105B is used for labeling.</p>
</div>
<div style={S.stat}><b>{q.length}</b><span>questions saved locally</span></div></div>

{/* Text input panel */}
<div style={S.panel}><textarea style={S.textarea} placeholder={`? First question…\n1. Option\n2. Option\n3. Option\n4. Option\n\n? Second question…`} value={text} onChange={e=>setText(e.target.value)}/>
<div style={S.textbar}><span>{text.length.toLocaleString()} characters</span>
<button style={S.primary} onClick={process} disabled={busy||!text.trim()}>{busy?"Processing…":"Extract questions ⇉"}</button></div></div>

{/* Controls */}
<div style={S.controls}>
<input placeholder="Search questions" value={search} onChange={e=>setSearch(e.target.value)} style={S.input}/>
<select value={subject} onChange={e=>setSubject(e.target.value)} style={S.select}><option>All</option>{ALL_SUBJECTS.map(s=><option key={s}>{s}</option>)}</select>
<button style={S.primary} onClick={tag} disabled={busy||!q.length}>⟳ AI Label All</button>
<button style={S.primary} onClick={tagSelected} disabled={busy||!selected.size}>⟳ Tag Selected ({selected.size})</button>
{filtered.length>0&&<label style={S.chklbl}><input type="checkbox" checked={selected.size===filtered.length&&filtered.length>0} onChange={toggleAll}/> Select All</label>}
<button style={S.primary} onClick={startTest} disabled={!filtered.length}>Test ({filtered.length})</button>
</div>

{msg&&<div style={S.msg}>{msg}</div>}

{/* Question cards */}
{filtered.map((x,i)=>(
<article style={S.card} key={x.id}>
<input type="checkbox" checked={selected.has(x.id)} onChange={()=>toggleSel(x.id)} style={S.chk}/>
<b>Q{i+1}</b>
<div>
{editing===x.id?(
/* Full edit mode */
<div style={S.editor}>
<textarea placeholder="Question text" value={x.text||""} onChange={e=>editQ(x.id,"text",e.target.value)} style={S.editarea}/>
{(x.options||[]).map((o,j)=>(
<div key={j} style={S.optrow}>
<input type="radio" name={`ans-${x.id}`} checked={x.answer===j} onChange={()=>editQ(x.id,"answer",j)} style={S.radio}/>
<input value={o} onChange={e=>editOption(x.id,j,e.target.value)} style={S.optinput} placeholder={`Option ${String.fromCharCode(65+j)}`}/>
<button style={S.delopt} onClick={()=>editQ(x.id,"options",(x.options||[]).filter((_,k)=>k!==j))}>✕</button>
</div>
))}
<button style={S.addopt} onClick={()=>editQ(x.id,"options",[...(x.options||[]),""])}>+ Add option</button>
<div style={S.lablerow}>
<select value={x.subject||""} onChange={e=>manualLabel(x.id,"subject",e.target.value)} style={S.sel2}><option value="">Subject…</option>{ALL_SUBJECTS.map(s=><option key={s}>{s}</option>)}</select>
<input placeholder="Topic" value={x.topic||""} onChange={e=>manualLabel(x.id,"topic",e.target.value)} style={S.inp2}/>
<input placeholder="Subtopic" value={x.subtopic||""} onChange={e=>manualLabel(x.id,"subtopic",e.target.value)} style={S.inp2}/>
<select value={x.difficulty||""} onChange={e=>manualLabel(x.id,"difficulty",e.target.value)} style={S.sel2}><option value="">Difficulty…</option><option>Easy</option><option>Moderate</option><option>Hard</option></select>
</div>
<div style={S.editbtns}>
<button style={S.primary} onClick={()=>setEditing(null)}>Done</button>
<button style={S.dangerbtn} onClick={()=>deleteQ(x.id)}>🗑 Delete</button>
</div>
</div>
):attempting===x.id?(
/* Inline attempt mode */
<div>
<strong>{x.text}</strong>
{(x.options||[]).map((o,j)=>(
<button key={j} onClick={()=>attemptAnswer(j)} disabled={attemptReveal} style={{...S.option,...(attemptReveal&&attemptPick===j?(x.answer==null?S.neutral:(x.answer===j?S.good:S.bad)):{}),...(attemptReveal&&x.answer===j&&attemptPick!==j?S.good:{})}}>{String.fromCharCode(65+j)}. {o}</button>
))}
{attemptReveal&&<div style={S.review}>
{x.answer==null?<small>No answer key for this question.</small>:attemptPick===x.answer?<small style={{color:"#238636",fontWeight:700}}>✓ Correct!</small>:<small style={{color:"#c33",fontWeight:700}}>✗ Wrong. Correct answer: {String.fromCharCode(65+x.answer)}</small>}
</div>}
{attemptReveal&&<button style={S.editbtn} onClick={()=>{setAttemptPick(null);setAttemptReveal(false)}}>Retry</button>}
<button style={S.editbtn} onClick={()=>setAttempting(null)}>← Back</button>
</div>
):(
/* Default view */
<div>
<strong>{x.text}</strong>
{x.options?.length>0&&<ol type="A">{x.options.map((o,j)=><li key={j}>{o}</li>)}</ol>}
<small>{x.subject||"Not tagged"} · {x.topic||"—"} · {x.subtopic||"—"} · {x.difficulty||"—"}{x.answer!=null?` · ✓ ${String.fromCharCode(65+x.answer)}`:""}</small>
<br/><button style={S.editbtn} onClick={()=>setEditing(x.id)}>✎ Edit</button>
<button style={S.editbtn} onClick={()=>startAttempt(x.id)}>▶ Attempt</button>
<button style={S.editbtn} onClick={()=>setEditing(x.id)}>🏷 Label</button>
</div>
)}
</div>
</article>
))}
</section>
)}

{/* Settings modal */}
{showSettings&&<div style={S.modal}><div style={S.box}>
<button style={S.close} onClick={()=>setShowSettings(false)}>×</button>
<h2>AI Settings</h2><p>Enter your Sarvam endpoint, key and model.</p>
<label>API Link<input value={settings.apiUrl} onChange={e=>setSettings({...settings,apiUrl:e.target.value})} placeholder="https://…/chat/completions"/></label>
<label>API Key<input type="password" value={settings.apiKey} onChange={e=>setSettings({...settings,apiKey:e.target.value})}/></label>
<label>Model<input value={settings.model} onChange={e=>setSettings({...settings,model:e.target.value})}/></label>
<button style={S.primary} onClick={save}>Save</button>
</div></div>}
</main>
)
}

const S={
page:{minHeight:"100vh",background:"#f5f7fb",color:"#172033",fontFamily:"Arial,sans-serif"},
header:{height:64,padding:"0 22px",background:"#fff",borderBottom:"1px solid #e5e9f0",display:"flex",justifyContent:"space-between",alignItems:"center"},
brand:{border:0,background:"transparent",fontWeight:800,fontSize:17,cursor:"pointer"},
navBtn:{border:"1px solid #ccd4df",background:"#fff",padding:"8px 14px",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:600},
navActive:{border:"1px solid #172033",background:"#172033",color:"#fff",padding:"8px 14px",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:600},
wrap:{maxWidth:1050,margin:"auto",padding:"42px 20px 80px"},
heroo:{display:"grid",gridTemplateColumns:"1fr 220px",gap:30,alignItems:"center",marginBottom:25},
stat:{background:"#fff",padding:25,borderRadius:16,display:"grid"},
dashHero:{display:"grid",gridTemplateColumns:"1fr 260px",gap:30,alignItems:"center",marginBottom:20,background:"#fff",padding:24,borderRadius:16,border:"1px solid #e2e7ef"},
dashStat:{display:"flex",flexDirection:"column",alignItems:"center",gap:4,textAlign:"center"},
panel:{background:"#fff",border:"1px solid #e2e7ef",borderRadius:18,padding:16},
textarea:{width:"100%",minHeight:430,padding:18,border:"1px solid #cbd3df",borderRadius:12,resize:"vertical",fontFamily:"monospace",fontSize:14,lineHeight:1.55,boxSizing:"border-box"},
textbar:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginTop:12},
controls:{display:"flex",gap:8,flexWrap:"wrap",margin:"18px 0",alignItems:"center"},
input:{padding:11,border:"1px solid #ccd4df",borderRadius:8,flex:"1 1 240px"},
select:{padding:11,border:"1px solid #ccd4df",borderRadius:8,background:"#fff"},
primary:{border:0,background:"#172033",color:"#fff",padding:"11px 16px",borderRadius:8,fontWeight:700,cursor:"pointer"},
msg:{padding:12,background:"#fff",borderRadius:10,marginBottom:12},
card:{background:"#fff",border:"1px solid #e2e7ef",borderRadius:12,padding:16,display:"grid",gridTemplateColumns:"20px 35px 1fr",gap:12,marginBottom:10,lineHeight:1.5},
option:{display:"block",width:"100%",padding:16,margin:"10px 0",textAlign:"left",border:"1px solid #ccd4df",borderRadius:10,background:"#fff",fontSize:16,cursor:"pointer",boxSizing:"border-box"},
good:{background:"#effaf1",border:"2px solid #238636"},
bad:{background:"#fff1f1",border:"2px solid #c33"},
chk:{margin:"auto"},
chklbl:{display:"flex",alignItems:"center",gap:4,fontSize:13,color:"#5b6471",cursor:"pointer"},
editor:{display:"flex",flexDirection:"column",gap:6,marginTop:8},
editarea:{width:"100%",minHeight:80,padding:10,border:"1px solid #ccd4df",borderRadius:8,fontSize:14,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"},
optrow:{display:"flex",alignItems:"center",gap:8},
radio:{cursor:"pointer"},
optinput:{flex:1,padding:8,border:"1px solid #ccd4df",borderRadius:6,fontSize:14},
delopt:{border:0,background:"#fff1f1",color:"#c33",cursor:"pointer",fontSize:14,padding:"4px 8px",borderRadius:4},
addopt:{border:"1px dashed #ccd4df",background:"#f8f9fb",cursor:"pointer",fontSize:13,padding:"6px 12px",borderRadius:6,width:"fit-content"},
lablerow:{display:"flex",gap:8,flexWrap:"wrap",marginTop:8},
inp2:{padding:7,border:"1px solid #ccd4df",borderRadius:6,fontSize:13,flex:"1 1 120px"},
sel2:{padding:7,border:"1px solid #ccd4df",borderRadius:6,fontSize:13,background:"#fff"},
editbtns:{display:"flex",gap:8,marginTop:8},
dangerbtn:{border:0,background:"#c33",color:"#fff",padding:"8px 14px",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:13},
editbtn:{border:0,background:"none",color:"#172033",cursor:"pointer",fontSize:12,textDecoration:"underline",padding:0,marginRight:8},
neutral:{background:"#f6f8fa",border:"2px solid #99a3b1"},
review:{margin:"6px 0",color:"#5b6471"},
modal:{position:"fixed",inset:0,background:"#0008",display:"grid",placeItems:"center",padding:20},
box:{background:"#fff",borderRadius:18,padding:28,width:"min(560px,100%)"},
close:{float:"right",border:0,background:"none",fontSize:28,cursor:"pointer"},
/* Dashboard styles */
treeWrap:{display:"flex",flexDirection:"column",gap:0},
treeSubj:{borderBottom:"1px solid #e2e7ef"},
treeRow:{display:"flex",alignItems:"center",gap:8,padding:"10px 0",cursor:"pointer"},
treeChk:{cursor:"pointer"},
arrow:{width:16,display:"inline-block",textAlign:"center",fontSize:14,color:"#888"},
treeTopic:{},
tagPill:{display:"inline-block",padding:"4px 10px",borderRadius:14,fontSize:12,fontWeight:500,lineHeight:1.4,whiteSpace:"nowrap"},
legend:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16,alignItems:"center"},
lgWhite:{background:"#fff",border:"1px solid #ccd4df",padding:"2px 8px",borderRadius:10,fontSize:12},
lgRed:{background:"#fff1f1",color:"#c33",border:"1px solid #c33",padding:"2px 8px",borderRadius:10,fontSize:12},
lgYellow:{background:"#fffdf0",color:"#b8860b",border:"1px solid #e0c040",padding:"2px 8px",borderRadius:10,fontSize:12},
lgGreen:{background:"#effaf1",color:"#1a7a32",border:"1px solid #238636",padding:"2px 8px",borderRadius:10,fontSize:12},
lgBlue:{background:"#e8f0ff",color:"#1a4fa0",border:"1px solid #3b6fd4",padding:"2px 8px",borderRadius:10,fontSize:12},
}
