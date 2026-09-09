import { NextRequest, NextResponse } from "next/server";
import { bhashiniConfigured, bhashiniSantaliTTS } from "@/lib/bhashini";

export async function POST(req: NextRequest) {
  try {
    if (!bhashiniConfigured()) {
      return NextResponse.json({ error: "Bhashini keys are not configured." }, { status: 400 });
    }
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "Missing text." }, { status: 400 });

    const audioBase64 = await bhashiniSantaliTTS(text);
    return NextResponse.json({ audioBase64, mime: "audio/wav" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
