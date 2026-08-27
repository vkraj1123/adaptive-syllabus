"use client";

import { useMemo, useState } from "react";
import { PREDEFINED_SYLLABUS, SYLLABUS_META } from "../lib/predefinedSyllabus";

export default function SyllabusPage() {
  const [exam, setExam] = useState("ras");
  const [query, setQuery] = useState("");
  const nodes = useMemo(() => PREDEFINED_SYLLABUS.filter(n => n.exam === exam), [exam]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return nodes;
    return nodes.filter(n => `${n.title} ${n.nodeId} ${n.level}`.toLowerCase().includes(q));
  }, [nodes, query]);
  const counts = useMemo(() => ({
    subjects: nodes.filter(n => n.level === "subject").length,
    topics: nodes.filter(n => n.level === "topic").length,
    concepts: nodes.filter(n => n.level === "concept").length
  }), [nodes]);

  return (
    <main style={{maxWidth:1100,margin:"0 auto",padding:24,fontFamily:"system-ui,-apple-system,sans-serif",color:"#172033"}}>
      <header style={{marginBottom:20}}>
        <h1 style={{marginBottom:6}}>Concept-Level Syllabus Explorer</h1>
        <p style={{color:"#667085"}}>Atomic learning nodes for adaptive tracking, PYQ mapping and spaced revision.</p>
      </header>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {Object.entries(SYLLABUS_META).map(([id, meta]) => (
          <button key={id} onClick={() => setExam(id)} style={{padding:"9px 13px",borderRadius:8,border:"1px solid #ccd4df",background:exam===id?"#172033":"white",color:exam===id?"white":"#172033",cursor:"pointer"}}>
            {meta.label}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        {[['Subjects',counts.subjects],['Topics',counts.topics],['Concepts',counts.concepts]].map(([label,value])=><div key={label} style={{border:"1px solid #dfe5ed",borderRadius:10,padding:14,background:"#fff"}}><div style={{fontSize:12,color:"#667085"}}>{label}</div><strong style={{fontSize:24}}>{value}</strong></div>)}
      </div>
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search subject, topic or concept…" style={{width:"100%",boxSizing:"border-box",padding:11,border:"1px solid #ccd4df",borderRadius:8,marginBottom:14}} />
      <section style={{display:"grid",gap:8}}>
        {filtered.map(n => (
          <div key={n.nodeId} style={{border:"1px solid #e1e6ee",borderRadius:9,padding:"10px 12px",background:n.level==="concept"?"#fff":"#f8fafc",marginLeft:n.level==="subject"?0:n.level==="topic"?18:36}}>
            <div style={{fontSize:11,textTransform:"uppercase",color:"#667085"}}>{n.level}</div>
            <div style={{fontWeight:n.level==="concept"?500:700}}>{n.title}</div>
            {n.description && <div style={{fontSize:13,color:"#667085",marginTop:3}}>{n.description}</div>}
            <code style={{fontSize:10,color:"#98a2b3"}}>{n.nodeId}</code>
          </div>
        ))}
      </section>
      <footer style={{marginTop:24,padding:14,borderRadius:10,background:"#f2f4f7",fontSize:13}}>
        External-AI templates: <a href="/ai-question-extraction-template.md">question extraction</a> · <a href="/custom-exam-syllabus-generator-template.md">custom exam syllabus generation</a>
      </footer>
    </main>
  );
}
