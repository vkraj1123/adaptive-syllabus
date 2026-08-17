import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { questions = [], action = "save" } = await request.json();
    if (action === "save") return NextResponse.json({ ok: true, count: questions.length });
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
