import {createClient} from "@supabase/supabase-js";
import {NextResponse} from "next/server";

export async function DELETE(request){
  try{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const service=process.env.SUPABASE_SERVICE_ROLE_KEY;
    if(!url||!anon||!service)return NextResponse.json({error:"Server cloud configuration is incomplete."},{status:500});

    const auth=request.headers.get("authorization")||"";
    const token=auth.startsWith("Bearer ")?auth.slice(7):"";
    if(!token)return NextResponse.json({error:"Authentication required."},{status:401});

    const publicClient=createClient(url,anon,{auth:{autoRefreshToken:false,persistSession:false}});
    const {data:{user:adminUser},error:authError}=await publicClient.auth.getUser(token);
    if(authError||!adminUser)return NextResponse.json({error:"Invalid or expired session."},{status:401});

    const {data:adminProfile,error:profileError}=await publicClient.from("profiles").select("role").eq("id",adminUser.id).single();
    if(profileError||adminProfile?.role!=="admin")return NextResponse.json({error:"Admin access required."},{status:403});

    const body=await request.json().catch(()=>({}));
    const userId=String(body?.userId||"").trim();
    if(!userId)return NextResponse.json({error:"User id is required."},{status:400});
    if(userId===adminUser.id)return NextResponse.json({error:"You cannot delete your own admin account."},{status:400});

    const serviceClient=createClient(url,service,{auth:{autoRefreshToken:false,persistSession:false}});
    const {data:target,error:targetError}=await serviceClient.from("profiles").select("id,role").eq("id",userId).maybeSingle();
    if(targetError)return NextResponse.json({error:targetError.message},{status:500});
    if(!target)return NextResponse.json({error:"User profile not found."},{status:404});
    if(target.role==="admin")return NextResponse.json({error:"Another admin account cannot be deleted from this panel."},{status:403});

    const {error:deleteError}=await serviceClient.auth.admin.deleteUser(userId);
    if(deleteError)return NextResponse.json({error:deleteError.message},{status:500});
    return NextResponse.json({ok:true,userId});
  }catch(error){
    return NextResponse.json({error:error?.message||"Unable to delete account."},{status:500});
  }
}
