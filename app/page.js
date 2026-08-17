"use client";
import {useEffect,useState} from "react";
const syllabus=["Indian Polity & Constitution","Indian History & Culture","Rajasthan History & Culture","Indian Geography","Rajasthan Geography","Indian Economy","Rajasthan Economy","Science & Technology","Environment & Ecology","Current Affairs","Reasoning & Mental Ability","Public Administration","Ethics & Integrity","International Relations","Social Issues & Schemes"];
const defaults={model:"sarvam-105b",apiUrl:"",apiKey:""};
async function safeJson(r){const raw=await r.text();let d;try{d=JSON.parse(raw)}catch{throw Error(raw?.slice(0,800)||`Server returned non-JSON response (${r.status})`)}return d}
export default function Home(){
const[q,setQ]=useState([]),[text,setText]=useState(""),[busy,setBusy]=useState(false),[msg,setMsg]=useState(""),[settings,setSettings]=useState(defaults),[showSettings,setShowSettings]=useState(false),[search,setSearch]=useState(""),[subject,setSubject]=useState("All"),[test,setTest]=useState(null),[pos,setPos]=useState(0),[picked,setPicked]=useState(null),[score,setScore]=useState(0),[selected,setSelected]=useState(new Set()),[editing,setEditing]=useState(null),[attempting,setAttempting]=useState(null),[attemptPick,setAttemptPick]=useState(null),[attemptReveal,setAttemptReveal]=useState(false);
useEffect(()=>{try{const s=localStorage.getItem("adaptive-settings"),b=localStorage.getItem("adaptive-bank");if(s)setSettings({...defaults,...JSON.parse(s)});if(b)setQ(JSON.parse(b))}catch{}},[]);
useEffect(()=>{localStorage.setItem("adaptive-bank",JSON.stringify(q))},[q]);

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

/* ── Selection helpers ── */
function toggleSel(id){setSelected(s=>{const n=new Set(s);if(n.has(id))n.delete(id);else n.add(id);return n})}
function toggleAll(){if(selected.size===filtered.length)setSelected(new Set());else setSelected(new Set(filtered.map(x=>x.id)))}

/* ── Manual label / edit / delete ── */
function manualLabel(id,field,val){setQ(q.map(x=>x.id===id?{...x,[field]:val}:x))}
function editQ(id,field,val){setQ(q.map(x=>x.id===id?{...x,[field]:val}:x))}
function editOption(id,idx,val){setQ(q.map(x=>{if(x.id!==id)return x;const opts=[...(x.options||[])];opts[idx]=val;return{...x,options:opts}}))}
function deleteQ(id){setQ(q.filter(x=>x.id!==id));if(editing===id)setEditing(null);if(attempting===id)setAttempting(null)}

/* ── Inline attempt (practice a single question) ── */
function startAttempt(id){setAttempting(id);setAttemptPick(null);setAttemptReveal(false)}
function attemptAnswer(i){if(attemptReveal)return;setAttemptPick(i);setAttemptReveal(true)}

/* ── Full test mode ── */
const filtered=q.filter(x=>(subject==="All"||x.subject===subject)&&(x.text||"").toLowerCase().includes(search.toLowerCase()));
function startTest(){const a=[...filtered].sort(()=>Math.random()-0.5).slice(0,20);if(a.length){setTest(a);setPos(0);setPicked(null);setScore(0)}}
function answer(i){if(picked!==null)return;setPicked(i);if(test[pos].answer!=null&&test[pos].answer===i)setScore(s=>s+1)}
function next(){if(pos+1>=test.length){const graded=test.filter(q=>q.answer!=null).length;alert(`Score: ${score}/${graded}${graded<test.length?` (${test.length-graded} without answer key)`:``}`);setTest(null)}else{setPos(pos+1);setPicked(null)}}
function save(){localStorage.setItem("adaptive-settings",JSON.stringify(settings));setShowSettings(false);setMsg("Settings saved.")}

/* ── Test mode render ── */
if(test)return (
<main style={S.page}><header style={S.header}><b>Adaptive Syllabus</b></header>
<section style={S.wrap}><small>TEST {pos+1}/{test.length}</small>
<h1>{test[pos].text}</h1>
{(test[pos].options||[]).map((o,i)=>(
<button key={i} onClick={()=>answer(i)} style={{...S.option,...(picked===i?(test[pos].answer==null?S.neutral:(test[pos].answer===i?S.good:S.bad)):{})}}>{String.fromCharCode(65+i)}. {o}</button>
))}
{picked!==null&&<div style={S.review}>{test[pos].answer==null?<small>No answer key for this question.</small>:<small>Correct answer: {String.fromCharCode(65+test[pos].answer)}</small>}</div>}
{picked!==null&&<button style={S.primary} onClick={next}>{pos+1===test.length?"Finish":"Next"}</button>}
</section></main>
);

return (
<main style={S.page}>
<header style={S.header}>
<button style={S.brand} onClick={()=>location.reload()}>Adaptive Syllabus <small>TEXT ⇄ AI ⇉ TEST</small></button>
<nav>
<button onClick={()=>setShowSettings(true)}>⚙ Settings</button>
<button onClick={startTest} disabled={!filtered.length}>Test ({filtered.length})</button>
</nav>
</header>

<section style={S.wrap}>
{/* ── Hero ── */}
<div style={S.heroo}><div>
<small>PERSONAL RAS QUESTION BANK</small>
<h1>Paste extracted text. Let AI do the rest.</h1>
<p>Use any OCR/text extractor, add <b>?</b> at the beginning of each question, and paste the text. Questions are split locally; Sarvam 105B is used for labeling.</p>
</div>
<div style={S.stat}><b>{q.length}</b><span>questions saved locally</span></div></div>

{/* ── Text input panel ── */}
<div style={S.panel}><textarea style={S.textarea} placeholder={`? First question…\n1. Option\n2. Option\n3. Option\n4. Option\n\n? Second question…`} value={text} onChange={e=>setText(e.target.value)}/>
<div style={S.textbar}><span>{text.length.toLocaleString()} characters</span>
<button style={S.primary} onClick={process} disabled={busy||!text.trim()}>{busy?"Processing…":"Extract questions ⇉"}</button></div></div>

{/* ── Controls ── */}
<div style={S.controls}>
<input placeholder="Search questions" value={search} onChange={e=>setSearch(e.target.value)} style={S.input}/>
<select value={subject} onChange={e=>setSubject(e.target.value)} style={S.select}><option>All</option>{syllabus.map(s=><option key={s}>{s}</option>)}</select>
<button style={S.primary} onClick={tag} disabled={busy||!q.length}>⟳ AI Label All</button>
<button style={S.primary} onClick={tagSelected} disabled={busy||!selected.size}>⟳ Tag Selected ({selected.size})</button>
{filtered.length>0&&<label style={S.chklbl}><input type="checkbox" checked={selected.size===filtered.length&&filtered.length>0} onChange={toggleAll}/> Select All</label>}
</div>

{msg&&<div style={S.msg}>{msg}</div>}

{/* ── Question cards ── */}
{filtered.map((x,i)=>(
<article style={S.card} key={x.id}>
<input type="checkbox" checked={selected.has(x.id)} onChange={()=>toggleSel(x.id)} style={S.chk}/>
<b>Q{i+1}</b>
<div>
{editing===x.id?(
/* ── Full edit mode: question text, options, answer ── */
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
<select value={x.subject||""} onChange={e=>manualLabel(x.id,"subject",e.target.value)} style={S.sel2}><option value="">Subject…</option>{syllabus.map(s=><option key={s}>{s}</option>)}</select>
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
/* ── Inline attempt mode ── */
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
/* ── Default view ── */
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

{/* ── Settings modal ── */}
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
wrap:{maxWidth:1050,margin:"auto",padding:"42px 20px 80px"},
heroo:{display:"grid",gridTemplateColumns:"1fr 220px",gap:30,alignItems:"center",marginBottom:25},
stat:{background:"#fff",padding:25,borderRadius:16,display:"grid"},
panel:{background:"#fff",border:"1px solid #e2e7ef",borderRadius:18,padding:16},
textarea:{width:"100%",minHeight:430,padding:18,border:"1px solid #cbd3df",borderRadius:12,resize:"vertical",fontFamily:"monospace",fontSize:14,lineHeight:1.55,boxSizing:"border-box"},
textbar:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginTop:12},
controls:{display:"flex",gap:8,flexWrap:"wrap",margin:"18px 0"},
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
close:{float:"right",border:0,background:"none",fontSize:28,cursor:"pointer"}
}
