export const IMPORT_FIELDS=["question_id","exam","stage","year","question","option_a","option_b","option_c","option_d","option_e","correct_option","node_id","subject","topic","subtopic","concept","explanation","key_fact","common_confusion","source","difficulty","question_type","expected_time_sec"];
export const SYLLABUS_FIELDS=["exam","node_id","parent_id","level","subject","topic","subtopic","concept","title","description","weight","children_json"];
export const IMPORT_EXAMPLE={question_id:"RAS-2024-001",exam:"ras",stage:"Prelims",year:2024,question:"Example question",option_a:"A",option_b:"B",option_c:"C",option_d:"D",option_e:"",correct_option:"B",node_id:"ras.prelims.polity.rights.writs",subject:"Indian Constitution & Governance",topic:"Fundamental Rights & Duties",subtopic:"Constitutional writs",concept:"Constitutional writs",explanation:"Prepared before import.",key_fact:"High-yield fact.",common_confusion:"Common trap.",source:"RPSC RAS 2024",difficulty:"moderate",question_type:"MCQ",expected_time_sec:60};
const EXAM_ALIASES={ras:"ras","rpsc ras":"ras","ras exam":"ras","upsc":"upsc","upsc cse":"upsc","upsc civil services":"upsc","ssc cgl":"ssc-cgl","ssc":"ssc-cgl","banking":"banking","bank":"banking","police si":"police-si","police":"police-si","custom":"custom"};
const clean=v=>String(v??"").trim();
const first=(...v)=>v.find(x=>clean(x)!=="")??"";
export function normalizeImportedQuestion(raw,index=0){
 const x=raw||{},o=x.options||{},e=x.explanation||{},c=x.concept||{},s=x.source||{};
 const optionValues=[first(x.option_a,o.A,o.a),first(x.option_b,o.B,o.b),first(x.option_c,o.C,o.c),first(x.option_d,o.D,o.d),first(x.option_e,o.E,o.e)].map(clean).filter(Boolean);
 const rawAnswer=first(x.correct_option,x.correctOption,x.answer); const a=clean(rawAnswer).toUpperCase();
 const answer=/^[A-E]$/.test(a)?a.charCodeAt(0)-65:/^\d+$/.test(a)?Number(a)-1:null;
 const rawExam=clean(x.exam).toLowerCase(); const exam=EXAM_ALIASES[rawExam]||rawExam||"custom";
 const nodeId=clean(first(x.node_id,x.nodeId,c.node_id,c.nodeId));
 const subject=clean(first(x.subject,c.subject)),topic=clean(first(x.topic,c.topic)),subtopic=clean(first(x.subtopic,c.subtopic)),concept=clean(first(x.concept,c.concept));
 const explanation=typeof e==="string"?e:clean(first(x.explanation,e.detailed,e.conceptual,e.short,e.one_line));
 const keyFact=clean(first(x.key_fact,x.keyFact,e.key_fact,e.keyFact));
 const commonConfusion=clean(first(x.common_confusion,x.commonConfusion,e.common_confusion,e.commonConfusion,x.common_trap));
 const source=typeof s==="string"?s:clean(first(x.source,s.name,s.reference,s.source_reference));
 const tags=Array.isArray(x.tags)?x.tags.map(clean).filter(Boolean):clean(x.tags).split(/[;,|]/).map(clean).filter(Boolean);
 const relatedConcepts=Array.isArray(x.related_concepts)?x.related_concepts.map(clean).filter(Boolean):[];
 const revisionPoints=Array.isArray(x.revision_points)?x.revision_points.map(clean).filter(Boolean):[];
 return {id:clean(x.question_id)||`IMPORT-${Date.now()}-${index+1}`,exam,stage:clean(x.stage),year:x.year||"",text:clean(first(x.question,x.text)),options:optionValues,answer:answer!=null&&answer>=0&&answer<optionValues.length?answer:null,nodeId,subject,topic,subtopic,concept,explanation,keyFact,commonConfusion,source,difficulty:clean(x.difficulty).toLowerCase(),questionType:clean(first(x.question_type,x.questionType))||"MCQ",expectedTimeSec:Number(x.expected_time_sec||x.expectedTimeSec||60),tags,relatedConcepts,revisionPoints,cognitiveLevel:clean(x.cognitive_level||x.cognitiveLevel),importance:clean(x.importance),pyq:Boolean(x.pyq),answerConfidence:clean(x.answer_confidence||x.answerConfidence)||"unknown",verificationStatus:clean(x.verification_status||x.verificationStatus)||"unverified",commonTrap:clean(x.common_trap),importedAt:new Date().toISOString()};
}
export function validateImportedQuestion(q,validTagSet,validNodeSet){
 const errors=[];
 if(!q.text)errors.push("Missing question");
 if(q.options.length<2)errors.push("At least 2 options required");
 if(q.answer==null)errors.push("Missing/invalid correct_option");
 if(!q.exam)errors.push("Missing exam");
 if(!q.nodeId)errors.push("Missing node_id");
 if(q.nodeId&&validNodeSet&&!validNodeSet.has(q.nodeId)&&q.exam!=="custom")errors.push("node_id is not in the active syllabus");
 if(q.subject&&q.topic&&validTagSet){const exact=q.subtopic?`${q.subject}|${q.topic}|${q.subtopic}`:`${q.subject}|${q.topic}`;if(validTagSet.size&&!validTagSet.has(exact))errors.push("Subject/topic does not match the active syllabus");}
 if(q.nodeId&&q.exam!=="custom"&&!q.nodeId.startsWith(`${q.exam}.`))errors.push("node_id does not belong to selected exam");
 return errors;
}
export function normalizeSyllabusRow(raw,index=0){const x=raw||{};return{exam:String(x.exam||"custom").trim(),nodeId:String(x.node_id||x.nodeId||`node-${index+1}`).trim(),parentId:String(x.parent_id||x.parentId||"").trim(),level:String(x.level||"concept").trim().toLowerCase(),subject:String(x.subject||"").trim(),topic:String(x.topic||"").trim(),subtopic:String(x.subtopic||"").trim(),concept:String(x.concept||"").trim(),title:String(x.title||x.concept||x.subtopic||x.topic||x.subject||"").trim(),description:String(x.description||"").trim(),weight:Number(x.weight??1),childrenJson:String(x.children_json||"").trim()};}
