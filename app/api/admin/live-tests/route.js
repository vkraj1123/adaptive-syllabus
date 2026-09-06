import {createClient} from "@supabase/supabase-js";
import {NextResponse} from "next/server";

async function getAdmin(request){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,service=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!anon||!service)throw new Error("Server cloud configuration is incomplete.");
 const token=(request.headers.get("authorization")||"").replace(/^Bearer\s+/i,"");
 if(!token)return {error:NextResponse.json({error:"Authentication required."},{status:401})};
 const pub=createClient(url,anon,{auth:{autoRefreshToken:false,persistSession:false}});
 const {data:{user},error}=await pub.auth.getUser(token);
 if(error||!user)return {error:NextResponse.json({error:"Invalid or expired session."},{status:401})};
 const db=createClient(url,service,{auth:{autoRefreshToken:false,persistSession:false}});
 const {data:profile,error:pe}=await db.from("profiles").select("role").eq("id",user.id).maybeSingle();
 if(pe)return {error:NextResponse.json({error:pe.message},{status:500})};
 if(profile?.role!=="admin")return {error:NextResponse.json({error:"Admin access required."},{status:403})};
 return {user,db};
}

export async function GET(request){
 try{
  const auth=await getAdmin(request);if(auth.error)return auth.error;const {db}=auth;
  const url=new URL(request.url),testId=url.searchParams.get("testId");
  const {data:tests,error:te}=await db.from("tests").select("id,exam,title,description,start_at,end_at,duration_sec,status,created_by,created_at,published_at").order("start_at",{ascending:false});
  if(te)throw te;
  const ids=(tests||[]).map(t=>t.id);
  let attempts=[];
  if(ids.length){const {data:a,error:ae}=await db.from("test_attempts").select("id,test_id,user_id,started_at,submitted_at,score,correct,wrong,unanswered,total").in("test_id",ids).order("score",{ascending:false});if(ae)throw ae;attempts=a||[];}
  const userIds=[...new Set(attempts.map(a=>a.user_id))];let profiles=[];
  if(userIds.length){const {data:p,error:pe}=await db.from("profiles").select("id,user_id,name,exam").in("id",userIds);if(pe)throw pe;profiles=p||[];}
  const pm=new Map(profiles.map(p=>[p.id,p]));
  const decorated=(tests||[]).map(t=>{const pa=attempts.filter(a=>a.test_id===t.id).map(a=>({...a,student:pm.get(a.user_id)||{name:"Student",user_id:a.user_id}}));const submitted=pa.filter(a=>a.submitted_at);const scores=submitted.map(a=>Number(a.score));return {...t,questionCount:null,participantCount:submitted.length,attemptCount:pa.length,averageScore:scores.length?Number((scores.reduce((x,y)=>x+y,0)/scores.length).toFixed(2)):0,highestScore:scores.length?Math.max(...scores):0,participants:pa};});
  if(!testId)return NextResponse.json({tests:decorated});
  const test=decorated.find(t=>t.id===testId);if(!test)return NextResponse.json({error:"Test not found."},{status:404});
  const {data:tq,error:tqe}=await db.from("test_questions").select("question_id,order_no").eq("test_id",testId).order("order_no");if(tqe)throw tqe;
  const qids=(tq||[]).map(x=>x.question_id);test.questionCount=qids.length;
  const selectedAttempt=test.participants[0]||null;
  let details=[];
  if(selectedAttempt){const {data:ans,error:ae}=await db.from("test_answers").select("question_id,selected,correct").eq("attempt_id",selectedAttempt.id);if(ae)throw ae;const {data:qs,error:qe}=await db.from("questions").select("id,question,question_hi,options,options_hi,correct_option,explanation_short,explanation_long,subject,topic,concept").in("id",qids);if(qe)throw qe;const am=new Map((ans||[]).map(a=>[a.question_id,a])),qm=new Map((qs||[]).map(q=>[q.id,q]));details=(tq||[]).map((x,i)=>{const q=qm.get(x.question_id),a=am.get(x.question_id)||{selected:null,correct:false};return{number:i+1,question:q?.question||"",question_hi:q?.question_hi||"",options:Array.isArray(q?.options)?q.options:Object.values(q?.options||{}),options_hi:Array.isArray(q?.options_hi)?q.options_hi:Object.values(q?.options_hi||{}),selected:a.selected,correct:a.correct,correctOption:q?.correct_option||"",explanation:q?.explanation_long||q?.explanation_short||"",subject:q?.subject||"",topic:q?.topic||"",concept:q?.concept||""};});}
  return NextResponse.json({test,details});
 }catch(e){return NextResponse.json({error:e?.message||"Unable to load live-test administration."},{status:500});}
}

export async function POST(request){
 try{
  const auth=await getAdmin(request);if(auth.error)return auth.error;const {user,db}=auth;const body=await request.json().catch(()=>({}));
  const exam=String(body?.exam||"").trim(),title=String(body?.title||"").trim(),description=String(body?.description||"").trim()||null,startAt=new Date(body?.startAt),endAt=new Date(body?.endAt),durationSec=Math.max(60,Number(body?.durationSec)||1800),questionIds=Array.isArray(body?.questionIds)?body.questionIds.map(x=>String(x).trim()).filter(Boolean):[];
  if(!exam||!title)return NextResponse.json({error:"Exam and test title are required."},{status:400});
  if(Number.isNaN(startAt.getTime())||Number.isNaN(endAt.getTime())||endAt<=startAt)return NextResponse.json({error:"End time must be after start time."},{status:400});
  if(!questionIds.length)return NextResponse.json({error:"At least one question is required."},{status:400});
  if(questionIds.length>500)return NextResponse.json({error:"A live test cannot contain more than 500 questions."},{status:400});
  const {data:questions,error:qe}=await db.from("questions").select("id,exam").in("id",questionIds);if(qe)throw qe;
  const valid=new Set((questions||[]).filter(q=>String(q.exam||"").trim().toLowerCase()===exam.toLowerCase()).map(q=>String(q.id)));
  if(valid.size!==questionIds.length)return NextResponse.json({error:"One or more selected questions are missing or belong to another exam."},{status:400});
  const {data:test,error:te}=await db.from("tests").insert({exam,title,description,start_at:startAt.toISOString(),end_at:endAt.toISOString(),duration_sec:durationSec,status:"published",created_by:user.id,published_at:new Date().toISOString()}).select("*").single();if(te)throw te;
  const rows=questionIds.map((questionId,index)=>({test_id:test.id,question_id:questionId,order_no:index+1}));const {error:qte}=await db.from("test_questions").insert(rows);if(qte){await db.from("tests").delete().eq("id",test.id);throw qte;}
  return NextResponse.json({ok:true,test,questionCount:rows.length});
 }catch(e){return NextResponse.json({error:e?.message||"Unable to create live test."},{status:500});}
}
