// Multi-user-ready data model. The browser prototype can use this shape now;
// a database/auth adapter can persist the same records later without changing the learning engine.
export const USER_VERSION=1;
export function createUserProfile(input={}){return{version:USER_VERSION,userId:String(input.userId||crypto.randomUUID()),name:String(input.name||"Learner"),email:String(input.email||""),createdAt:input.createdAt||new Date().toISOString(),activeExamId:String(input.activeExamId||"ras_prelims"),examIds:Array.isArray(input.examIds)?input.examIds:["ras_prelims"],preferences:{language:input.preferences?.language||"en",dailyTarget:Number(input.preferences?.dailyTarget||30)},performance:{},questionAttempts:[],relearning:{},};}
export function recordAttempt(profile,question,result,now=Date.now()){
 const next={...profile,performance:{...(profile.performance||{})},questionAttempts:[...(profile.questionAttempts||[])],relearning:{...(profile.relearning||{})}};
 const event={id:crypto.randomUUID(),userId:profile.userId,examId:question.exam,nodeId:question.nodeId,questionId:question.id,correct:!!result.correct,elapsedMs:Math.max(0,Number(result.elapsedMs||0)),skipped:!!result.skipped,selectedOption:result.selectedOption??null,timestamp:now};
 next.questionAttempts.push(event);
 return next;
}
export function switchExam(profile,examId){return{...profile,activeExamId:examId,examIds:Array.from(new Set([...(profile.examIds||[]),examId]))};}
export function userStorageKey(userId){return `adaptive-syllabus:user:${userId}`;}
export function exportUserData(profile){return JSON.stringify(profile,null,2);}
