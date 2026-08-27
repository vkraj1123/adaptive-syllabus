"use client";
import {useEffect,useMemo,useState} from "react";
import {EXAM_PROFILES,DEFAULT_EXAM} from "./lib/exams";
import {normalizeImportedQuestion,normalizeSyllabusRow} from "./lib/importSchema";
import {updatePerformance,summarizePerformance,accuracy,avgTimeMs} from "./lib/adaptive";
import {recordQuestionEvent,userSummary,conceptStats} from "./lib/userAnalytics";

const css={page:{minHeight:"100vh",background:"#f6f8fb",color:"#172033",fontFamily:"system-ui,-apple-system,sans-serif"},wrap:{maxWidth:1200,margin:"0 auto",padding:24},nav:{display:"flex",gap:8,flexWrap:"wrap",margin:"18px 0"},btn:{border:"1px solid #ccd4df",background:"white",borderRadius:8,padding:"9px 13px",cursor:"pointer"},primary:{background:"#172033",color:"white",border:"1px solid #172033",borderRadius:8,padding:"9px 13px",cursor:"pointer"},card:{background:"white",border:"1px solid #dfe5ed",borderRadius:12,padding:18,marginBottom:14},grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12},input:{width:"100%",boxSizing:"border-box",padding:10,border:"1px solid #ccd4df",borderRadius:8},small:{fontSize:12,color:"#667085"}};

/* ── Predefined syllabus data (from data/predefined-exams.json) ── */
const PREDEFINED_SYLLABUS=[
{exam:"ras",nodeId:"ras.prelims.history.india",parentId:"",level:"subject",title:"History of India",description:""},
{exam:"ras",nodeId:"ras.prelims.history.india.ancient",parentId:"ras.prelims.history.india",level:"topic",title:"Ancient India",description:""},
{exam:"ras",nodeId:"ras.prelims.history.india.ancient.civilization",parentId:"ras.prelims.history.india.ancient",level:"concept",title:"Indus Valley Civilization",description:""},
{exam:"ras",nodeId:"ras.prelims.history.india.ancient.vedic",parentId:"ras.prelims.history.india.ancient",level:"concept",title:"Vedic Age",description:""},
{exam:"ras",nodeId:"ras.prelims.history.india.ancient.maurya",parentId:"ras.prelims.history.india.ancient",level:"concept",title:"Mauryan Empire",description:""},
{exam:"ras",nodeId:"ras.prelims.history.india.ancient.gupta",parentId:"ras.prelims.history.india.ancient",level:"concept",title:"Gupta Period",description:""},
{exam:"ras",nodeId:"ras.prelims.history.india.modern",parentId:"ras.prelims.history.india",level:"topic",title:"Modern India",description:""},
{exam:"ras",nodeId:"ras.prelims.history.india.modern.1857",parentId:"ras.prelims.history.india.modern",level:"concept",title:"Revolt of 1857",description:""},
{exam:"ras",nodeId:"ras.prelims.history.india.modern.national_movement",parentId:"ras.prelims.history.india.modern",level:"concept",title:"Indian National Movement",description:""},
{exam:"ras",nodeId:"ras.prelims.history.india.modern.gandhian",parentId:"ras.prelims.history.india.modern",level:"concept",title:"Gandhian Era",description:""},
{exam:"ras",nodeId:"ras.prelims.polity",parentId:"",level:"subject",title:"Indian Constitution & Governance",description:""},
{exam:"ras",nodeId:"ras.prelims.polity.constitution",parentId:"ras.prelims.polity",level:"topic",title:"Constitutional Framework",description:""},
{exam:"ras",nodeId:"ras.prelims.polity.constitution.preamble",parentId:"ras.prelims.polity.constitution",level:"concept",title:"Preamble",description:""},
{exam:"ras",nodeId:"ras.prelims.polity.constitution.fr",parentId:"ras.prelims.polity.constitution",level:"concept",title:"Fundamental Rights",description:""},
{exam:"ras",nodeId:"ras.prelims.polity.constitution.dpsp",parentId:"ras.prelims.polity.constitution",level:"concept",title:"Directive Principles of State Policy",description:""},
{exam:"ras",nodeId:"ras.prelims.polity.constitution.duties",parentId:"ras.prelims.polity.constitution",level:"concept",title:"Fundamental Duties",description:""},
{exam:"ras",nodeId:"ras.prelims.polity.constitution.amendments",parentId:"ras.prelims.polity.constitution",level:"concept",title:"Constitutional Amendments",description:""},
{exam:"ras",nodeId:"ras.prelims.polity.federalism",parentId:"ras.prelims.polity",level:"topic",title:"Federalism",description:""},
{exam:"ras",nodeId:"ras.prelims.polity.federalism.centre_state",parentId:"ras.prelims.polity.federalism",level:"concept",title:"Centre-State Relations",description:""},
{exam:"ras",nodeId:"ras.prelims.polity.federalism.inter_state",parentId:"ras.prelims.polity.federalism",level:"concept",title:"Inter-State Council",description:""},
{exam:"ras",nodeId:"ras.prelims.polity.federalism.finance",parentId:"ras.prelims.polity.federalism",level:"concept",title:"Finance Commission",description:""},
{exam:"ras",nodeId:"ras.prelims.geography",parentId:"",level:"subject",title:"Geography",description:""},
{exam:"ras",nodeId:"ras.prelims.geography.physical",parentId:"ras.prelims.geography",level:"topic",title:"Physical Geography",description:""},
{exam:"ras",nodeId:"ras.prelims.geography.physical.physiography",parentId:"ras.prelims.geography.physical",level:"concept",title:"Physiography",description:""},
{exam:"ras",nodeId:"ras.prelims.geography.physical.climate",parentId:"ras.prelims.geography.physical",level:"concept",title:"Climate",description:""},
{exam:"ras",nodeId:"ras.prelims.geography.physical.drainage",parentId:"ras.prelims.geography.physical",level:"concept",title:"Drainage Systems",description:""},
{exam:"ras",nodeId:"ras.prelims.geography.rajasthan",parentId:"ras.prelims.geography",level:"topic",title:"Geography of Rajasthan",description:""},
{exam:"ras",nodeId:"ras.prelims.geography.rajasthan.aravalli",parentId:"ras.prelims.geography.rajasthan",level:"concept",title:"Aravalli Range",description:""},
{exam:"ras",nodeId:"ras.prelims.geography.rajasthan.desert",parentId:"ras.prelims.geography.rajasthan",level:"concept",title:"Thar Desert",description:""},
{exam:"ras",nodeId:"ras.prelims.geography.rajasthan.water",parentId:"ras.prelims.geography.rajasthan",level:"concept",title:"Water Resources",description:""},
{exam:"ras",nodeId:"ras.prelims.economy",parentId:"",level:"subject",title:"Indian Economy & Rajasthan Economy",description:""},
{exam:"ras",nodeId:"ras.prelims.economy.india",parentId:"ras.prelims.economy",level:"topic",title:"Indian Economy",description:""},
{exam:"ras",nodeId:"ras.prelims.economy.india.gdp",parentId:"ras.prelims.economy.india",level:"concept",title:"GDP, GVA & National Income",description:""},
{exam:"ras",nodeId:"ras.prelims.economy.india.inflation",parentId:"ras.prelims.economy.india",level:"concept",title:"Inflation",description:""},
{exam:"ras",nodeId:"ras.prelims.economy.india.banking",parentId:"ras.prelims.economy.india",level:"concept",title:"Banking System & RBI",description:""},
{exam:"ras",nodeId:"ras.prelims.economy.rajasthan",parentId:"ras.prelims.economy",level:"topic",title:"Rajasthan Economy",description:""},
{exam:"ras",nodeId:"ras.prelims.economy.rajasthan.budget",parentId:"ras.prelims.economy.rajasthan",level:"concept",title:"State Budget",description:""},
{exam:"ras",nodeId:"ras.prelims.economy.rajasthan.agriculture",parentId:"ras.prelims.economy.rajasthan",level:"concept",title:"Agriculture",description:""},
{exam:"ras",nodeId:"ras.prelims.economy.rajasthan.industry",parentId:"ras.prelims.economy.rajasthan",level:"concept",title:"Industries",description:""},
{exam:"ras",nodeId:"ras.prelims.science",parentId:"",level:"subject",title:"Science & Technology",description:""},
{exam:"ras",nodeId:"ras.prelims.science.physical",parentId:"ras.prelims.science",level:"topic",title:"Physical Sciences",description:""},
{exam:"ras",nodeId:"ras.prelims.science.physical.physics",parentId:"ras.prelims.science.physical",level:"concept",title:"Physics Basics",description:""},
{exam:"ras",nodeId:"ras.prelims.science.physical.chemistry",parentId:"ras.prelims.science.physical",level:"concept",title:"Chemistry Basics",description:""},
{exam:"ras",nodeId:"ras.prelims.science.digital",parentId:"ras.prelims.science",level:"topic",title:"IT & Digital Technology",description:""},
{exam:"ras",nodeId:"ras.prelims.science.digital.ai",parentId:"ras.prelims.science.digital",level:"concept",title:"Artificial Intelligence",description:""},
{exam:"ras",nodeId:"ras.prelims.science.digital.cyber",parentId:"ras.prelims.science.digital",level:"concept",title:"Cybersecurity",description:""},
{exam:"ras",nodeId:"ras.prelims.environment",parentId:"",level:"subject",title:"Environment & Ecology",description:""},
{exam:"ras",nodeId:"ras.prelims.environment.ecology",parentId:"ras.prelims.environment",level:"topic",title:"Ecology & Biodiversity",description:""},
{exam:"ras",nodeId:"ras.prelims.environment.ecology.ecosystems",parentId:"ras.prelims.environment.ecology",level:"concept",title:"Ecosystems",description:""},
{exam:"ras",nodeId:"ras.prelims.environment.ecology.biodiversity",parentId:"ras.prelims.environment.ecology",level:"concept",title:"Biodiversity & Conservation",description:""},
{exam:"ras",nodeId:"ras.prelims.environment.climate",parentId:"ras.prelims.environment",level:"topic",title:"Environmental Issues",description:""},
{exam:"ras",nodeId:"ras.prelims.environment.climate.change",parentId:"ras.prelims.environment.climate",level:"concept",title:"Climate Change",description:""},
{exam:"ras",nodeId:"ras.prelims.environment.climate.pollution",parentId:"ras.prelims.environment.climate",level:"concept",title:"Pollution",description:""},
{exam:"ras",nodeId:"ras.prelims.rajasthan",parentId:"",level:"subject",title:"Rajasthan History, Culture & Society",description:""},
{exam:"ras",nodeId:"ras.prelims.rajasthan.history",parentId:"ras.prelims.rajasthan",level:"topic",title:"Rajasthan History",description:""},
{exam:"ras",nodeId:"ras.prelims.rajasthan.history.1857",parentId:"ras.prelims.rajasthan.history",level:"concept",title:"1857 in Rajasthan",description:""},
{exam:"ras",nodeId:"ras.prelims.rajasthan.history.praja_mandal",parentId:"ras.prelims.rajasthan.history",level:"concept",title:"Praja Mandal Movement",description:""},
{exam:"ras",nodeId:"ras.prelims.rajasthan.history.integration",parentId:"ras.prelims.rajasthan.history",level:"concept",title:"Integration of Rajasthan",description:""},
{exam:"ras",nodeId:"ras.prelims.rajasthan.culture",parentId:"ras.prelims.rajasthan",level:"topic",title:"Art & Culture",description:""},
{exam:"ras",nodeId:"ras.prelims.rajasthan.culture.folk",parentId:"ras.prelims.rajasthan.culture",level:"concept",title:"Folk Dances & Music",description:""},
{exam:"ras",nodeId:"ras.prelims.rajasthan.culture.paintings",parentId:"ras.prelims.rajasthan.culture",level:"concept",title:"Paintings",description:""},
{exam:"ras",nodeId:"ras.prelims.rajasthan.culture.fairs",parentId:"ras.prelims.rajasthan.culture",level:"concept",title:"Fairs & Festivals",description:""},
{exam:"ras",nodeId:"ras.prelims.current",parentId:"",level:"subject",title:"Current Affairs",description:""},
{exam:"ras",nodeId:"ras.prelims.current.national",parentId:"ras.prelims.current",level:"topic",title:"National Affairs",description:""},
{exam:"ras",nodeId:"ras.prelims.current.national.schemes",parentId:"ras.prelims.current.national",level:"concept",title:"Government Schemes",description:""},
{exam:"ras",nodeId:"ras.prelims.current.national.policy",parentId:"ras.prelims.current.national",level:"concept",title:"Major Policy Developments",description:""},
{exam:"ras",nodeId:"ras.prelims.current.rajasthan",parentId:"ras.prelims.current",level:"topic",title:"Rajasthan Current Affairs",description:""},
{exam:"ras",nodeId:"ras.prelims.current.rajasthan.schemes",parentId:"ras.prelims.current.rajasthan",level:"concept",title:"Rajasthan Schemes & Policies",description:""},
/* UPSC */
{exam:"upsc",nodeId:"upsc.prelims.gs1.history",parentId:"",level:"subject",title:"History & Culture",description:""},
{exam:"upsc",nodeId:"upsc.prelims.gs1.geography",parentId:"",level:"subject",title:"Indian & World Geography",description:""},
{exam:"upsc",nodeId:"upsc.prelims.gs1.polity",parentId:"",level:"subject",title:"Indian Polity & Governance",description:""},
{exam:"upsc",nodeId:"upsc.prelims.gs1.economy",parentId:"",level:"subject",title:"Economic & Social Development",description:""},
{exam:"upsc",nodeId:"upsc.prelims.gs1.environment",parentId:"",level:"subject",title:"Environment & Ecology",description:""},
{exam:"upsc",nodeId:"upsc.prelims.gs1.science",parentId:"",level:"subject",title:"General Science & Technology",description:""},
{exam:"upsc",nodeId:"upsc.prelims.csat",parentId:"",level:"subject",title:"CSAT (Comprehension, Reasoning, Quantitative)",description:""},
/* SSC CGL */
{exam:"ssc_cgl",nodeId:"ssc_cgl.t1.reasoning",parentId:"",level:"subject",title:"General Intelligence & Reasoning",description:""},
{exam:"ssc_cgl",nodeId:"ssc_cgl.t1.gk",parentId:"",level:"subject",title:"General Awareness",description:""},
{exam:"ssc_cgl",nodeId:"ssc_cgl.t1.quant",parentId:"",level:"subject",title:"Quantitative Aptitude",description:""},
{exam:"ssc_cgl",nodeId:"ssc_cgl.t1.english",parentId:"",level:"subject",title:"English Comprehension",description:""},
/* Banking */
{exam:"banking",nodeId:"banking.prelims.english",parentId:"",level:"subject",title:"English Language",description:""},
{exam:"banking",nodeId:"banking.prelims.quant",parentId:"",level:"subject",title:"Quantitative Aptitude",description:""},
{exam:"banking",nodeId:"banking.prelims.reasoning",parentId:"",level:"subject",title:"Reasoning Ability",description:""},
/* Police SI */
{exam:"police",nodeId:"police.si.gk",parentId:"",level:"subject",title:"General Knowledge & Current Affairs",description:""},
{exam:"police",nodeId:"police.si.reasoning",parentId:"",level:"subject",title:"Reasoning & Mental Ability",description:""},
{exam:"police",nodeId:"police.si.law",parentId:"",level:"subject",title:"Law & Constitution",description:""},
{exam:"police",nodeId:"police.si.quant",parentId:"",level:"subject",title:"Quantitative Aptitude",description:""},
];

function csv(text){const lines=text.replace(/\r/g,"").split("\n").filter(x=>x.trim());if(!lines.length)return[];const parse=s=>{const a=[];let c="",q=false;for(let i=0;i<s.length;i++){const ch=s[i];if(ch==='"'){if(q&&s[i+1]==='"'){c+='"';i++;}else q=!q;}else if(ch===','&&!q){a.push(c.trim());c="";}else c+=ch;}a.push(c.trim());return a};const h=parse(lines[0]);return lines.slice(1).map(line=>{const a=parse(line),o={};h.forEach((k,i)=>o[k]=a[i]??"");return o;});}
const pct=x=>x==null?"\u2014":`${Math.round(x*100)}%`;
const fmt=x=>x==null?"\u2014":x<60000?`${Math.round(x/1000)}s`:`${(x/60000).toFixed(1)}m`;

export default function Home(){
 const [exam,setExam]=useState(DEFAULT_EXAM),[tab,setTab]=useState("dashboard"),[questions,setQuestions]=useState([]),[syllabus,setSyllabus]=useState([]),[performance,setPerformance]=useState({}),[events,setEvents]=useState({}),[message,setMessage]=useState(""),[importText,setImportText]=useState(""),[importType,setImportType]=useState("questions"),[search,setSearch]=useState("");
 const [test,setTest]=useState(null),[testIndex,setTestIndex]=useState(0),[choice,setChoice]=useState(null),[testStart,setTestStart]=useState(0),[elapsed,setElapsed]=useState(0);
 const [expandedNodes,setExpandedNodes]=useState(new Set());

 useEffect(()=>{try{const sq=JSON.parse(localStorage.getItem("adaptive-questions")||"[]");const ss=JSON.parse(localStorage.getItem("adaptive-syllabus")||"[]");setQuestions(sq);
   /* If no syllabus in localStorage, seed with predefined data */
   if(!ss.length){setSyllabus(PREDEFINED_SYLLABUS);setMessage("Pre-loaded syllabus for all exams. Import questions to start practising.");}
   else{setSyllabus(ss);}
   setPerformance(JSON.parse(localStorage.getItem("adaptive-performance")||"{}"));setEvents(JSON.parse(localStorage.getItem("adaptive-events")||"{}"));setExam(localStorage.getItem("adaptive-exam")||DEFAULT_EXAM);}catch{}} ,[]);
 useEffect(()=>localStorage.setItem("adaptive-questions",JSON.stringify(questions)),[questions]);
 useEffect(()=>{if(syllabus.length)localStorage.setItem("adaptive-syllabus",JSON.stringify(syllabus))},[syllabus]);
 useEffect(()=>localStorage.setItem("adaptive-performance",JSON.stringify(performance)),[performance]);
 useEffect(()=>localStorage.setItem("adaptive-events",JSON.stringify(events)),[events]);
 useEffect(()=>localStorage.setItem("adaptive-exam",exam),[exam]);
 useEffect(()=>{if(!test)return;const id=setInterval(()=>setElapsed(Date.now()-testStart),500);return()=>clearInterval(id)},[test,testStart]);
 const qs=useMemo(()=>questions.filter(q=>q.exam===exam),[questions,exam]);
 const ev=events["local-user"]||[];
 const summary=useMemo(()=>userSummary(ev,exam),[ev,exam]);
 const concepts=useMemo(()=>conceptStats(ev).sort((a,b)=>(b.weakness??-1)-(a.weakness??-1)),[ev]);
 const weak=concepts.filter(x=>(x.weakness??0)>=50);
 const nodes=syllabus.filter(x=>x.exam===exam);
 /* Build tree from flat node list */
 const tree=useMemo(()=>{
   const map={},roots=[];
   nodes.forEach(n=>{map[n.nodeId]={...n,children:[]};});
   nodes.forEach(n=>{if(n.parentId&&map[n.parentId]){map[n.parentId].children.push(map[n.nodeId]);}else{roots.push(map[n.nodeId]);}});
   return roots;
 },[nodes]);
 /* Performance lookup by nodeId */
 const perfFor=nodeId=>{const s=concepts.find(c=>c.nodeId===nodeId);return s?{accuracy:s.accuracy,weakness:s.weakness,total:s.total}:null;};
 function toggleNode(id){setExpandedNodes(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});}
 function importData(){try{if(importType==="questions"){const incoming=csv(importText).map(normalizeImportedQuestion);const valid=incoming.filter(q=>q.exam===exam&&q.text&&q.options.length>=2&&q.answer!=null&&q.nodeId);setQuestions(p=>[...p.filter(q=>!valid.some(v=>v.id===q.id)),...valid]);setMessage(`Imported ${valid.length}/${incoming.length} questions. Rows without valid concept node_id were skipped.`);}else{const incoming=csv(importText).map(normalizeSyllabusRow);const valid=incoming.filter(x=>x.exam===exam&&x.nodeId&&x.title);setSyllabus(p=>[...p.filter(x=>!(x.exam===exam&&valid.some(v=>v.nodeId===x.nodeId))),...valid]);setMessage(`Imported ${valid.length}/${incoming.length} syllabus nodes.`);}}catch(e){setMessage(`Import error: ${e.message}`)}}
 function startWeakTest(){const pool=qs.filter(q=>weak.some(w=>w.nodeId===q.nodeId));if(!pool.length){setMessage("No weak-topic questions available yet.");return;}const shuffled=[...pool].sort(()=>Math.random()-.5).slice(0,15);setTest(shuffled);setTestIndex(0);setChoice(null);setTestStart(Date.now());setElapsed(0);setTab("test");}
 function answer(i){if(choice!=null)return;setChoice(i);const q=test[testIndex],correct=i===q.answer,ms=Date.now()-testStart;setPerformance(p=>updatePerformance(p,q,{correct,elapsedMs:ms}));setEvents(p=>recordQuestionEvent(p,{userId:"local-user",type:"question",exam:q.exam,nodeId:q.nodeId,questionId:q.id,correct,elapsedMs:ms}));}
 function next(){if(testIndex+1>=test.length){setMessage("Test completed. Performance updated.");setTest(null);setTab("dashboard");return;}setTestIndex(i=>i+1);setChoice(null);setTestStart(Date.now());setElapsed(0);}
 const current=test?.[testIndex];

 /* Render a tree node recursively */
 function renderNode(node,depth){
   const isExpanded=expandedNodes.has(node.nodeId);
   const p=perfFor(node.nodeId);
   const childCount=node.children?.length||0;
   const dotColor=p?p.weakness>=50?"#e74c3c":p.accuracy>=0.8?"#27ae60":p.total>0?"#f39c12":"#bdc3c7":"#bdc3c7";
   return <div key={node.nodeId}>
     <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid #edf0f4",cursor:childCount?"pointer":"default",paddingLeft:depth*20}} onClick={()=>childCount&&toggleNode(node.nodeId)}>
       <span style={{fontSize:13,color:"#667085",width:16}}>{childCount?(isExpanded?"\u25BE":"\u25B8"):""}</span>
       <span style={{width:8,height:8,borderRadius:4,background:dotColor,flexShrink:0}}></span>
       <span style={{fontWeight:node.level==="subject"?700:node.level==="topic"?600:400,fontSize:node.level==="subject"?15:14}}>{node.title}</span>
       {p&&p.total>0&&<span style={{...css.small,marginLeft:"auto"}}>{pct(p.accuracy)} \u2022 {p.total} attempts \u2022 weakness {p.weakness}</span>}
       {p&&p.total===0&&<span style={{...css.small,marginLeft:"auto",color:"#bdc3c7"}}>not attempted</span>}
     </div>
     {isExpanded&&childCount>0&&node.children.map(c=>renderNode(c,depth+1))}
   </div>;
 }

 return <main style={css.page}><div style={css.wrap}>
  <header><div style={{fontSize:13,fontWeight:700,letterSpacing:1}}>ADAPTIVE SYLLABUS</div><h1 style={{margin:"6px 0"}}>Your learning system</h1><div style={css.small}>Multi-exam \u2022 concept-level \u2022 deterministic adaptation</div></header>
  <div style={css.nav}>{Object.values(EXAM_PROFILES).map(e=><button key={e.id} style={exam===e.id?css.primary:css.btn} onClick={()=>{setExam(e.id);setTab("dashboard")}}>{e.shortName}</button>)}</div>
  <div style={css.nav}>{[["dashboard","Dashboard"],["syllabus","Syllabus"],["bank","Question Bank"],["import","Import"],["analytics","Analytics"]].map(([id,label])=><button key={id} style={tab===id?css.primary:css.btn} onClick={()=>setTab(id)}>{label}</button>)}</div>
  {message&&<div style={{...css.card,background:"#f0f7ff"}}>{message}</div>}
  {tab==="dashboard"&&<><div style={css.grid}>{[["Questions",qs.length],["Concept nodes",nodes.length],["Attempted",summary.questions],["Accuracy",pct(summary.accuracy)],["Avg time",fmt(summary.avgTimeMs)],["Weak concepts",weak.length]].map(([a,b])=><section style={css.card} key={a}><div style={css.small}>{a}</div><div style={{fontSize:28,fontWeight:700}}>{b}</div></section>)}</div><section style={css.card}><h2>Priority relearning</h2>{weak.length?<>{weak.slice(0,10).map(w=><div key={w.nodeId} style={{display:"grid",gridTemplateColumns:"1fr 90px 90px 80px",gap:8,padding:"10px 0",borderBottom:"1px solid #edf0f4"}}><div><b>{w.nodeId}</b><div style={css.small}>{nodes.find(n=>n.nodeId===w.nodeId)?.title||"Concept"}</div></div><span>{pct(w.accuracy)}</span><span>{fmt(w.avgTimeMs)}</span><strong>{w.weakness}</strong></div>)}<button style={{...css.primary,marginTop:14}} onClick={startWeakTest}>Relearn weak concepts</button></>:<div style={css.small}>Attempt questions to generate a personalised weakness map.</div>}</section></>}
  {tab==="syllabus"&&<section style={css.card}><h2>{EXAM_PROFILES[exam].name}</h2><div style={css.small}>Concept-level nodes: {nodes.length} \u2022 Subjects: {tree.length}</div>
    <div style={{display:"flex",gap:8,margin:"12px 0"}}>
      <button style={css.btn} onClick={()=>setExpandedNodes(new Set(nodes.map(n=>n.nodeId)))}>Expand all</button>
      <button style={css.btn} onClick={()=>setExpandedNodes(new Set())}>Collapse all</button>
    </div>
    <div style={{marginTop:8}}>{tree.length?tree.map(n=>renderNode(n,0)):<div style={css.small}>No syllabus nodes for this exam yet.</div>}</div>
  </section>}
  {tab==="bank"&&<section style={css.card}><input style={css.input} placeholder="Search questions or concepts" value={search} onChange={e=>setSearch(e.target.value)}/><div style={{marginTop:14}}>{qs.filter(q=>(q.text+q.concept+q.nodeId).toLowerCase().includes(search.toLowerCase())).slice(0,100).map(q=><div key={q.id} style={{padding:12,borderBottom:"1px solid #edf0f4"}}><b>{q.text}</b><div style={css.small}>{q.nodeId} \u2022 {q.difficulty||"\u2014"} \u2022 {q.source||"\u2014"}</div>{q.explanation&&<details><summary>Relearn explanation</summary><p>{q.explanation}</p>{q.keyFact&&<p><b>Key fact:</b> {q.keyFact}</p>}{q.commonConfusion&&<p><b>Common confusion:</b> {q.commonConfusion}</p>}</details>}</div>)}</div></section>}
  {tab==="import"&&<section style={css.card}><h2>External-AI data import</h2><p style={css.small}>Prepare OCR, tagging, explanations and concept mapping outside this app using the template. This app only validates and organises the result.</p><div style={css.nav}><button style={importType==="questions"?css.primary:css.btn} onClick={()=>setImportType("questions")}>Questions CSV</button><button style={importType==="syllabus"?css.primary:css.btn} onClick={()=>setImportType("syllabus")}>Syllabus CSV</button></div><textarea style={{...css.input,minHeight:260,fontFamily:"monospace"}} value={importText} onChange={e=>setImportText(e.target.value)} placeholder={importType==="questions"?"Paste adaptive-syllabus-template.csv rows here":"Paste concept-level syllabus CSV rows here"}/><button style={{...css.primary,marginTop:12}} onClick={importData}>Validate & import</button></section>}
  {tab==="analytics"&&<><section style={css.grid}>{[["Exam accuracy",pct(summary.accuracy)],["Questions",summary.questions],["Average time",fmt(summary.avgTimeMs)],["Weak concepts",weak.length]].map(([a,b])=><section style={css.card} key={a}><div style={css.small}>{a}</div><h2>{b}</h2></section>)}</section><section style={css.card}><h2>Concept diagnostics</h2>{concepts.slice(0,50).map(c=><div key={c.nodeId} style={{display:"grid",gridTemplateColumns:"1fr 90px 90px 90px",gap:8,padding:"9px 0",borderBottom:"1px solid #edf0f4"}}><span>{c.nodeId}</span><span>{pct(c.accuracy)}</span><span>{fmt(c.avgTimeMs)}</span><b>{c.weakness}</b></div>)}</section></>}
  {tab==="test"&&current&&<section style={css.card}><div style={css.small}>Question {testIndex+1}/{test.length} \u2022 {fmt(elapsed)}</div><h2>{current.text}</h2>{current.options.map((o,i)=><button key={i} style={{...css.btn,display:"block",width:"100%",textAlign:"left",margin:"8px 0",border:choice!=null?(i===current.answer?"2px solid #238636":i===choice?"2px solid #c33":"1px solid #ccd4df"):"1px solid #ccd4df"}} onClick={()=>answer(i)}>{String.fromCharCode(65+i)}. {o}</button>)}{choice!=null&&<><p><b>{choice===current.answer?"Correct":"Incorrect"}</b></p>{current.explanation&&<div style={{...css.card,background:"#f8fafc"}}>{current.explanation}</div>}<button style={css.primary} onClick={next}>{testIndex+1===test.length?"Finish":"Next"}</button></>}</section>}
 </div></main>
}
