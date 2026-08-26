export const IMPORT_FIELDS = [
  "question_id","exam","year","question","option_a","option_b","option_c","option_d","option_e","correct_option",
  "subject","topic","subtopic","explanation","key_fact","common_confusion","source","difficulty","question_type"
];

export const IMPORT_EXAMPLE = {
  question_id:"RAS-2024-001", exam:"RAS", year:2024,
  question:"Example question text", option_a:"A", option_b:"B", option_c:"C", option_d:"D", option_e:"",
  correct_option:"B", subject:"Rajasthan History & Culture", topic:"Freedom Struggle", subtopic:"Praja Mandal Movement",
  explanation:"Short explanation prepared before import.", key_fact:"One high-yield fact.", common_confusion:"Common trap or distinction.",
  source:"RPSC RAS 2024", difficulty:"moderate", question_type:"MCQ"
};

export function normalizeImportedQuestion(raw, index = 0) {
  const x = raw || {};
  const options = [x.option_a,x.option_b,x.option_c,x.option_d,x.option_e].filter(v => String(v ?? "").trim() !== "").map(v => String(v).trim());
  const answerRaw = String(x.correct_option ?? "").trim().toUpperCase();
  const answer = /^[A-E]$/.test(answerRaw) ? answerRaw.charCodeAt(0)-65 : /^\d$/.test(answerRaw) ? Number(answerRaw)-1 : null;
  return {
    id: String(x.question_id || `IMPORT-${Date.now()}-${index+1}`),
    exam: String(x.exam || "").trim(), year: x.year || "", text: String(x.question || x.text || "").trim(), options,
    answer: answer != null && answer >= 0 && answer < options.length ? answer : null,
    subject: String(x.subject || "").trim(), topic: String(x.topic || "").trim(), subtopic: String(x.subtopic || "").trim(),
    explanation: String(x.explanation || "").trim(), keyFact: String(x.key_fact || "").trim(), commonConfusion: String(x.common_confusion || "").trim(),
    source: String(x.source || "").trim(), difficulty: String(x.difficulty || "").trim().toLowerCase(), questionType: String(x.question_type || "MCQ").trim(),
    answerSource: answer != null ? "imported" : "none", importedAt: new Date().toISOString()
  };
}

export function validateImportedQuestion(q, validTagSet) {
  const errors = [];
  if (!q.text) errors.push("Missing question");
  if (q.options.length < 2) errors.push("At least 2 options required");
  if (q.answer == null) errors.push("Missing/invalid correct_option");
  if (!q.subject || !q.topic) errors.push("Missing subject/topic");
  const exact = q.subtopic ? `${q.subject}|${q.topic}|${q.subtopic}` : `${q.subject}|${q.topic}`;
  if (q.subject && q.topic && !validTagSet.has(exact)) errors.push("Tag is not in the master syllabus");
  return errors;
}
