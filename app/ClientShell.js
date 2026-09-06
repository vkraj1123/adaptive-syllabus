"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {usePathname} from "next/navigation";
import {getCloudProfile} from "./lib/supabase";
import PerformanceMatrix from "./PerformanceMatrix";

const links=[["/","Dashboard"],["/syllabus","Syllabus"],["/practice","Practice"],["/live-test","Live Tests"],["/question-bank","Question Bank"],["/question-import","AI Import"],["/test-creator","Test Creator"],["/analytics","Analytics"],["/profile","Profile"]];
export default function ClientShell({children}){
 const pathname=usePathname();const[profile,setProfile]=useState(null),[users,setUsers]=useState([]);
 useEffect(()=>{let active=true;(async()=>{try{const p=await getCloudProfile();if(!active)return;setProfile(p);if(p?.role==="admin"){const{data,error}=await import("./lib/supabase").then(m=>m.supabase.from("profiles").select("id,user_id,name,exam,role").order("created_at"));if(!error)setUsers(data||[]);}}catch{}})();return()=>{active=false};},[pathname]);
 const show=pathname==="/"||pathname==="/admin";
 return <><nav aria-label="Primary navigation" style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",padding:"10px 18px",borderBottom:"1px solid #dfe5ed",background:"#fff",fontFamily:"system-ui,-apple-system,sans-serif",position:"sticky",top:0,zIndex:20}}><strong style={{marginRight:6}}>ADAPTIVE SYLLABUS</strong>{links.map(([href,label])=><Link key={href} href={href} style={{padding:"7px 10px",borderRadius:7,color:"#172033",textDecoration:"none"}}>{label}</Link>)}</nav>{children}{show&&profile&&<div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px 24px"}}><PerformanceMatrix profile={profile} admin={profile.role==="admin"&&pathname==="/admin"} users={users}/></div>}</>;
}
