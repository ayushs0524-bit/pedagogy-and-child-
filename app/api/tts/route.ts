import { NextRequest, NextResponse } from "next/server";
import { sarvamTTS } from "@/lib/sarvam";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "Missing text." }, { status: 400 });

    const audioBase64 = await sarvamTTS(text, "hi-IN");
    return NextResponse.json({ audioBase64, mime: "audio/wav" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
