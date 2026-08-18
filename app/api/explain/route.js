import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

async function readResponse(r) {
  const text = await r.text();
  let d = null;
  try { d = JSON.parse(text); } catch {
    if (!r.ok) throw Error(text.slice(0, 500) || `AI request failed (${r.status})`);
    throw Error("AI returned a non-JSON response. Check the API Link and model endpoint in Settings.");
  }
  if (!r.ok) throw Error(d?.error?.message || d?.message || d?.error || `AI request failed (${r.status})`);
  return d;
}

function contentFromMessage(message) {
  const content = message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map(x => x?.text || x?.content || "").join("");
  return "";
}

export async function POST(request) {
  try {
    const { question, apiKey, model = "sarvam-105b", apiUrl = "" } = await request.json();
    if (!question) throw Error("No question provided");
    if (!apiKey) return NextResponse.json({ error: "Add your API key in Settings first." }, { status: 400 });
    if (!apiUrl?.trim()) throw Error("Add the AI API link in Settings.");

    const qText = question.text || "";
    const options = question.options || [];
    const answer = question.answer != null ? String.fromCharCode(65 + question.answer) : "Not specified";
    const prompt = `You are an expert teacher for RAS/UPSC exam preparation. Explain this MCQ in a clear, structured, educational format.\n\nQUESTION: ${qText}\n\nOPTIONS:\n${options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join("\n")}\n\nCORRECT ANSWER: ${answer}\n\nProvide: CORRECT ANSWER, WHY OTHER OPTIONS ARE WRONG, KEY CONCEPT, and REMEMBER. Keep it concise but thorough. Plain text only.`;

    const r = await fetch(apiUrl.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}`, "api-subscription-key": apiKey },
      body: JSON.stringify({ model, messages: [{ role: "system", content: "You are an expert RAS exam tutor. Explain MCQ answers clearly in plain text." }, { role: "user", content: prompt }], temperature: 0, max_tokens: 1024 })
    });
    const d = await readResponse(r);
    const c = contentFromMessage(d?.choices?.[0]?.message) || d?.output_text || "";
    return NextResponse.json({ explanation: c || "AI did not return an explanation." });
  } catch (e) {
    return NextResponse.json({ error: e?.name === "AbortError" ? "AI explanation timed out." : e.message }, { status: 500 });
  }
}
