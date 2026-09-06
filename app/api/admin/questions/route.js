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
  return {serviceClient};
}

export async function GET(request){
  try{
    const auth=await getAdmin(request);
    if(auth.error)return auth.error;
    const {data,error}=await auth.serviceClient.from("questions").select("id,exam,stage,question,question_hi,options,options_hi,correct_option,node_id,subject,topic,subtopic,concept,difficulty,verification_status").order("created_at",{ascending:false});
    if(error)return NextResponse.json({error:error.message},{status:500});
    return NextResponse.json({questions:data||[]});
  }catch(error){
    return NextResponse.json({error:error?.message||"Unable to load question bank."},{status:500});
  }
}
