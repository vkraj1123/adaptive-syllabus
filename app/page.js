"use client";
import {useEffect,useMemo,useState} from "react";
import {EXAM_PROFILES,DEFAULT_EXAM} from "./lib/exams";
import {PREDEFINED_SYLLABUS,SYLLABUS_META} from "./lib/predefinedSyllabus";
import {NEET_SYLLABUS,NEET_SYLLABUS_META} from "./lib/neetSyllabus";
import {cloudSignUp,cloudSignIn,cloudSignOut,getCloudProfile} from "./lib/supabase";

const css={page:{minHeight:"100vh",background:"#f6f8fb",color:"#172033",fontFamily:"system-ui,-apple-system,sans-serif"},wrap:{maxWidth:1200,margin:"0 auto",padding:24},btn:{border:"1px solid #ccd4df",background:"white",borderRadius:9,padding:"10px 14px",cursor:"pointer",textDecoration:"none",color:"inherit"},primary:{background:"#172033",color:"white",border:"1px solid #172033",borderRadius:9,padding:"10px 14px",cursor:"pointer",textDecoration:"none"},card:{background:"white",border:"1px solid #dfe5ed",borderRadius:14,padding:18,marginBottom:14},grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12},input:{width:"100%",boxSizing:"border-box",padding:11,border:"1px solid #ccd4df",borderRadius:9},small:{fontSize:12,color:"#667085"}};
const allSyllabus=[...PREDEFINED_SYLLABUS,...NEET_SYLLABUS];

export default function Home(){
 const[user,setUser]=useState(null),[loginId,setLoginId]=useState(""),[loginPw,setLoginPw]=useState(""),[signup,setSignup]=useState(false),[name,setName]=useState(""),[dob,setDob]=useState(""),[chosenExam,setChosenExam]=useState(DEFAULT_EXAM),[message,setMessage]=useState(""),[busy,setBusy]=useState(false);
 const[exam,setExam]=useState(DEFAULT_EXAM),[tab,setTab]=useState("dashboard"),[query,setQuery]=useState(""),[expanded,setExpanded]=useState(new Set()),[bank,setBank]=useState([]);

 useEffect(()=>{
   let active=true;
   (async()=>{
     try{
       const profile=await getCloudProfile();
       if(!active||!profile)return;
       setUser(profile);setExam(profile.exam||DEFAULT_EXAM);localStorage.setItem("adaptive-user",JSON.stringify(profile));
     }catch{}
     try{setBank(JSON.parse(localStorage.getItem("adaptive-question-bank")||"[]"))}catch{}
   })();
   return()=>{active=false};
 },[]);

 const examNodes=useMemo(()=>allSyllabus.filter(n=>n.exam===exam),[exam]);
 const examQuestions=useMemo(()=>bank.filter(q=>String(q.exam||"").toLowerCase()===exam),[bank,exam]);
 const counts=useMemo(()=>({subjects:examNodes.filter(n=>n.level==="subject").length,topics:examNodes.filter(n=>n.level==="topic").length,concepts:examNodes.filter(n=>n.level==="concept").length}),[examNodes]);
 const stats=useMemo(()=>{const attempts=examQuestions.reduce((n,q)=>n+(q.attempts||0),0),correct=examQuestions.reduce((n,q)=>n+(q.correct||0),0),mastered=examQuestions.filter(q=>(q.mastery??50)>=75).length,weak=[...examQuestions].filter(q=>(q.attempts||0)>0).sort((a,b)=>(a.mastery??50)-(b.mastery??50)).slice(0,5);return{attempts,accuracy:attempts?Math.round(correct/attempts*100):0,mastered,weak}},[examQuestions]);
 const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return q?examNodes.filter(n=>(n.title+" "+n.nodeId+" "+n.level).toLowerCase().includes(q)):examNodes},[examNodes,query]);
 const tree=useMemo(()=>{const m={},r=[];examNodes.forEach(n=>m[n.nodeId]={...n,children:[]});examNodes.forEach(n=>n.parentId&&m[n.parentId]?m[n.parentId].children.push(m[n.nodeId]):r.push(m[n.nodeId]));return r},[examNodes]);

 async function login(){
   setMessage("");setBusy(true);
   try{
     if(!loginId.trim()||!loginPw){setMessage("Please enter your User ID and password.");return}
     if(signup){
       if(!name.trim()||!dob||!chosenExam){setMessage("Please complete name, date of birth and exam.");return}
       const data=await cloudSignUp({userId:loginId.trim(),password:loginPw,name:name.trim(),dob,exam:chosenExam});
       if(!data?.session){setMessage("Account created, but no session was returned. Please try signing in.");return}
       const profile=await getCloudProfile();
       const u=profile||{id:loginId.trim(),name:name.trim(),dob,exam:chosenExam,role:"student"};
       localStorage.setItem("adaptive-user",JSON.stringify(u));setUser(u);setExam(u.exam||chosenExam);setMessage("Profile created. Your cloud dashboard is ready.");
     }else{
       await cloudSignIn(loginId.trim(),loginPw);
       const profile=await getCloudProfile();
       if(!profile)throw new Error("Your account exists, but its profile could not be loaded.");
       localStorage.setItem("adaptive-user",JSON.stringify(profile));setUser(profile);setExam(profile.exam||DEFAULT_EXAM);setMessage("Welcome back, "+profile.name+"!");
     }
   }catch(e){setMessage(e?.message||"Unable to sign in. Please try again.");}
   finally{setBusy(false)}
 }
 async function logout(){await cloudSignOut();localStorage.removeItem("adaptive-user");setUser(null);setMessage("");}
 function node(n,d=0){const open=expanded.has(n.nodeId);return <div key={n.nodeId}><div onClick={()=>n.children.length&&setExpanded(s=>{const x=new Set(s);x.has(n.nodeId)?x.delete(n.nodeId):x.add(n.nodeId);return x})} style={{display:"flex",gap:8,alignItems:"center",padding:"9px 4px",paddingLeft:d*20,borderBottom:"1px solid #edf0f4",cursor:n.children.length?"pointer":"default"}}><span style={{width:14}}>{n.children.length?(open?"▾":"▸"):""}</span><span style={{fontWeight:n.level==="subject"?700:n.level==="topic"?600:400}}>{n.title}</span><span style={{...css.small,marginLeft:"auto"}}>{n.level}</span></div>{open&&n.children.map(c=>node(c,d+1))}</div>}

 if(!user)return <main style={css.page}><div style={{...css.wrap,maxWidth:470,paddingTop:55}}><section style={{...css.card,textAlign:"center"}}><b>ADAPTIVE SYLLABUS</b><h1>{signup?"Create your learning profile":"Welcome back"}</h1><p style={css.small}>{signup?"Tell us who you are and what you are preparing for.":"Sign in to continue your personalised preparation."}</p>{message&&<p>{message}</p>}{signup&&<><input style={{...css.input,marginBottom:10}} placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}/><label style={{display:"block",textAlign:"left",fontSize:12,color:"#667085",marginBottom:5}}>Date of birth</label><input style={{...css.input,marginBottom:14}} type="date" value={dob} onChange={e=>setDob(e.target.value)}/><div style={{textAlign:"left",fontWeight:700,marginBottom:8}}>Choose your exam</div><div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>{Object.values(EXAM_PROFILES).filter(e=>e.id!=="custom").map(e=><button type="button" key={e.id} onClick={()=>setChosenExam(e.id)} style={chosenExam===e.id?css.primary:css.btn}>{e.shortName}</button>)}</div></>}<input style={{...css.input,marginBottom:10}} placeholder="User ID" value={loginId} onChange={e=>setLoginId(e.target.value)}/><input style={{...css.input,marginBottom:12}} type="password" placeholder="Password" value={loginPw} onChange={e=>setLoginPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!busy&&login()}/><button style={{...css.primary,width:"100%",opacity:busy?.7:1}} disabled={busy} onClick={login}>{busy?"Please wait…":signup?"Create profile":"Sign in"}</button><button style={{...css.btn,width:"100%",marginTop:10}} disabled={busy} onClick={()=>{setSignup(!signup);setMessage("")}}>{signup?"Already registered? Sign in":"New student? Create profile"}</button></section></div></main>;

 const label=exam==="neet"?NEET_SYLLABUS_META.neet.label:(SYLLABUS_META[exam]?.label||EXAM_PROFILES[exam]?.name||exam);
 return <main style={css.page}><div style={css.wrap}><header style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:16,flexWrap:"wrap"}}><div><b>ADAPTIVE SYLLABUS</b><h1 style={{margin:"6px 0"}}>Hello, {user.name}</h1><span style={css.small}>{label} • cloud learning profile</span></div><div style={{textAlign:"right"}}><span style={css.small}>{user.dob?`DOB ${user.dob} • `:""}{EXAM_PROFILES[exam]?.shortName}</span><br/><button style={{...css.btn,marginTop:5}} onClick={logout}>Logout</button></div></header><nav style={{display:"flex",gap:8,flexWrap:"wrap",margin:"18px 0"}}><button style={tab==="dashboard"?css.primary:css.btn} onClick={()=>setTab("dashboard")}>My Dashboard</button><button style={tab==="syllabus"?css.primary:css.btn} onClick={()=>setTab("syllabus")}>My Syllabus</button><a href={`/practice?exam=${exam}`} style={css.btn}>Practice</a><button style={tab==="search"?css.primary:css.btn} onClick={()=>setTab("search")}>Concept Search</button><a href={`/analytics?exam=${exam}`} style={css.btn}>My Analytics</a>{user.role==="admin"&&<><a href="/question-bank" style={css.btn}>Question Bank</a><a href="/question-import" style={css.btn}>AI Import</a><a href="/admin" style={css.btn}>Students</a></>}</nav>{message&&<div style={{...css.card,background:"#f0f7ff"}}>{message}</div>}{tab==="dashboard"&&<><section style={{...css.card,background:"linear-gradient(135deg,#ffffff,#f3f6fb)"}}><div style={css.small}>TODAY'S FOCUS</div><h2 style={{marginBottom:6}}>{stats.weak[0]?.concept||stats.weak[0]?.nodeId||"Start your first adaptive session"}</h2><p style={css.small}>{stats.attempts?"Your lowest-mastery attempted concept is prioritised.":"Complete a practice session and this dashboard will begin adapting to you."}</p><a href={`/practice?exam=${exam}`} style={css.primary}>Start personalised practice →</a></section><div style={css.grid}>{[["Questions",examQuestions.length],["Attempts",stats.attempts],["Accuracy",stats.accuracy+"%"],["Mastered questions",stats.mastered]].map(([a,b])=><section key={a} style={css.card}><div style={css.small}>{a}</div><div style={{fontSize:30,fontWeight:700}}>{b}</div></section>)}</div><section style={css.card}><h2>{label}</h2><p style={css.small}>{counts.subjects} subjects • {counts.topics} topics • {counts.concepts} concepts</p>{stats.weak.length?<><h3>Your revision priorities</h3>{stats.weak.map((q,i)=><div key={q.id||i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #edf0f4"}}><span>{q.concept||q.nodeId||"Concept"}</span><b>{q.mastery??50}%</b></div>)}</>:<p>No learning history yet — your priorities will appear after practice.</p>}</section></>}{tab==="syllabus"&&<section style={css.card}><h2>My {EXAM_PROFILES[exam]?.shortName} Syllabus</h2><div style={css.small}>{counts.subjects} subjects • {counts.topics} topics • {counts.concepts} concepts</div><div style={{display:"flex",gap:8,margin:"12px 0"}}><button style={css.btn} onClick={()=>setExpanded(new Set(examNodes.map(n=>n.nodeId)))}>Expand all</button><button style={css.btn} onClick={()=>setExpanded(new Set())}>Collapse all</button></div>{tree.map(n=>node(n))}</section>}{tab==="search"&&<section style={css.card}><h2>Search my syllabus</h2><input style={css.input} placeholder="Search subject, topic or concept…" value={query} onChange={e=>setQuery(e.target.value)}/><div style={{marginTop:12}}>{filtered.slice(0,150).map(n=><div key={n.nodeId} style={{padding:"9px 4px",borderBottom:"1px solid #edf0f4"}}><b>{n.title}</b><div style={css.small}>{n.level} • {n.nodeId}</div></div>)}</div></section>}</div></main>;
}
