import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { provider, apiKey, model, baseUrl } = await request.json();
    if (!apiKey || typeof apiKey !== "string") return NextResponse.json({ error: "API key is required." }, { status: 400 });
    const allowed = ["openai", "compatible"];
    if (!allowed.includes(provider)) return NextResponse.json({ error: "Unsupported provider." }, { status: 400 });
    // API keys are accepted for this browser session only and are never written to GitHub.
    return NextResponse.json({ ok: true, provider, model: model || "gpt-5-mini", baseUrl: baseUrl || (provider === "openai" ? "https://api.openai.com/v1" : "") });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
