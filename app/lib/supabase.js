import {createClient} from "@supabase/supabase-js";
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const cloudEnabled=Boolean(url&&key);
export const supabase=cloudEnabled?createClient(url,key):null;
export function cloudUserEmail(userId){return `${String(userId).trim().toLowerCase().replace(/[^a-z0-9._-]/g,"-")}@adaptive-syllabus.local`;}
export async function cloudSignUp({userId,password,name,dob,exam}){if(!supabase)throw new Error("Cloud mode is not configured");const {data,error}=await supabase.auth.signUp({email:cloudUserEmail(userId),password,options:{data:{user_id:userId,name,dob,exam}}});if(error)throw error;return data;}
export async function cloudSignIn(userId,password){if(!supabase)throw new Error("Cloud mode is not configured");const {data,error}=await supabase.auth.signInWithPassword({email:cloudUserEmail(userId),password});if(error)throw error;return data;}
export async function cloudSignOut(){if(supabase)await supabase.auth.signOut();}
export async function getCloudProfile(){if(!supabase)return null;const {data:{user}}=await supabase.auth.getUser();if(!user)return null;const {data,error}=await supabase.from("profiles").select("*").eq("id",user.id).single();if(error)throw error;return data;}
export async function updateCloudProfile({name,dob,exam}){if(!supabase)throw new Error("Cloud mode is not configured");const {data:{user}}=await supabase.auth.getUser();if(!user)throw new Error("Please sign in first.");const {data,error}=await supabase.from("profiles").update({name:name.trim(),dob:dob||null,exam}).eq("id",user.id).select("*").single();if(error)throw error;return data;}
export async function syncAttempt(attempt){if(!supabase)return {cloud:false};const {data:{user}}=await supabase.auth.getUser();if(!user)return {cloud:false};const {error}=await supabase.from("attempts").insert({user_id:user.id,exam:attempt.exam,question_id:String(attempt.questionId),node_id:attempt.nodeId||null,selected:attempt.selected,answer:attempt.answer,correct:Boolean(attempt.correct),created_at:attempt.at});if(error)throw error;return {cloud:true};}
export async function upsertProgress(progress){if(!supabase)return {cloud:false};const {data:{user}}=await supabase.auth.getUser();if(!user)return {cloud:false};const {error}=await supabase.from("question_progress").upsert({user_id:user.id,exam:progress.exam,question_id:String(progress.questionId),attempts:progress.attempts,correct:progress.correct,mastery:progress.mastery,last_attempt_at:progress.lastAttemptAt});if(error)throw error;return {cloud:true};}
