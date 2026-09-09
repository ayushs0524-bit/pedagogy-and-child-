import { NextRequest, NextResponse } from "next/server";
import { sarvamTranslate } from "@/lib/sarvam";
import { bhashiniConfigured, bhashiniTranslate } from "@/lib/bhashini";

export async function POST(req: NextRequest) {
  try {
    const { text, engine } = await req.json();
    if (!text) return NextResponse.json({ error: "Missing text." }, { status: 400 });

    if (engine === "bhashini") {
      if (!bhashiniConfigured()) {
        return NextResponse.json({ error: "Bhashini keys are not configured." }, { status: 400 });
      }
      const santali = await bhashiniTranslate(text);
      return NextResponse.json({ santali, engine: "bhashini" });
    }

    // default: Sarvam
    const santali = await sarvamTranslate(text, "hi-IN", "sat-IN");
    return NextResponse.json({ santali, engine: "sarvam" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
