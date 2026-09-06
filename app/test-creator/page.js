"use client";
import {useEffect,useMemo,useState} from "react";
import {useRouter} from "next/navigation";
import {EXAM_PROFILES} from "../lib/exams";
import {PREDEFINED_SYLLABUS} from "../lib/predefinedSyllabus";
import {NEET_SYLLABUS} from "../lib/neetSyllabus";
import {getCloudProfile,supabase} from "../lib/supabase";

const allSyllabus=[...PREDEFINED_SYLLABUS,...NEET_SYLLABUS];
const btn={padding:"9px 13px",borderRadius:9,border:"1px solid #ccd4df",background:"#fff",cursor:"pointer",fontWeight:600};
const primary={...btn,background:"#172033",color:"#fff",borderColor:"#172033"};
const card={background:"#fff",border:"1px solid #dfe5ed",borderRadius:14,padding:18,marginBottom:14};
const norm=v=>String(v??"").trim().toLowerCase().replace(/[–—]/g,"-").replace(/\s+/g," ");
function localValue(date){const d=new Date(date);const p=n=>String(n).padStart(2,"0");return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;}
function questionMatchesNode(q,node){
  const qNode=norm(q.node_id||q.nodeId); const id=norm(node.nodeId);
  if(id&&(qNode===id||qNode.startsWith(id+".")))return true;
  const title=norm(node.title); if(!title)return false;
  if(node.level==="subject"&&norm(q.subject)===title)return true;
  if(node.level==="topic"&&norm(q.topic)===title)return true;
  if(node.level==="concept"&&(norm(q.concept)===title||norm(q.subtopic)===title))return true;
  return false;
}
function rowToQuestion(r){
  const options=Array.isArray(r.options)?r.options:Object.values(r.options||{});
  const optionsHi=Array.isArray(r.options_hi)?r.options_hi:Object.values(r.options_hi||{});
  const answer=r.correct_option?String(r.correct_option).toUpperCase().charCodeAt(0)-65:null;
  return {id:String(r.id),exam:r.exam||"",stage:r.stage||"",text:r.question||"",textHi:r.question_hi||"",options,optionsHi,answer,correctOption:r.correct_option||"",nodeId:r.node_id||"",subject:r.subject||"",topic:r.topic||"",subtopic:r.subtopic||"",concept:r.concept||"",difficulty:r.difficulty||"",verificationStatus:r.verification_status||"unverified"};
}

export default function TestCreator(){
 const router=useRouter();
 const[profile,setProfile]=useState(null),[exam,setExam]=useState("ras"),[nodes,setNodes]=useState([]),[qs,setQs]=useState([]),[selected,setSelected]=useState(new Set()),[title,setTitle]=useState(""),[description,setDescription]=useState(""),[start,setStart]=useState(localValue(new Date(Date.now()+5*60000))),[end,setEnd]=useState(localValue(new Date(Date.now()+35*60000))),[duration,setDuration]=useState(30),[limit,setLimit]=useState(0),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[loadingQuestions,setLoadingQuestions]=useState(true);
 useEffect(()=>{(async()=>{try{const p=await getCloudProfile();if(!p||p.role!=="admin"){router.replace("/");return;}setProfile(p);setExam(p.exam||"ras");}catch(e){setMessage(e?.message||"Unable to load profile.");}})()},[router]);
 useEffect(()=>{(async()=>{try{setSelected(new Set());setNodes(allSyllabus.filter(n=>norm(n.exam)===norm(exam)));setLoadingQuestions(true);const {data:{session}}=await supabase.auth.getSession();if(!session?.access_token)throw new Error("Please sign in again.");const res=await fetch("/api/admin/questions",{headers:{Authorization:`Bearer ${session.access_token}`},cache:"no-store"});const body=await res.json().catch(()=>({}));if(!res.ok)throw new Error(body.error||"Unable to load question bank.");setQs((body.questions||[]).map(rowToQuestion));}catch(e){setMessage(e?.message||"Unable to load question bank.");setQs([]);}finally{setLoadingQuestions(false);}})()},[exam]);
 const examQs=useMemo(()=>qs.filter(q=>norm(q.exam)===norm(exam)),[qs,exam]);
 const subjects=useMemo(()=>nodes.filter(n=>n.level==="subject"),[nodes]);
 const selectedNodes=useMemo(()=>nodes.filter(n=>selected.has(n.nodeId)),[nodes,selected]);
 const selectedQuestions=useMemo(()=>examQs.filter(q=>selectedNodes.some(n=>questionMatchesNode(q,n))),[examQs,selectedNodes]);
 const chosenCount=limit>0?Math.min(Number(limit)||0,selectedQuestions.length):selectedQuestions.length;
 function descendants(id){return nodes.filter(n=>n.nodeId===id||n.nodeId.startsWith(id+"."));}
 function toggle(id){setSelected(s=>{const n=new Set(s);const group=descendants(id).map(x=>x.nodeId);const all=group.length>0&&group.every(x=>n.has(x));group.forEach(x=>all?n.delete(x):n.add(x));return n;});}
 function selectedForNode(id){const group=descendants(id).map(x=>x.nodeId);return group.length>0&&group.every(x=>selected.has(x));}
 function nodeTree(parent="",depth=0){return nodes.filter(n=>n.parentId===parent).map(n=><div key={n.nodeId}><label style={{display:"flex",gap:8,alignItems:"center",padding:"7px 4px",paddingLeft:depth*20,borderBottom:"1px solid #edf0f4"}}><input type="checkbox" checked={selectedForNode(n.nodeId)} onChange={()=>toggle(n.nodeId)}/><span style={{fontWeight:n.level==="subject"?700:n.level==="topic"?600:400}}>{n.title}</span><small style={{marginLeft:"auto",color:"#667085"}}>{n.level}</small></label>{nodeTree(n.nodeId,depth+1)}</div>);}
 async function publish(){
  setMessage("");
  if(!profile||profile.role!=="admin")return;
  if(!title.trim()){setMessage("Give the live test a title.");return;}
  if(!selectedQuestions.length){setMessage("Select at least one syllabus topic or concept containing questions.");return;}
  const st=new Date(start),en=new Date(end);
  if(Number.isNaN(st.getTime())||Number.isNaN(en.getTime())||en<=st){setMessage("End time must be after start time.");return;}
  setBusy(true);
  try{
   const {data:{session}}=await supabase.auth.getSession();
   if(!session?.access_token)throw new Error("Please sign in again.");
   let pool=[...selectedQuestions];
   for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
   if(Number(limit)>0)pool=pool.slice(0,Number(limit));
   const res=await fetch("/api/admin/live-tests",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({exam,title:title.trim(),description:description.trim(),startAt:st.toISOString(),endAt:en.toISOString(),durationSec:Math.max(60,Number(duration)*60),questionIds:pool.map(q=>q.id)})});
   const body=await res.json().catch(()=>({}));
   if(!res.ok)throw new Error(body.error||"Unable to publish live test.");
   setMessage(`LIVE TEST CREATED: ${title.trim()} • ${body.questionCount||pool.length} questions • ${start.replace("T"," ")} to ${end.replace("T"," ")}`);
   setSelected(new Set());
  }catch(e){setMessage(e?.message||"Unable to publish live test.");}
  finally{setBusy(false);}
 }
 if(!profile)return <main style={{padding:24,fontFamily:"system-ui"}}>Loading Test Creator…</main>;
 return <main style={{minHeight:"100vh",background:"#f6f8fb",color:"#172033",fontFamily:"system-ui,-apple-system,sans-serif"}}><div style={{maxWidth:1150,margin:"0 auto",padding:24}}><a href="/admin">← Admin Control</a><h1>Live Test Creator</h1><p style={{color:"#58657a"}}>Select an exam syllabus topic or concept. The test becomes available only during the period you set; after it ends, students see their result and rank.</p>{message&&<div style={{...card,background:"#f0f7ff"}}>{message}</div>}
 <section style={card}><h2>1. Test</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}><label>Exam<select value={exam} onChange={e=>setExam(e.target.value)} style={{display:"block",width:"100%",padding:10,marginTop:5}}>{Object.values(EXAM_PROFILES).filter(e=>e.id!=="custom").map(e=><option key={e.id} value={e.id}>{e.shortName}</option>)}</select></label><label>Test title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. RAS Polity Weekly Live Test" style={{display:"block",width:"100%",boxSizing:"border-box",padding:10,marginTop:5}}/></label><label>Duration (minutes)<input type="number" min="1" value={duration} onChange={e=>setDuration(e.target.value)} style={{display:"block",width:"100%",boxSizing:"border-box",padding:10,marginTop:5}}/></label><label>Question limit (0 = all selected)<input type="number" min="0" value={limit} onChange={e=>setLimit(e.target.value)} style={{display:"block",width:"100%",boxSizing:"border-box",padding:10,marginTop:5}}/></label></div><label style={{display:"block",marginTop:12}}>Description<input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Optional instructions" style={{display:"block",width:"100%",boxSizing:"border-box",padding:10,marginTop:5}}/></label></section>
 <section style={card}><h2>2. Select syllabus topics / concepts</h2><p style={{color:"#667085"}}>Selecting a subject/topic automatically includes its descendant concepts. Questions are matched by syllabus ID and by subject/topic/concept labels.</p><div style={{maxHeight:560,overflow:"auto",border:"1px solid #e4e9f0",borderRadius:10}}>{subjects.length?nodeTree():<p style={{padding:15}}>No syllabus loaded for this exam.</p>}</div><div style={{marginTop:12,fontWeight:700}}>{selected.size} syllabus nodes selected • {loadingQuestions?"Loading questions…":`${selectedQuestions.length} questions available`} • {chosenCount} will be live</div><div style={{marginTop:6,fontSize:12,color:"#667085"}}>Admin question bank: {qs.length} loaded • {examQs.length} for {EXAM_PROFILES[exam]?.shortName||exam}</div></section>
 <section style={card}><h2>3. Live period</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:12}}><label>Starts<input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} style={{display:"block",width:"100%",boxSizing:"border-box",padding:10,marginTop:5}}/></label><label>Ends<input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} style={{display:"block",width:"100%",boxSizing:"border-box",padding:10,marginTop:5}}/></label></div><p style={{color:"#667085"}}>Students can enter only while the test is live. Once the end time passes, the result screen replaces the questions.</p></section>
 <section style={{...card,position:"sticky",bottom:10,boxShadow:"0 4px 20px rgba(0,0,0,.08)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}><div><b>Ready to publish</b><div style={{color:"#667085"}}>{EXAM_PROFILES[exam]?.shortName} • {chosenCount} questions • {duration} min</div></div><button style={primary} disabled={busy||loadingQuestions||!title.trim()||!chosenCount} onClick={publish}>{busy?"Publishing…":"🔴 Make Live Test"}</button></div></section>
 </div></main>;
}
