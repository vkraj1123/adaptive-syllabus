import {NEET_SYLLABUS,NEET_SYLLABUS_VERSION} from "./neetSyllabus";

const norm=s=>String(s||"").toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9]+/g," ").trim().replace(/\s+/g," ");
const currentTopics=NEET_SYLLABUS.filter(n=>n.level==="topic");
const currentConcepts=NEET_SYLLABUS.filter(n=>n.level==="concept");

// Legacy topic IDs used by the pre-NEET-2026 structure. Historical questions/tests
// keep their original records; this map only provides a canonical analytical view.
const legacyTopics={
 "neet.ug.physics.units":"neet.ug.physics.unit_01",
 "neet.ug.physics.kinematics":"neet.ug.physics.unit_02",
 "neet.ug.physics.laws":"neet.ug.physics.unit_03",
 "neet.ug.physics.work_energy":"neet.ug.physics.unit_04",
 "neet.ug.physics.rotation":"neet.ug.physics.unit_05",
 "neet.ug.physics.gravitation":"neet.ug.physics.unit_06",
 "neet.ug.physics.properties":"neet.ug.physics.unit_07",
 "neet.ug.physics.thermo":"neet.ug.physics.unit_08",
 "neet.ug.physics.oscillations":"neet.ug.physics.unit_10",
 "neet.ug.physics.electrostatics":"neet.ug.physics.unit_11",
 "neet.ug.physics.current":"neet.ug.physics.unit_12",
 "neet.ug.physics.magnetism":"neet.ug.physics.unit_13",
 "neet.ug.physics.emi":"neet.ug.physics.unit_14",
 "neet.ug.physics.em_waves":"neet.ug.physics.unit_15",
 "neet.ug.physics.optics":"neet.ug.physics.unit_16",
 "neet.ug.physics.modern":"neet.ug.physics.unit_17"
};

export function canonicalNeetNodeId(item={}){
 if(String(item.exam||"").toLowerCase()!=="neet")return item.nodeId||"";
 const id=String(item.nodeId||"").trim();
 if(id&&NEET_SYLLABUS.some(n=>n.nodeId===id))return id;
 if(legacyTopics[id])return legacyTopics[id];
 const legacyTopic=legacyTopics[id.split(".").slice(0,5).join(".")];
 if(legacyTopic)return legacyTopic;
 const subject=norm(item.subject),topic=norm(item.topic),concept=norm(item.concept),subtopic=norm(item.subtopic);
 const candidates=currentConcepts.filter(n=>{
   const t=currentTopics.find(x=>x.nodeId===n.parentId);
   const s=t?currentTopics.find(x=>x.nodeId===t.parentId):null;
   const subjectOk=!subject||norm(s?.title).includes(subject)||subject.includes(norm(s?.title||""));
   const topicOk=!topic||norm(t?.title).includes(topic)||topic.includes(norm(t?.title||""));
   return subjectOk&&topicOk;
 });
 const fields=[concept,subtopic,topic].filter(x=>x.length>3);
 const exact=candidates.find(n=>fields.some(f=>norm(n.title).startsWith(f)||f===norm(n.title)));
 if(exact)return exact.nodeId;
 const fuzzy=candidates.find(n=>fields.some(f=>{const a=norm(n.title);return a.includes(f)||f.includes(a);}));
 return fuzzy?.nodeId||id;
}

export function migrateNeetQuestion(item={}){
 const canonical=canonicalNeetNodeId(item);
 return String(item.exam||"").toLowerCase()==="neet"?{...item,nodeId:canonical,syllabusVersion:item.syllabusVersion||NEET_SYLLABUS_VERSION}:item;
}
