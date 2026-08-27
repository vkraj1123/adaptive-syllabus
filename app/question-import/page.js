"use client";
import {useMemo,useState} from "react";
import {EXAM_PROFILES} from "../lib/exams";
import {PREDEFINED_SYLLABUS} from "../lib/predefinedSyllabus";
import {normalizeImportedQuestion,validateImportedQuestion} from "../lib/importSchema";

const css={page:{minHeight:"100vh",background:"#f6f8fb",color:"#172033",fontFamily:"system-ui,-apple-system,sans-serif"},wrap:{maxWidth:1200,margin:"0 auto",padding:24},card:{background:"white",border:"1px solid #dfe5ed",borderRadius:12,padding:18,marginBottom:14},btn:{border:"1px solid #ccd4df",background:"white",borderRadius:8,padding:"9px 13px",cursor:"pointer"},primary:{background:"#172033",color:"white",border:"1px solid #172033",borderRadius:8,padding:"9px 13px",cursor:"pointer"},input:{width:"100%",boxSizing:"border-box",padding:10,border:"1px solid #ccd4df",borderRadius:8},small:{fontSize:12,color:"#667085"}};

function parseCSV(text){const lines=text.replace(/\r/g,"").split("\n").filter(x=>x.trim());if(!lines.length)return[];const parse=s=>{const a=[];let c="",q=false;for(let i=0;i<s.length;i++){const ch=s[i];if(ch==='"'){if(q&&s[i+1]==='"'){c+='"';i++;}else q=!q}else if(ch===','&&!q){a.push(c.trim());c=""}else c+=ch}a.push(c.trim());return a};const h=parse(lines[0]);return lines.slice(1).map(line=>{const a=parse(line),o={};h.forEach((k,i)=>o[k]=a[i]??"");return o})}
function parseAI(text){const t=text.trim();if(!t)return[];try{const j=JSON.parse(t);const arr=Array.isArray(j)?j:(Array.isArray(j.questions)?j.questions:[]);if(arr.length)return arr.map(normalizeImportedQuestion)}catch{}
 const rows=parseCSV(t);return rows.map(normalizeImportedQuestion)}

export default function QuestionImport(){
 const [exam,setExam]=useState("ras"),[text,setText]=useState(""),[rows,setRows]=useState([]),[message,setMessage]=useState("");
 const nodes=useMemo(()=>PREDEFINED_SYLLABUS.filter(n=>n.exam===exam),[exam]);
 const nodeSet=useMemo(()=>new Set(nodes.filter(n=>n.level==="concept").map(n=>n.nodeId)),[nodes]);
 function parse(){try{const incoming=parseAI(text);setRows(incoming);setMessage(`Parsed ${incoming.length} question(s). Review validation before importing.`)}catch(e){setRows([]);setMessage("Could not parse the supplied text: "+e.message)}}
 const checked=rows.map(q=>({q,errors:validateImportedQuestion(q,new Set(nodes.map(n=>`${n.subject}|${n.topic}${n.subtopic?`|${n.subtopic}`:""}`)))}));
 const valid=checked.filter(x=>!x.errors.length&&nodeSet.has(x.q.nodeId));
 function importNow(){const key="adaptive-import-preview";localStorage.setItem(key,JSON.stringify(valid.map(x=>x.q)));setMessage(`Validated ${valid.length}/${rows.length}. Questions are saved in this browser as an import preview; connect this page to the dashboard bank when the shared data store is enabled.`)}
 return <main style={css.page}><div style={css.wrap}>
  <header style={{marginBottom:18}}><b>ADAPTIVE SYLLABUS</b><h1 style={{margin:"6px 0"}}>External AI Question Import</h1><div style={css.small}>Paste AI output here → parse → validate → review → import.</div></header>
  <section style={css.card}><h2>1. Select exam</h2><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{Object.values(EXAM_PROFILES).map(e=><button key={e.id} style={exam===e.id?css.primary:css.btn} onClick={()=>{setExam(e.id);setRows([])}}>{e.shortName}</button>)}</div></section>
  <section style={css.card}><h2>2. Paste AI output</h2><p style={css.small}>Accepts either CSV with the template header or a JSON array of question objects.</p><textarea value={text} onChange={e=>setText(e.target.value)} placeholder={'Paste external AI output here…\n\nCSV example:\nquestion_id,exam,stage,year,question,option_a,option_b,option_c,option_d,option_e,correct_option,node_id,subject,topic,subtopic,concept,explanation,key_fact,common_confusion,source,difficulty,question_type,expected_time_sec'} style={{...css.input,minHeight:300,fontFamily:"monospace",fontSize:13}}/><div style={{display:"flex",gap:8,marginTop:10}}><button style={css.primary} onClick={parse}>Parse text</button><a href="/ai-question-import-template.md" target="_blank" rel="noreferrer" style={{...css.btn,textDecoration:"none"}}>Open AI template</a></div>{message&&<p style={{...css.small,marginTop:10}}>{message}</p>}</section>
  {rows.length>0&&<section style={css.card}><h2>3. Validation preview</h2><div style={css.small}>{valid.length}/{rows.length} rows ready • {rows.length-valid.length} need correction</div><div style={{marginTop:12}}>{checked.map(({q,errors},i)=><div key={q.id+"-"+i} style={{padding:12,borderBottom:"1px solid #edf0f4"}}><b>{i+1}. {q.text||"Missing question"}</b><div style={css.small}>{q.nodeId||"no node_id"} • {q.difficulty||"difficulty missing"} • answer {q.answer==null?"missing":String.fromCharCode(65+q.answer)}</div>{errors.length>0&&<div style={{marginTop:6,color:"#b42318",fontSize:13}}>{errors.join(" • ")}{q.nodeId&&!nodeSet.has(q.nodeId)&&<div>Node ID is not a concept node in the selected exam.</div>}</div>}</div>)}</div>{valid.length>0&&<button style={{...css.primary,marginTop:12}} onClick={importNow}>Save validated import preview</button>}</section>}
 </div></main>
}
