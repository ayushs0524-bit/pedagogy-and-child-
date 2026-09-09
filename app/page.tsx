"use client";

import { useRef, useState } from "react";

type Result = {
  explanation: string;
  santali: string;
  engine: string;
};

export default function Home() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [engine, setEngine] = useState<"sarvam" | "bhashini">("sarvam");
  const [recording, setRecording] = useState(false);
  const [hindiAudio, setHindiAudio] = useState<string | null>(null);
  const [santaliAudio, setSantaliAudio] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function handleAsk() {
    if (!question.trim()) return;
    setError(null);
    setResult(null);
    setHindiAudio(null);
    setSantaliAudio(null);

    try {
      setLoading("Working out the explanation...");
      const explainRes = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const explainData = await explainRes.json();
      if (!explainRes.ok) throw new Error(explainData.error);

      setLoading("Translating into Santali...");
      const translateRes = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: explainData.explanation, engine }),
      });
      const translateData = await translateRes.json();
      if (!translateRes.ok) throw new Error(translateData.error);

      setResult({
        explanation: explainData.explanation,
        santali: translateData.santali,
        engine: translateData.engine,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(null);
    }
  }

  async function playHindi() {
    if (!result) return;
    try {
      setLoading("Generating Hindi voice...");
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: result.explanation }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHindiAudio(`data:audio/wav;base64,${data.audioBase64}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  }

  async function playSantali() {
    if (!result) return;
    try {
      setLoading("Generating Santali voice via Bhashini...");
      const res = await fetch("/api/tts-santali", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: result.santali }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSantaliAudio(`data:audio/wav;base64,${data.audioBase64}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  }

  async function startRecording() {
    setError(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1];
        try {
          setLoading("Converting your voice to Hindi text...");
          const res = await fetch("/api/asr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audioBase64: base64, mimeType: "audio/webm" }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setQuestion(data.transcript);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(null);
        }
      };
      reader.readAsDataURL(blob);
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  return (
    <main className="flex justify-center py-10 px-4">
      <div className="w-full max-w-[420px] bg-slate rounded-[34px] p-3 shadow-2xl">
        <div className="bg-paper rounded-[22px] overflow-hidden flex flex-col min-h-[640px]">
          {/* Header */}
          <div className="px-5 pt-4 pb-4 flex items-center justify-between border-b border-line">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-slate flex items-center justify-center">
                <span className="font-devanagari text-marigold font-bold">अ</span>
              </div>
              <div>
                <div className="font-display font-semibold text-[15px] text-slate">Sahayak</div>
                <div className="text-[11px] text-inksoft">Ask in your language</div>
              </div>
            </div>
            <div className="text-[11px] font-display text-inksoft">Class 3 · Maths</div>
          </div>

          <div className="p-5 flex flex-col gap-4 flex-1">
            {/* Question input */}
            <div>
              <div className="text-[11px] font-display text-inksoft mb-1.5">
                Ask in Hindi — type or speak
              </div>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="जैसे: 25 और 17 को जोड़ने पर कितना होगा?"
                rows={3}
                className="w-full font-devanagari text-[15px] rounded-2xl border border-line p-3 bg-white focus:outline-none focus:ring-2 focus:ring-slatelight"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={recording ? stopRecording : startRecording}
                  className={`flex-1 rounded-pill py-2 font-display text-[13px] font-semibold flex items-center justify-center gap-2 ${
                    recording ? "bg-marigolddark text-white" : "bg-slate text-white"
                  }`}
                >
                  {recording && <span className="w-2.5 h-2.5 rounded-full bg-marigold mic-ring" />}
                  {recording ? "Stop recording" : "🎤 Speak"}
                </button>
                <button
                  onClick={handleAsk}
                  disabled={!!loading}
                  className="flex-1 rounded-pill py-2 font-display text-[13px] font-semibold bg-marigold text-slate disabled:opacity-50"
                >
                  Ask Sahayak
                </button>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-[11px] text-inksoft font-display">Translation engine:</span>
                {(["sarvam", "bhashini"] as const).map((e) => (
                  <button
                    key={e}
                    onClick={() => setEngine(e)}
                    className={`px-3 py-1 rounded-pill text-[11px] font-display border ${
                      engine === e ? "bg-slate text-white border-slate" : "border-line text-inksoft bg-white"
                    }`}
                  >
                    {e === "sarvam" ? "Sarvam" : "Bhashini"}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div className="text-[13px] text-inksoft font-display animate-pulse">{loading}</div>
            )}

            {error && (
              <div className="rounded-2xl border border-marigolddark bg-[#FBEFE0] text-[13px] p-3 text-marigolddark">
                {error}
              </div>
            )}

            {result && (
              <>
                <div className="bg-white border border-line rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-inksoft font-display mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-marigold" />
                    Step-by-step explanation (Hindi)
                  </div>
                  <div className="font-devanagari text-[14px] leading-relaxed whitespace-pre-line">
                    {result.explanation}
                  </div>
                  <button
                    onClick={playHindi}
                    className="mt-3 text-[12px] font-display text-slate underline underline-offset-2"
                  >
                    🔊 Listen in Hindi
                  </button>
                  {hindiAudio && <audio className="mt-2 w-full" controls src={hindiAudio} />}
                </div>

                <div className="bg-[#F4EFDF] border border-[#E6DCC2] rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-inksoft font-display mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-marigold" />
                    Santali translation ({result.engine})
                  </div>
                  <div className="font-devanagari text-[14px] leading-relaxed whitespace-pre-line">
                    {result.santali}
                  </div>
                  <button
                    onClick={playSantali}
                    className="mt-3 text-[12px] font-display text-slate underline underline-offset-2"
                  >
                    🔊 Listen in Santali (Bhashini)
                  </button>
                  {santaliAudio && <audio className="mt-2 w-full" controls src={santaliAudio} />}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
