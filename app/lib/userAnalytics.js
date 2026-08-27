import {accuracy,avgTimeMs,weaknessScore,speedScore} from "./adaptive";

export function recordQuestionEvent(prev,event){
 const id=event.userId||"local-user", list=Array.isArray(prev[id])?prev[id]:[];
 return {...prev,[id]:[...list,{id:`e-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,timestamp:Date.now(),...event}].slice(-10000)};
}
export function userSummary(events=[],examId){const e=events.filter(x=>!examId||x.exam===examId),answered=e.filter(x=>x.type==="question"),correct=answered.filter(x=>x.correct),times=answered.map(x=>Number(x.elapsedMs||0)).filter(x=>x>0);return{events:e.length,questions:answered.length,correct:correct.length,accuracy:answered.length?correct.length/answered.length:null,avgTimeMs:times.length?times.reduce((a,b)=>a+b,0)/times.length:null};}
export function conceptStats(events=[]){const map={};events.filter(x=>x.type==="question"&&x.nodeId).forEach(x=>{const k=x.nodeId,s=map[k]||{nodeId:k,total:0,correct:0,wrong:0,timeMs:0,lastAttempt:null};s.total++;s.correct+=x.correct?1:0;s.wrong+=x.correct?0:1;s.timeMs+=Number(x.elapsedMs||0);s.lastAttempt=Math.max(s.lastAttempt||0,x.timestamp||0);map[k]=s;});return Object.values(map).map(s=>({...s,accuracy:accuracy(s),avgTimeMs:avgTimeMs(s),weakness:weaknessScore(s),speed:speedScore(s)}));}
export function compareExams(events=[]){const ids=[...new Set(events.map(x=>x.exam).filter(Boolean))];return ids.map(exam=>({exam,...userSummary(events,exam)}));}
