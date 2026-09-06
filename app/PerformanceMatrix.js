"use client";
import {useEffect,useMemo,useState} from "react";
import {supabase} from "./lib/supabase";

const card={background:"#fff",border:"1px solid #dfe5ed",borderRadius:14,padding:18,margin:"14px 0"};
const small={fontSize:12,color:"#667085"};
function label(q){return q?.concept||q?.topic||q?.subject||q?.node_id||"Unmapped";}
function build(rows){
 const m=new Map();
 for(const r of rows){const k=r.node_id||label(r);if(!m.has(k))m.set(k,{key:k,label:label(r),practice:0,practiceCorrect:0,live:0,liveCorrect:0});const x=m.get(k);if(r.source==="practice"){x.practice++;if(r.correct)x.practiceCorrect++;}else{x.live++;if(r.correct)x.liveCorrect++;}}
 return [...m.values()].map(x=>{const total=x.practice+x.live,correct=x.practiceCorrect+x.liveCorrect;return{...x,total,correct,practiceAccuracy:x.practice?Math.round(x.practiceCorrect/x.practice*100):null,liveAccuracy:x.live?Math.round(x.liveCorrect/x.live*100):null,accuracy:total?Math.round(correct/total*100):0};}).filter(x=>x.total>0).sort((a,b)=>a.accuracy-b.accuracy||b.total-a.total);
}
async function loadPerformance(profile){
 if(!supabase||!profile?.id)return {areas:[],metrics:null};
 const exam=String(profile.exam||"").toLowerCase();
 const {data:pa,error:pe}=await supabase.from("attempts").select("user_id,exam,question_id,node_id,correct,created_at").eq("user_id",profile.id).eq("exam",exam);
 if(pe)throw pe;
 const {data:ta,error:te}=await supabase.from("test_attempts").select("id,test_id,user_id,submitted_at,correct,wrong,unanswered,total").eq("user_id",profile.id).not("submitted_at","is",null);
 if(te)throw te;
 const testIds=(ta||[]).map(x=>x.test_id);let tests=[];let la=[];
 if(testIds.length){const {data:t,error:xe}=await supabase.from("tests").select("id,exam").in("id",testIds);if(xe)throw xe;tests=t||[];const {data:a,error:ae}=await supabase.from("test_answers").select("attempt_id,question_id,selected,correct").in("attempt_id",(ta||[]).map(x=>x.id));if(ae)throw ae;la=a||[];}
 const qids=[...(pa||[]).map(x=>x.question_id),...la.map(x=>x.question_id)];let qs=[];
 if(qids.length){const {data:q,error:qe}=await supabase.from("questions").select("id,exam,subject,topic,concept,node_id").in("id",[...new Set(qids)]);if(qe)throw qe;qs=q||[];}
 const qm=new Map(qs.map(q=>[q.id,q]));
 const practiceRows=(pa||[]).map(r=>({...r,...(qm.get(r.question_id)||{}),source:"practice"}));
 const liveExam=new Map(tests.map(t=>[t.id,String(t.exam||"").toLowerCase()]));
 const liveRows=la.filter(r=>liveExam.get((ta||[]).find(a=>a.id===r.attempt_id)?.test_id)===exam).map(r=>({...r,...(qm.get(r.question_id)||{}),source:"live"}));
 const areas=build([...practiceRows,...liveRows]);
 const practiceAttempts=practiceRows.length,practiceCorrect=practiceRows.filter(x=>x.correct).length,liveQuestions=liveRows.length,liveCorrect=liveRows.filter(x=>x.correct).length;
 const liveTests=(ta||[]).filter(a=>liveExam.get(a.test_id)===exam).length,total=practiceAttempts+liveQuestions,correct=practiceCorrect+liveCorrect;
 return{areas,metrics:{practiceAttempts,liveTests,liveQuestions,total,correct,accuracy:total?Math.round(correct/total*100):0}};
}
export default function PerformanceMatrix({profile,admin=false,users=[]}){
 const[data,setData]=useState({}),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{let live=true;(async()=>{try{setLoading(true);setError("");if(admin){const out={};for(const u of users){const x=await loadPerformance(u);out[u.id]=x;}if(live)setData(out);}else{const x=await loadPerformance(profile);if(live)setData({self:x});}}catch(e){if(live)setError(e?.message||"Unable to load performance.");}finally{if(live)setLoading(false);}})();return()=>{live=false};},[admin,profile,users]);
 if(loading)return <section style={card}><h2 style={{marginTop:0}}>Weak Areas & Performance</h2><p style={small}>Building your practice + live-test performance matrix…</p></section>;
 if(error)return <section style={card}><h2 style={{marginTop:0}}>Weak Areas & Performance</h2><p>{error}</p></section>;
 if(admin)return <section style={card}><h2 style={{marginTop:0}}>Student Weak Areas & Performance</h2><p style={small}>Combined question-level analysis from practice and submitted live tests.</p>{users.filter(u=>u.role!=="admin").map(u=>{const x=data[u.id]||{areas:[],metrics:null},m=x.metrics;return <details key={u.id} style={{borderTop:"1px solid #edf0f4",padding:"12px 0"}}><summary style={{cursor:"pointer",fontWeight:700}}>{u.name} <span style={small}>• {u.user_id} • {m?.accuracy??0}% combined accuracy</span></summary><div style={{overflowX:"auto",marginTop:12}}><table style={{width:"100%",borderCollapse:"collapse",minWidth:720}}><thead><tr>{["Weak area","Practice","Live","Combined","Responses"].map(h=><th key={h} style={{textAlign:"left",padding:8}}>{h}</th>)}</tr></thead><tbody>{x.areas.slice(0,10).map(a=><tr key={a.key} style={{borderTop:"1px solid #edf0f4"}}><td style={{padding:8}}><b>{a.label}</b></td><td style={{padding:8}}>{a.practiceAccuracy===null?"—":a.practiceAccuracy+"%"} <span style={small}>({a.practice})</span></td><td style={{padding:8}}>{a.liveAccuracy===null?"—":a.liveAccuracy+"%"} <span style={small}>({a.live})</span></td><td style={{padding:8,fontWeight:700}}>{a.accuracy}%</td><td style={{padding:8}}>{a.total}</td></tr>)}</tbody></table>{!x.areas.length&&<p style={small}>No performance data yet.</p>}</div></details>})}</section>;
 const x=data.self||{areas:[],metrics:null},m=x.metrics||{};
 return <section style={card}><div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}><div><h2 style={{margin:0}}>Your Weak Areas</h2><p style={small}>Practice + live-test performance matrix for {profile?.exam||"your active exam"}.</p></div><b>{m.accuracy??0}% overall accuracy</b></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,margin:"14px 0"}}>{[["Practice",m.practiceAttempts||0],["Live Tests",m.liveTests||0],["Live Questions",m.liveQuestions||0],["Questions",m.total||0]].map(([h,v])=><div key={h} style={{padding:10,border:"1px solid #edf0f4",borderRadius:10}}><div style={small}>{h}</div><b style={{fontSize:20}}>{v}</b></div>)}</div>{x.areas.length?<div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",minWidth:720}}><thead><tr>{["Weak area","Practice accuracy","Live accuracy","Combined","Responses"].map(h=><th key={h} style={{textAlign:"left",padding:9}}>{h}</th>)}</tr></thead><tbody>{x.areas.slice(0,10).map(a=><tr key={a.key} style={{borderTop:"1px solid #edf0f4"}}><td style={{padding:9}}><b>{a.label}</b></td><td style={{padding:9}}>{a.practiceAccuracy===null?"—":a.practiceAccuracy+"%"} <span style={small}>({a.practice})</span></td><td style={{padding:9}}>{a.liveAccuracy===null?"—":a.liveAccuracy+"%"} <span style={small}>({a.live})</span></td><td style={{padding:9,fontWeight:800}}>{a.accuracy}%</td><td style={{padding:9}}>{a.total}</td></tr>)}</tbody></table></div>:<p>No performance data yet. Start practice or submit a live test.</p>}</section>;
}
