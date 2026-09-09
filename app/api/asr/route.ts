import { NextRequest, NextResponse } from "next/server";
import { sarvamASR } from "@/lib/sarvam";

export async function POST(req: NextRequest) {
  try {
    const { audioBase64, mimeType } = await req.json();
    if (!audioBase64) return NextResponse.json({ error: "Missing audio." }, { status: 400 });

    const transcript = await sarvamASR(audioBase64, mimeType || "audio/wav");
    return NextResponse.json({ transcript });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
