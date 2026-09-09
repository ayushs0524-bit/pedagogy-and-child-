import { NextRequest, NextResponse } from "next/server";
import { sarvamChat } from "@/lib/sarvam";

const SYSTEM_PROMPT = `You are an expert Class 3 primary-school mathematics teacher.
Explain mathematics to children in very simple Hindi.
Rules: use age-appropriate Hindi, explain the idea before the final answer,
show the calculation step by step, avoid advanced terminology, verify the
arithmetic, keep it concise.

Return exactly this structure:
समझते हैं:
<simple explanation>

हल:
<step-by-step calculation>

उत्तर:
<final answer>

सीखने का उद्देश्य:
<one short learning outcome>`;

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    if (!question) return NextResponse.json({ error: "Missing question." }, { status: 400 });

    const explanation = await sarvamChat(SYSTEM_PROMPT, `Student question:\n\n${question}`, 600);
    return NextResponse.json({ explanation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
