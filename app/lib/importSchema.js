export const IMPORT_FIELDS=["question_id","exam","stage","year","question","option_a","option_b","option_c","option_d","option_e","correct_option","node_id","subject","topic","subtopic","concept","explanation","explanation_short","explanation_long","key_fact","common_confusion","source","difficulty","question_type","expected_time_sec"];
export const SYLLABUS_FIELDS=["exam","node_id","parent_id","level","subject","topic","subtopic","concept","title","description","weight","children_json"];
export const IMPORT_EXAMPLE={question_id:"RAS-2024-001",exam:"ras",stage:"Prelims",year:2024,question:"Example question",options:{A:"A",B:"B",C:"C",D:"D"},correct_option:"B",node_id:"ras.prelims.polity.rights.writs",subject:"Indian Constitution & Governance",topic:"Fundamental Rights & Duties",subtopic:"Constitutional writs",concept:"Constitutional writs",explanation:{short:"B is correct.",detailed:"Detailed explanation of the constitutional principle and why the option is correct.",why_correct:"It directly matches the constitutional provision.",why_others_wrong:{A:"Not applicable.",C:"Not applicable.",D:"Not applicable."}},key_fact:"High-yield fact.",common_confusion:"Common trap.",source:"RPSC RAS 2024",difficulty:"moderate",question_type:"MCQ",expected_time_sec:60};
const EXAM_ALIASES={ras:"ras","rpsc ras":"ras","ras exam":"ras","upsc":"upsc","upsc cse":"upsc","upsc civil services":"upsc","ssc cgl":"ssc-cgl","ssc":"ssc-cgl","banking":"banking","bank":"banking","police si":"police-si","police":"police-si","custom":"custom"};
const clean=v=>typeof v==="string"?v.trim():v==null?"":String(v).trim();
const first=(...v)=>v.find(x=>clean(x)!=="")??"";
function normalizeOptions(x){
 const o=x.options||x.choices||x.answers||{};
 const arr=Array.isArray(o)?o:[o.A??o.a,o.B??o.b,o.C??o.c,o.D??o.d,o.E??o.e];
 const flat=[x.option_a,x.option_b,x.option_c,x.option_d,x.option_e];
 return [0,1,2,3,4].map(i=>clean(first(flat[i],arr[i])));
}
function parseCorrectOption(raw){
 if(raw&&typeof raw==="object"&&!Array.isArray(raw))return parseCorrectOption(first(raw.correct_option,raw.correctOption,raw.correct_answer,raw.correctAnswer,raw.answer,raw.option,raw.letter,raw.value,raw.index));
 if(typeof raw==="number"){if(raw>=0&&raw<=4)return raw;if(raw>=1&&raw<=5)return raw-1;return null;}
 const s=clean(raw);if(!s)return null;const u=s.toUpperCase();
 if(/^[A-E]$/.test(u))return u.charCodeAt(0)-65;
 const letter=u.match(/\b(?:OPTION|ANSWER|CHOICE)\s*[:#\-]?\s*([A-E])\b|^\(?([A-E])\)?\.?$/);if(letter){const l=letter[1]||letter[2];return l.charCodeAt(0)-65;}
 const named={FIRST:0,SECOND:1,THIRD:2,FOURTH:3,FIFTH:4};const word=u.match(/\b(FIRST|SECOND|THIRD|FOURTH|FIFTH)\b/);if(word)return named[word[1]];
 const ordinal=u.match(/\b([1-5])(?:ST|ND|RD|TH)?\s*(?:OPTION|CHOICE)?\b/);if(ordinal)return Number(ordinal[1])-1;
 if(/^\d+$/.test(u)){const n=Number(u);if(n>=1&&n<=5)return n-1;if(n>=0&&n<5)return n;}
 return null;
}
function explanationParts(x,e){
 const eo=e&&typeof e==="object"&&!Array.isArray(e)?e:{};const legacy=typeof e==="string"?e:typeof x.explanation==="string"?x.explanation:"";
 const short=clean(first(x.explanation_short,x.short_explanation,x.explanationShort,eo.short,eo.summary,eo.one_line,legacy));
 const long=clean(first(x.explanation_long,x.long_explanation,x.explanationLong,x.detailed_explanation,x.explanationDetailed,eo.detailed,eo.long,eo.explanation,eo.conceptual,legacy,short));
 const whyCorrect=clean(first(x.why_correct,x.whyCorrect,eo.why_correct,eo.whyCorrect));
 const whyOthersWrong=first(x.why_others_wrong,x.whyOthersWrong,eo.why_others_wrong,eo.whyOthersWrong,{});
 return {short,long,whyCorrect,whyOthersWrong};
}
export function normalizeImportedQuestion(raw,index=0){
 const x=raw||{},e=x.explanation||{},c=x.concept||{},s=x.source||{};const options=normalizeOptions(x);
 const rawAnswer=first(x.correct_option,x.correctOption,x.correct_answer,x.correctAnswer,x.answer,typeof x.correct==="string"?x.correct:"");const answer=parseCorrectOption(rawAnswer);
 const rawExam=clean(x.exam).toLowerCase();const exam=EXAM_ALIASES[rawExam]||rawExam||"custom";const nodeId=clean(first(x.node_id,x.nodeId,c.node_id,c.nodeId));
 const ep=explanationParts(x,e);const id=clean(x.question_id)||`IMPORT-${Date.now()}-${index+1}`;
 return {id,question_id:id,exam,stage:clean(x.stage),year:x.year||"",text:clean(first(x.question,x.text)),options,answer:answer!=null&&answer>=0&&answer<options.length&&options[answer]!==""?answer:null,correctOption:answer!=null&&answer>=0&&answer<options.length&&options[answer]!==""?String.fromCharCode(65+answer):"",nodeId,subject:clean(first(x.subject,c.subject)),topic:clean(first(x.topic,c.topic)),subtopic:clean(first(x.subtopic,c.subtopic)),concept:clean(first(x.concept,c.concept)),explanation:ep.short||ep.long,explanationShort:ep.short,explanationLong:ep.long,explanationDetailed:ep.long,whyCorrect:ep.whyCorrect,whyOthersWrong:ep.whyOthersWrong,keyFact:clean(first(x.key_fact,x.keyFact,e.key_fact,e.keyFact)),commonConfusion:clean(first(x.common_confusion,x.commonConfusion,e.common_confusion,e.commonConfusion,x.common_trap)),source:typeof s==="string"?s:clean(first(x.source,s.name,s.reference,s.source_reference)),difficulty:clean(x.difficulty).toLowerCase(),questionType:clean(first(x.question_type,x.questionType))||"MCQ",expectedTimeSec:Number(x.expected_time_sec||x.expectedTimeSec||60),tags:Array.isArray(x.tags)?x.tags.map(clean).filter(Boolean):clean(x.tags).split(/[;,|]/).map(clean).filter(Boolean),relatedConcepts:Array.isArray(x.related_concepts)?x.related_concepts.map(clean).filter(Boolean):[],revisionPoints:Array.isArray(x.revision_points)?x.revision_points.map(clean).filter(Boolean):[],cognitiveLevel:clean(x.cognitive_level||x.cognitiveLevel),importance:clean(x.importance),pyq:Boolean(x.pyq),answerConfidence:clean(x.answer_confidence||x.answerConfidence)||"unknown",verificationStatus:clean(x.verification_status||x.verificationStatus)||"unverified",commonTrap:clean(x.common_trap),importedAt:new Date().toISOString()};
}
export function validateImportedQuestion(q,validTagSet,validNodeSet){
 const errors=[];const opts=q.options||[];const last=opts.reduce((n,v,i)=>v?i:n,-1);const gap=opts.some((v,i)=>!v&&i<last);
 if(!q.text)errors.push("Missing question");if(opts.filter(Boolean).length<2)errors.push("At least 2 options required");if(gap)errors.push("Options contain a gap; check A-E positions before importing");
 if(q.answer==null)errors.push("Missing/invalid correct_option");else if(!opts[q.answer])errors.push("correct_option points to an empty option");if(!q.exam)errors.push("Missing exam");if(!q.nodeId)errors.push("Missing node_id");
 if(q.nodeId&&validNodeSet&&!validNodeSet.has(q.nodeId)&&q.exam!=="custom")errors.push("node_id is not in the predefined syllabus");if(q.nodeId&&q.exam!=="custom"&&!q.nodeId.startsWith(`${q.exam}.`))errors.push("node_id does not belong to selected exam");return errors;
}
export function normalizeSyllabusRow(raw,index=0){const x=raw||{};return{exam:String(x.exam||"custom").trim(),nodeId:String(x.node_id||x.nodeId||`node-${index+1}`).trim(),parentId:String(x.parent_id||x.parentId||"").trim(),level:String(x.level||"concept").trim().toLowerCase(),subject:String(x.subject||"").trim(),topic:String(x.topic||"").trim(),subtopic:String(x.subtopic||"").trim(),concept:String(x.concept||"").trim(),title:String(x.title||x.concept||x.subtopic||x.topic||x.subject||"").trim(),description:String(x.description||"").trim(),weight:Number(x.weight??1),childrenJson:String(x.children_json||"").trim()};}
