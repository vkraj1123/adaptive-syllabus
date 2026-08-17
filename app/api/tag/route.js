import { NextResponse } from "next/server";

const syllabus = [
  "Indian Polity & Constitution", "Indian History & Culture", "Rajasthan History, Art & Culture",
  "Indian Geography", "Rajasthan Geography", "Indian Economy", "Rajasthan Economy",
  "Science & Technology", "Environment & Ecology", "Current Affairs", "Reasoning & Mental Ability",
  "Public Administration", "Ethics & Integrity", "International Relations", "Social Issues & Schemes"
];

function heuristicTag(text) {
  const t = text.toLowerCase();
  const rules = [
    [/constitution|article |fundamental right|parliament|supreme court|federal|panchayat|election commission/, "Indian Polity & Constitution"],
    [/rajasthan|marwar|mewar|jaipur|rajput|lok devta|fort|folk/, "Rajasthan History, Art & Culture"],
    [/monsoon|river|plateau|soil|mineral|climate|population|latitude|longitude/, "Indian Geography"],
    [/gdp|inflation|fiscal|monetary|budget|banking|gst|unemployment/, "Indian Economy"],
    [/atom|quantum|semiconductor|ai |artificial intelligence|biotech|satellite|space|5g|6g|telecom/, "Science & Technology"],
    [/biodiversity|pollution|climate change|wetland|forest|ecosystem|carbon|environment/, "Environment & Ecology"],
    [/un|nato|brics|g20|foreign policy|international|bilateral|geopolit/, "International Relations"],
    [/ethic|integrity|probity|attitude|empathy|civil service/, "Ethics & Integrity"],
    [/administration|governance|bureaucracy|district collector|public policy|accountability/, "Public Administration"],
    [/scheme|yojana|welfare|health|education|women|child|poverty|social justice/, "Social Issues & Schemes"]
  ];
  for (const [pattern, tag] of rules) if (pattern.test(t)) return tag;
  return "Current Affairs";
}

export async function POST(request) {
  try {
    const { questions = [] } = await request.json();
    const cleaned = questions.filter(Boolean).slice(0, 100);
    if (!cleaned.length) return NextResponse.json({ questions: [] });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ mode: "fallback", questions: cleaned.map((question, i) => ({
        id: i + 1, text: question, subject: heuristicTag(question),
        topic: "Rule-based suggestion", subtopic: "Review tag", confidence: 0.55
      })) });
    }

    const prompt = `You are a syllabus-tagging assistant for RPSC/RAS preparation. Tag each question to exactly one subject from this predefined syllabus:\n${syllabus.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nReturn ONLY valid JSON as an array. Each item must have id, text, subject, topic, subtopic, confidence (0-1). Preserve question text exactly.\nQuestions:\n${cleaned.map((q, i) => `${i + 1}. ${q}`).join("\n")}`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5-mini", input: prompt, temperature: 0.1 })
    });
    if (!response.ok) throw new Error(`AI request failed: ${response.status}`);
    const data = await response.json();
    const output = data.output_text || "[]";
    const parsed = JSON.parse(output.replace(/^```json\s*|```$/g, "").trim());
    return NextResponse.json({ mode: "ai", questions: parsed });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
