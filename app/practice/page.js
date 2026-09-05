"use client";
import {useEffect,useMemo,useState} from "react";
import {EXAM_PROFILES} from "../lib/exams";

const box={background:"#fff",border:"1px solid #dfe5ed",borderRadius:16,padding:20,marginBottom:14};
const btn={padding:"11px 16px",borderRadius:10,border:"1px solid #ccd4df",background:"#fff",color:"#172033",cursor:"pointer",fontWeight:600};
const primary={...btn,background:"#172033",borderColor:"#172033",color:"#fff"};

function correctIndex(q){
  if(Number.isInteger(q?.answer)) return q.answer;
  if(Number.isInteger(q?.correct_option)) return q.correct_option;
  if(typeof q?.correct_option==="string"){
    const x=q.correct_option.trim().toUpperCase();
    if(/^[A-D]$/.test(x)) return x.charCodeAt(0)-65;
  }
  return null;
}

function keyForQuestion(q){return q?.id||q?.question_id||`${q?.nodeId||q?.node_id||"q"}-${q?.text||""}`;}

export default function Practice(){
  const[exam,setExam]=useState("ras");
  const[bank,setBank]=useState([]);
  const[length,setLength]=useState(10);
  const[session,setSession]=useState([]);
  const[index,setIndex]=useState(0);
  const[selected,setSelected]=useState(null);
  const[submitted,setSubmitted]=useState(false);
  const[results,setResults]=useState([]);
  const[skipped,setSkipped]=useState([]);
  const[started,setStarted]=useState(false);
  const[startedAt,setStartedAt]=useState(null);
  const[questionStartedAt,setQuestionStartedAt]=useState(null);

  useEffect(()=>{try{setBank(JSON.parse(localStorage.getItem("adaptive-question-bank")||"[]"))}catch{setBank([])}},[]);

  const available=useMemo(()=>bank.filter(q=>q.exam===exam),[bank,exam]);
  const current=session[index];
  const total=session.length;
  const correct=results.filter(r=>r.correct).length;
  const answered=results.length;

  function buildSession(){
    const pool=[...available].sort((a,b)=>{
      const ma=a.mastery??(a.attempts?Math.round((a.correct||0)/a.attempts*100):50);
      const mb=b.mastery??(b.attempts?Math.round((b.correct||0)/b.attempts*100):50);
      return ma-mb;
    });
    // Keep the lowest-mastery questions first, while avoiding a completely static order.
    const groups=[];
    for(let i=0;i<pool.length;i+=5) groups.push(pool.slice(i,i+5).sort(()=>Math.random()-.5));
    return groups.flat().slice(0,length);
  }

  function start(){
    const s=buildSession();
    if(!s.length)return;
    setSession(s);setIndex(0);setSelected(null);setSubmitted(false);setResults([]);setSkipped([]);setStarted(true);
    const now=Date.now();setStartedAt(now);setQuestionStartedAt(now);
  }

  function updateStoredQuestion(q,isCorrect,elapsedMs){
    try{
      const now=JSON.parse(localStorage.getItem("adaptive-question-bank")||"[]");
      const id=keyForQuestion(q);
      const updated=now.map(x=>{
        if(keyForQuestion(x)!==id)return x;
        const old=x.mastery??50;
        return {...x,attempts:(x.attempts||0)+1,correct:(x.correct||0)+(isCorrect?1:0),mastery:Math.round(Math.max(0,Math.min(100,old+(isCorrect?8:-10)))),lastAttemptAt:new Date().toISOString(),lastElapsedMs:elapsedMs};
      });
      localStorage.setItem("adaptive-question-bank",JSON.stringify(updated));
      setBank(updated);
    }catch{}
  }

  function submit(){
    if(selected===null||submitted||!current)return;
    const ci=correctIndex(current);
    const isCorrect=ci!==null&&selected===ci;
    const elapsed=Math.max(0,Date.now()-(questionStartedAt||Date.now()));
    updateStoredQuestion(current,isCorrect,elapsed);
    setResults(r=>[...r,{id:keyForQuestion(current),correct:isCorrect,selected,correctIndex:ci,elapsedMs:elapsed,nodeId:current.nodeId||current.node_id}]);
    setSubmitted(true);
  }

  function next(){
    if(index>=total-1)return;
    setIndex(i=>i+1);setSelected(null);setSubmitted(false);setQuestionStartedAt(Date.now());
  }

  function skip(){
    if(submitted)return;
    setSkipped(s=>[...s,keyForQuestion(current)]);
    if(index>=total-1){setSubmitted(true);return;}
    setIndex(i=>i+1);setSelected(null);setQuestionStartedAt(Date.now());
  }

  useEffect(()=>{
    if(!started)return;
    function onKey(e){
      if(!submitted&&["a","b","c","d"].includes(e.key.toLowerCase())){
        const n=e.key.toLowerCase().charCodeAt(0)-97;
        if(current?.options?.[n])setSelected(n);
      }else if(e.key==="Enter"){
        if(submitted)next();else submit();
      }else if(e.key==="Escape"&&!submitted)skip();
    }
    window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey);
  });

  if(started&&index>=total-1&&submitted){
    const accuracy=answered?Math.round(correct/answered*100):0;
    const weak={};results.filter(r=>!r.correct).forEach(r=>{weak[r.nodeId]=(weak[r.nodeId]||0)+1});
    const weakList=Object.keys(weak).sort((a,b)=>weak[b]-weak[a]).slice(0,5);
    return <main style={{minHeight:"100vh",background:"#f6f8fb",color:"#172033",fontFamily:"system-ui,-apple-system,sans-serif"}}><div style={{maxWidth:760,margin:"0 auto",padding:24}}>
      <a href="/" style={{color:"inherit"}}>← Dashboard</a><section style={{...box,marginTop:18,textAlign:"center"}}><div style={{fontSize:13,color:"#667085",fontWeight:700,letterSpacing:.5}}>SESSION COMPLETE</div><h1 style={{fontSize:40,margin:"10px 0 4px"}}>{correct} / {answered}</h1><p style={{fontSize:18,marginTop:0}}>{accuracy}% accuracy • {skipped.length} skipped</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,margin:"22px 0"}}>{[["Questions",total],["Correct",correct],["Accuracy",`${accuracy}%`],["Time",`${Math.round((Date.now()-(startedAt||Date.now()))/60000)} min`]].map(([a,b])=><div key={a} style={{padding:14,border:"1px solid #edf0f4",borderRadius:12}}><div style={{fontSize:12,color:"#667085"}}>{a}</div><strong style={{fontSize:22}}>{b}</strong></div>)}</div>{weakList.length>0&&<div style={{textAlign:"left",padding:14,borderRadius:12,background:"#fff7ed"}}><strong>Recommended revision</strong><p style={{marginBottom:6}}>Revisit these weak concepts:</p>{weakList.map(x=><div key={x} style={{fontSize:13,margin:"5px 0"}}>• {x}</div>)}</div>}{weakList.length===0&&<div style={{padding:14,borderRadius:12,background:"#ecfdf3"}}><strong>Strong session.</strong><p style={{marginBottom:0}}>Keep practicing to reinforce retention and speed.</p></div>}<div style={{display:"flex",gap:10,justifyContent:"center",marginTop:20,flexWrap:"wrap"}}><button style={primary} onClick={()=>{setStarted(false);setSession([])}}>New practice session</button><a href="/analytics" style={btn}>View analytics →</a></div></section></div></main>;
  }

  if(!started)return <main style={{minHeight:"100vh",background:"#f6f8fb",color:"#172033",fontFamily:"system-ui,-apple-system,sans-serif"}}><div style={{maxWidth:760,margin:"0 auto",padding:24}}><a href="/" style={{color:"inherit"}}>← Dashboard</a><section style={{...box,marginTop:18}}><div style={{fontSize:13,color:"#667085",fontWeight:700}}>ADAPTIVE PRACTICE</div><h1 style={{marginBottom:6}}>Practice one question at a time</h1><p style={{color:"#667085"}}>Questions are prioritised by lower recorded mastery. Answer, get feedback, then move forward.</p><h3>Choose exam</h3><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{Object.values(EXAM_PROFILES).map(e=><button key={e.id} onClick={()=>setExam(e.id)} style={exam===e.id?primary:btn}>{e.shortName}</button>)}</div><h3 style={{marginTop:22}}>Session length</h3><div style={{display:"flex",gap:8,flexWrap:"wrap"}} {[5,10,20,50].map(n=><button key={n} onClick={()=>setLength(n)} style={length===n?primary:btn}>{n} questions</button>)}</div>{available.length===0?<div style={{marginTop:18,padding:14,borderRadius:12,background:"#fff7ed"}}>No questions yet for {EXAM_PROFILES[exam]?.shortName||exam}. Import validated questions first.</div>:<button style={{...primary,marginTop:22,width:"100%",fontSize:16}} onClick={start}>Start adaptive practice →</button>}</section></div></main>;

  const ci=correctIndex(current);
  const selectedCorrect=submitted&&ci!==null&&selected===ci;
  const progress=((index+1)/total)*100;
  return <main style={{minHeight:"100vh",background:"#f6f8fb",color:"#172033",fontFamily:"system-ui,-apple-system,sans-serif"}}><div style={{maxWidth:800,margin:"0 auto",padding:18}}>
    <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginBottom:10}}><div><b>{EXAM_PROFILES[exam]?.shortName||exam}</b><div style={{fontSize:12,color:"#667085"}}>Adaptive practice</div></div><strong>Question {index+1} of {total}</strong></header>
    <div style={{height:8,background:"#e7ebf0",borderRadius:99,overflow:"hidden",marginBottom:18}}><div style={{height:"100%",width:`${progress}%`,background:"#172033",transition:"width .2s"}}/></div>
    <section style={box}>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",fontSize:12,color:"#667085",marginBottom:16}}><span>{current?.nodeId||current?.node_id||"Concept"}</span><span>•</span><span>{current?.difficulty||"moderate"}</span></div>
      <h2 style={{fontSize:"clamp(20px,4vw,28px)",lineHeight:1.35,margin:"0 0 20px"}}>{current?.text}</h2>
      <div>{(current?.options||[]).map((o,j)=>{const chosen=selected===j;const right=submitted&&ci===j;const wrong=submitted&&chosen&&!right;return <button key={j} disabled={submitted} onClick={()=>setSelected(j)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",textAlign:"left",padding:"15px 14px",margin:"9px 0",borderRadius:12,border:`2px solid ${right?"#16a34a":wrong?"#dc2626":chosen?"#172033":"#e3e7ed"}`,background:right?"#ecfdf3":wrong?"#fef2f2":chosen?"#f3f4f6":"#fff",color:"#172033",cursor:submitted?"default":"pointer",fontSize:16,lineHeight:1.35}}><span style={{width:30,height:30,borderRadius:"50%",border:"1px solid #cbd5e1",display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:700,flex:"0 0 auto"}}>{String.fromCharCode(65+j)}</span><span>{o}</span></button>})}</div>
      {!submitted?<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginTop:20}}><button style={{...btn,border:0,color:"#667085"}} onClick={skip}>Skip</button><button style={{...primary,opacity:selected===null?.5:1}} disabled={selected===null} onClick={submit}>Submit answer</button></div>:<div style={{marginTop:20}}><div style={{padding:14,borderRadius:12,background:selectedCorrect?"#ecfdf3":"#fef2f2"}}><strong>{selectedCorrect?"✓ Correct":"✕ Incorrect"}</strong>{current?.explanation&&<p style={{marginBottom:0,lineHeight:1.55}}>{current.explanation}</p>}{current?.key_fact&&<p style={{marginBottom:0,marginTop:10}}><strong>Key fact:</strong> {current.key_fact}</p>}</div><div style={{display:"flex",justifyContent:"flex-end",marginTop:14}}><button style={primary} onClick={next}>{index===total-1?"Finish session":"Next question →"}</button></div></div>}
    </section>
    <div style={{textAlign:"center",fontSize:12,color:"#667085"}}>Tip: press A–D to choose • Enter to submit/continue • Esc to skip</div>
  </div></main>;
}
