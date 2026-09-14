'use client';
import {useEffect,useMemo,useState} from 'react';
import './read.css';

export default function NotesReadPage(){
 const [notes,setNotes]=useState([]),[id,setId]=useState('ca-2026-09-07'),[speaking,setSpeaking]=useState(false),[paused,setPaused]=useState(false);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem('vk-notes-v1')||'[]');setNotes(saved);if(saved[0]?.id)setId(saved[0].id)}catch{}},[]);
 const note=useMemo(()=>notes.find(n=>n.id===id)||notes[0], [notes,id]);
 const paragraphs=(note?.body||'').split(/\n\n+/).filter(Boolean);
 function speak(){if(!note||typeof window==='undefined'||!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(`${note.title}. ${note.body}`);u.rate=0.95;u.onstart=()=>{setSpeaking(true);setPaused(false)};u.onend=()=>{setSpeaking(false);setPaused(false)};u.onerror=()=>{setSpeaking(false);setPaused(false)};window.speechSynthesis.speak(u)}
 function pause(){if(typeof window==='undefined')return;if(window.speechSynthesis.paused){window.speechSynthesis.resume();setPaused(false)}else{window.speechSynthesis.pause();setPaused(true)}}
 function stop(){if(typeof window!=='undefined')window.speechSynthesis.cancel();setSpeaking(false);setPaused(false)}
 useEffect(()=>()=>{if(typeof window!=='undefined')window.speechSynthesis?.cancel()},[]);
 if(!note)return <main className="read-shell"><div className="read-empty"><h1>No notes found</h1><p>Open the main Notes app first so your local notes are available.</p><a href="/notes">Back to Notes</a></div></main>;
 return <main className="read-shell"><header className="read-top"><a href="/notes" className="back">← Notes</a><label>Note<select value={note.id} onChange={e=>{stop();setId(e.target.value)}}>{notes.map(n=><option key={n.id} value={n.id}>{n.title}</option>)}</select></label><div className="controls"><button className="primary" onClick={speak}>▶ {speaking?'Restart':'Speak'}</button>{speaking&&<button onClick={pause}>{paused?'Resume':'Pause'}</button>}<button onClick={stop} disabled={!speaking}>Stop</button></div></header><article className="reader"><div className="kicker">READ MODE</div><h1>{note.title}</h1><div className="meta">{note.folder} · {note.tags?.join(' · ')}</div><div className="content">{paragraphs.map((p,i)=><p key={i}>{p}</p>)}</div></article></main>;
}
