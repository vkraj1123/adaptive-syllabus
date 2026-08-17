import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { apiKey, provider = "openai", model = "gpt-5-mini", baseUrl = "https://api.openai.com/v1", prompt } = await request.json();
    if (!apiKey) return NextResponse.json({ error: "Configure an AI API key in Settings first." }, { status: 400 });
    if (!prompt) return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    const endpoint = provider === "openai" ? "https://api.openai.com/v1/responses" : `${baseUrl.replace(/\/$/, "")}/chat/completions`;
    const body = provider === "openai"
      ? { model, input: prompt, temperature: 0.1 }
      : { model, messages: [{ role: "user", content: prompt }], temperature: 0.1 };
    const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(body) });
    const data = await r.json();
    if (!r.ok) return NextResponse.json({ error: data?.error?.message || `AI request failed (${r.status})` }, { status: r.status });
    const output = provider === "openai" ? data.output_text : data?.choices?.[0]?.message?.content;
    return NextResponse.json({ output: output || "" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
