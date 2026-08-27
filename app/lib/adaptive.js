const DAY=86400000;
export function performanceKey(examId,nodeId){return `${examId}::${nodeId}`;}
export function updatePerformance(prev,question,result,now=Date.now()){
 if(!question?.exam||!question?.nodeId)return prev;
 const correct=result?.correct===true||result===true,elapsedMs=Math.max(0,Number(result?.elapsedMs??0)),key=performanceKey(question.exam,question.nodeId);
 const old=prev[key]||{exam:question.exam,nodeId:question.nodeId,correct:0,total:0,wrong:0,skipped:0,timeMs:0,attempts:0,lastAttempt:null,streak:0,recent:[]};
 const next={...prev},recent=[...(old.recent||[]),{ts:now,correct,elapsedMs}].slice(-50);
 next[key]={...old,correct:old.correct+(correct?1:0),total:old.total+1,wrong:old.wrong+(correct?0:1),skipped:old.skipped+(result?.skipped?1:0),timeMs:old.timeMs+elapsedMs,attempts:old.attempts+1,lastAttempt:now,streak:correct?old.streak+1:0,recent};
 return next;
}
export function accuracy(s){return s?.total?s.correct/s.total:null;}
export function avgTimeMs(s){return s?.attempts?s.timeMs/s.attempts:null;}
export function recentAccuracy(s,n=10){const a=(s?.recent||[]).slice(-n);return a.length?a.filter(x=>x.correct).length/a.length:null;}
export function retentionScore(s){if(!s?.total)return null;const a=recentAccuracy(s,10);return a==null?null:Math.round(a*100);}
export function speedScore(s,expectedMs=60000){const t=avgTimeMs(s);if(t==null||!expectedMs)return null;return Math.max(0,Math.min(100,Math.round((expectedMs/t)*100)));}
export function knowledgeScore(s){if(!s?.total)return null;const a=accuracy(s);return Math.round(a*100);}
export function weaknessScore(s,now=Date.now()){
 if(!s?.total)return null;
 const a=accuracy(s),r=recentAccuracy(s),days=s.lastAttempt?Math.max(0,(now-s.lastAttempt)/DAY):30;
 const recency=Math.min(days/30,1),recentPenalty=r==null?0:1-r,exposure=Math.min(s.total/20,1);
 return Math.round(((1-a)*.4+recentPenalty*.3+recency*.15+(1-exposure)*.15)*100);
}
export function priority(s,weight=1,now=Date.now()){const w=weaknessScore(s,now);return w==null?null:Math.round(w*weight);}
export function weakKeys(performance,threshold=50){return Object.entries(performance||{}).filter(([,s])=>weaknessScore(s)>=threshold).sort((a,b)=>weaknessScore(b[1])-weaknessScore(a[1])).map(([k])=>k);}
export function classify(stat,expectedMs=60000){if(!stat?.total)return 'unattempted';const w=weaknessScore(stat),a=accuracy(stat),speed=speedScore(stat,expectedMs);if(w>=70)return 'critical';if(w>=50)return 'weak';if(a>=.8&&speed!=null&&speed<70)return 'slow';if(a>=.8)return 'strong';return 'developing';}
export function nodeAnalytics(stat,expectedMs=60000,now=Date.now()){return{accuracy:accuracy(stat),knowledge:knowledgeScore(stat),retention:retentionScore(stat),avgTimeMs:avgTimeMs(stat),speed:speedScore(stat,expectedMs),weakness:weaknessScore(stat,now),priority:priority(stat,1,now),classification:classify(stat,expectedMs)};}
export function summarizePerformance(performance={},examId){const stats=Object.values(performance).filter(s=>!examId||s.exam===examId),attempted=stats.reduce((n,s)=>n+s.total,0),correct=stats.reduce((n,s)=>n+s.correct,0),time=stats.reduce((n,s)=>n+s.timeMs,0),weak=stats.filter(s=>weaknessScore(s)>=50).length;return{nodes:stats.length,attempted,correct,accuracy:attempted?correct/attempted:null,avgTimeMs:attempted?time/attempted:null,weak};}
