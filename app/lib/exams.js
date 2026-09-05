// Multi-exam registry. Exams are data, not code: add a profile without changing the adaptive engine.
export const EXAM_PROFILES = {
  ras: { id:"ras", name:"Rajasthan Administrative Service (RAS)", shortName:"RAS", defaultLanguage:"en", stages:["Prelims","Mains"], scoring:{negativeMarking:true}, syllabusMode:"concept" },
  upsc: { id:"upsc", name:"UPSC Civil Services Examination", shortName:"UPSC CSE", defaultLanguage:"en", stages:["Prelims","Mains"], scoring:{negativeMarking:true}, syllabusMode:"concept" },
  ssc_cgl: { id:"ssc_cgl", name:"SSC Combined Graduate Level", shortName:"SSC CGL", defaultLanguage:"en", stages:["Tier I","Tier II"], scoring:{negativeMarking:true}, syllabusMode:"concept" },
  banking: { id:"banking", name:"Banking / IBPS-SBI", shortName:"Banking", defaultLanguage:"en", stages:["Prelims","Mains"], scoring:{negativeMarking:true}, syllabusMode:"concept" },
  police: { id:"police", name:"State Police / SI", shortName:"Police SI", defaultLanguage:"en", stages:["Written","Interview"], scoring:{negativeMarking:true}, syllabusMode:"concept" },
  neet: { id:"neet", name:"National Eligibility cum Entrance Test (UG)", shortName:"NEET UG", defaultLanguage:"bilingual", languages:["en","hi"], stages:["UG"], scoring:{negativeMarking:true}, syllabusMode:"concept" },
  custom: { id:"custom", name:"Custom Examination", shortName:"Custom", defaultLanguage:"en", stages:["Exam"], scoring:{negativeMarking:false}, syllabusMode:"concept" }
};

export const DEFAULT_EXAM = "ras";
export const examProfile = id => EXAM_PROFILES[id] || EXAM_PROFILES.custom;

// A syllabus is imported separately for each exam and can go as deep as concept level.
// nodeId must be stable across imports, e.g. polity.federalism.centre_state.finance_commission.
export function normalizeSyllabusNode(raw, parent = null, index = 0) {
  const x = raw || {};
  const title = String(x.title || x.name || "").trim();
  const nodeId = String(x.node_id || x.nodeId || (parent ? `${parent}.${index+1}` : `node-${index+1}`)).trim();
  const level = String(x.level || (x.concept ? "concept" : parent ? "topic" : "subject")).toLowerCase();
  return {
    nodeId, title, level, parentId: parent || "", weight: Number(x.weight ?? 1),
    description: String(x.description || "").trim(),
    concepts: Array.isArray(x.concepts) ? x.concepts.map(String) : [],
    children: Array.isArray(x.children) ? x.children.map((c,i) => normalizeSyllabusNode(c,nodeId,i)) : []
  };
}

export function flattenSyllabus(nodes = [], out = []) {
  nodes.forEach(n => { out.push(n); flattenSyllabus(n.children || [], out); });
  return out;
}

export function syllabusMap(nodes = []) {
  return new Map(flattenSyllabus(nodes).map(n => [n.nodeId,n]));
}
