import {createClient} from "@supabase/supabase-js";
import {NextResponse} from "next/server";

async function getAdmin(request){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!anon||!service)throw new Error("Server cloud configuration is incomplete.");
  const auth=request.headers.get("authorization")||"";
  const token=auth.startsWith("Bearer ")?auth.slice(7):"";
  if(!token)return {error:NextResponse.json({error:"Authentication required."},{status:401})};

  const publicClient=createClient(url,anon,{auth:{autoRefreshToken:false,persistSession:false}});
  const {data:{user},error}=await publicClient.auth.getUser(token);
  if(error||!user)return {error:NextResponse.json({error:"Invalid or expired session."},{status:401})};

  const serviceClient=createClient(url,service,{auth:{autoRefreshToken:false,persistSession:false}});
  const {data:profile,error:profileError}=await serviceClient.from("profiles").select("role").eq("id",user.id).maybeSingle();
  if(profileError)return {error:NextResponse.json({error:profileError.message},{status:500})};
  if(profile?.role!=="admin")return {error:NextResponse.json({error:"Admin access required."},{status:403})};
  return {user,serviceClient};
}

export async function POST(request){
  try{
    const auth=await getAdmin(request);if(auth.error)return auth.error;
    const {user,serviceClient}=auth;
    const body=await request.json().catch(()=>({}));
    const exam=String(body?.exam||"").trim();
    const title=String(body?.title||"").trim();
    const description=String(body?.description||"").trim()||null;
    const startAt=new Date(body?.startAt);
    const endAt=new Date(body?.endAt);
    const durationSec=Math.max(60,Number(body?.durationSec)||1800);
    const questionIds=Array.isArray(body?.questionIds)?body.questionIds.map(x=>String(x).trim()).filter(Boolean):[];

    if(!exam||!title)return NextResponse.json({error:"Exam and test title are required."},{status:400});
    if(Number.isNaN(startAt.getTime())||Number.isNaN(endAt.getTime())||endAt<=startAt)return NextResponse.json({error:"End time must be after start time."},{status:400});
    if(!questionIds.length)return NextResponse.json({error:"At least one question is required."},{status:400});
    if(questionIds.length>500)return NextResponse.json({error:"A live test cannot contain more than 500 questions."},{status:400});

    // Verify every selected question exists and belongs to the chosen exam.
    const {data:questions,error:qError}=await serviceClient.from("questions").select("id,exam").in("id",questionIds);
    if(qError)throw qError;
    const valid=new Set((questions||[]).filter(q=>String(q.exam||"").trim().toLowerCase()===exam.toLowerCase()).map(q=>String(q.id)));
    if(valid.size!==questionIds.length)return NextResponse.json({error:"One or more selected questions are missing or belong to another exam."},{status:400});

    const {data:test,error:testError}=await serviceClient.from("tests").insert({
      exam,title,description,start_at:startAt.toISOString(),end_at:endAt.toISOString(),
      duration_sec:durationSec,status:"published",created_by:user.id,published_at:new Date().toISOString()
    }).select("*").single();
    if(testError)throw testError;

    const rows=questionIds.map((questionId,index)=>({test_id:test.id,question_id:questionId,order_no:index+1}));
    const {error:questionsError}=await serviceClient.from("test_questions").insert(rows);
    if(questionsError){
      await serviceClient.from("tests").delete().eq("id",test.id);
      throw questionsError;
    }

    return NextResponse.json({ok:true,test,questionCount:rows.length});
  }catch(error){
    return NextResponse.json({error:error?.message||"Unable to create live test."},{status:500});
  }
}
