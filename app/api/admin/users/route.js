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
  const {data:profile,error:profileError}=await publicClient.from("profiles").select("role").eq("id",user.id).single();
  if(profileError||profile?.role!=="admin")return {error:NextResponse.json({error:"Admin access required."},{status:403})};
  return {user,url,service};
}

export async function PATCH(request){
  try{
    const auth=await getAdmin(request);if(auth.error)return auth.error;
    const {user,url,service}=auth;
    const body=await request.json().catch(()=>({}));
    const userId=String(body?.userId||"").trim();
    const role=String(body?.role||"").trim();
    if(!userId)return NextResponse.json({error:"User id is required."},{status:400});
    if(!["student","mentor","admin"].includes(role))return NextResponse.json({error:"Invalid role."},{status:400});
    if(userId===user.id)return NextResponse.json({error:"Your admin role cannot be changed here."},{status:400});
    const serviceClient=createClient(url,service,{auth:{autoRefreshToken:false,persistSession:false}});
    const {data:target,error:targetError}=await serviceClient.from("profiles").select("id,name,role").eq("id",userId).maybeSingle();
    if(targetError)return NextResponse.json({error:targetError.message},{status:500});
    if(!target)return NextResponse.json({error:"User profile not found."},{status:404});
    if(target.role==="admin")return NextResponse.json({error:"Another admin account cannot be changed from this panel."},{status:403});
    if(role==="admin")return NextResponse.json({error:"Admin promotion is disabled for safety. Use Student or Mentor."},{status:403});
    const {data,error}=await serviceClient.from("profiles").update({role}).eq("id",userId).select("*").single();
    if(error)return NextResponse.json({error:error.message},{status:500});
    return NextResponse.json({ok:true,profile:data});
  }catch(error){return NextResponse.json({error:error?.message||"Unable to change role."},{status:500});}
}

export async function DELETE(request){
  try{
    const auth=await getAdmin(request);if(auth.error)return auth.error;
    const {user,url,service}=auth;
    const body=await request.json().catch(()=>({}));
    const userId=String(body?.userId||"").trim();
    if(!userId)return NextResponse.json({error:"User id is required."},{status:400});
    if(userId===user.id)return NextResponse.json({error:"You cannot delete your own admin account."},{status:400});
    const serviceClient=createClient(url,service,{auth:{autoRefreshToken:false,persistSession:false}});
    const {data:target,error:targetError}=await serviceClient.from("profiles").select("id,role").eq("id",userId).maybeSingle();
    if(targetError)return NextResponse.json({error:targetError.message},{status:500});
    if(!target)return NextResponse.json({error:"User profile not found."},{status:404});
    if(target.role==="admin")return NextResponse.json({error:"Another admin account cannot be deleted from this panel."},{status:403});
    const {error:deleteError}=await serviceClient.auth.admin.deleteUser(userId);
    if(deleteError)return NextResponse.json({error:deleteError.message},{status:500});
    return NextResponse.json({ok:true,userId});
  }catch(error){return NextResponse.json({error:error?.message||"Unable to delete account."},{status:500});}
}
