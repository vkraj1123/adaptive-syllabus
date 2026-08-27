const DAY = 86400000;
export function performanceKey(examId,nodeId){return `${examId}::${nodeId}`;}
export function updatePerformance(prev,question,result,now=Date.now()){
 if(!question?.exam||!question?.nodeId)return prev;
 const correct=result?.correct===true||result===true, elapsedMs=Number(result?.elapsedMs??0), key=performanceKey(question.exam,question.nodeId);
 const old=prev[key]||{exam:question.exam,nodeId:question.nodeId,correct:0,total:0,wrong:0,skipped:0,timeMs:0,attempts:0,lastAttempt:null,streak:0,recent:[]};
 const next={...prev}, recent=[...(old.recent||[]),{ts:now,correct,elapsedMs}].slice(-30);
 next[key]={...old,exam:question.exam,nodeId:question.nodeId,correct:old.correct+(correct?1:0),total:old.total+1,wrong:old.wrong+(correct?0:1),skipped:old.skipped+(result?.skipped?1:0),timeMs:old.timeMs+Math.max(0,elapsedMs),attempts:old.attempts+1,lastAttempt:now,streak:correct?old.streak+1:0,recent};
 return next;
}
export function accuracy(stat){return stat?.total?stat.correct/stat.total:null;}
export function avgTimeMs(stat){return stat?.attempts?stat.timeMs/stat.attempts:null;}
export function recentAccuracy(stat,n=10){const a=(stat?.recent||[]).slice(-n);return a.length?a.filter(x=>x.correct).length/a.length:null;}
export function weaknessScore(stat,now=Date.now()){
 if(!stat?.total)return null; const acc=accuracy(stat),recent=recentAccuracy(stat),days=stat.lastAttempt?Math.max(0,(now-stat.lastAttempt)/DAY):30;
 const recency=Math.min(days/30,1),exposure=Math.min(stat.total/20,1),recentPenalty=recent==null?0:1-recent;
 return Math.round(((1-acc)*.45+recentPenalty*.25+recency*.15+(1-exposure)*.15)*100);
}
export function speedScore(stat,expectedMs=60000){const t=avgTimeMs(stat);if(t==null)return null;return Math.max(0,Math.min(100,Math.round((1-Math.max(0,t/expectedMs-1))*100)));}
export function priority(stat,weight=1,now=Date.now()){const w=weaknessScore(stat,now);return w==null?null:Math.round(w*weight);}
export function weakKeys(performance,threshold=50){return Object.entries(performance||{}).filter(([,s])=>weaknessScore(s)>=threshold).sort((a,b)=>weaknessScore(b[1])-weaknessScore(a[1])).map(([k])=>k);}
export function summarizePerformance(performance={},examId){const stats=Object.values(performance).filter(s=>!examId||s.exam===examId),attempted=stats.reduce((n,s)=>n+s.total,0),correct=stats.reduce((n,s)=>n+s.correct,0),time=stats.reduce((n,s)=>n+s.timeMs,0);return{nodes:stats.length,attempted,correct,accuracy:attempted?correct/attempted:null,avgTimeMs:attempted?time/attempted:null,weak:stats.filter(s=>weaknessScore(s)>=50).length};}
