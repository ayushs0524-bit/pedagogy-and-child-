// Server-only Sarvam AI client. Never import this from a client component —
// it reads process.env.SARVAM_API_KEY, which must stay server-side.

const SARVAM_BASE = "https://api.sarvam.ai";

function key() {
  const k = process.env.SARVAM_API_KEY;
  if (!k) throw new Error("SARVAM_API_KEY is not set.");
  return k;
}

export async function sarvamChat(systemPrompt: string, userPrompt: string, maxTokens = 600) {
  const res = await fetch(`${SARVAM_BASE}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": key(),
    },
    body: JSON.stringify({
      model: "sarvam-105b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) throw new Error(`Sarvam chat failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return (data.choices?.[0]?.message?.content ?? "").trim();
}

export async function sarvamTranslate(text: string, source: string, target: string) {
  const res = await fetch(`${SARVAM_BASE}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": key(),
    },
    body: JSON.stringify({
      input: text,
      source_language_code: source,
      target_language_code: target,
      model: "sarvam-translate:v1",
    }),
  });

  if (!res.ok) throw new Error(`Sarvam translate failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return (data.translated_text ?? "").trim();
}

export async function sarvamTTS(text: string, languageCode = "hi-IN") {
  const res = await fetch(`${SARVAM_BASE}/text-to-speech`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": key(),
    },
    body: JSON.stringify({
      inputs: [text],
      target_language_code: languageCode,
      model: "bulbul:v3",
      speaker: "meera",
      output_audio_codec: "wav",
    }),
  });

  if (!res.ok) throw new Error(`Sarvam TTS failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const b64 = data.audios?.[0];
  if (!b64) throw new Error("Sarvam TTS returned no audio.");
  return b64; // base64 string, returned straight to the client as a data URL
}

export async function sarvamASR(audioBase64: string, mimeType: string) {
  // Sarvam's speech-to-text endpoint expects multipart/form-data with a
  // real audio file, not a JSON body. Converts the incoming base64 audio
  // into a Blob before sending.
  const bytes = Buffer.from(audioBase64, "base64");
  const form = new FormData();
  form.append("model", "saaras:v3");
  form.append("language_code", "hi-IN");
  form.append("file", new Blob([bytes], { type: mimeType }), "question.wav");

  const res = await fetch(`${SARVAM_BASE}/speech-to-text`, {
    method: "POST",
    headers: { "api-subscription-key": key() },
    body: form,
  });

  if (!res.ok) throw new Error(`Sarvam ASR failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return (data.transcript ?? "").trim();
}
