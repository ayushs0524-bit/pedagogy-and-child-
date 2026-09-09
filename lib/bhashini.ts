// Server-only Bhashini (ULCA) client. Reads BHASHINI_USER_ID and
// BHASHINI_API_KEY from process.env — never import this in a client
// component.
//
// Same two-step ULCA pattern as the Python version in the Streamlit repo:
//  1. ask the pipeline-config endpoint which service + callback URL to use
//  2. call that callback URL to actually translate / synthesize speech
//
// If Bhashini changes its Santali model IDs, this is the file to update —
// check your Bhashini dashboard for the current pipeline config.

const PIPELINE_CONFIG_URL =
  "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline";

function keys() {
  const userId = process.env.BHASHINI_USER_ID;
  const apiKey = process.env.BHASHINI_API_KEY;
  if (!userId || !apiKey) return null;
  return { userId, apiKey };
}

export function bhashiniConfigured() {
  return keys() !== null;
}

async function getPipeline(taskType: "translation" | "tts", sourceLang: string, targetLang?: string) {
  const k = keys();
  if (!k) throw new Error("Bhashini keys are not configured.");

  const language: Record<string, string> = { sourceLanguage: sourceLang };
  if (targetLang) language.targetLanguage = targetLang;

  const res = await fetch(PIPELINE_CONFIG_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userID: k.userId,
      ulcaApiKey: k.apiKey,
    },
    body: JSON.stringify({
      pipelineTasks: [{ taskType, config: { language } }],
      pipelineRequestConfig: { pipelineId: "64392f96daac500b55c543cd" },
    }),
  });

  if (!res.ok) throw new Error(`Bhashini pipeline lookup failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function bhashiniTranslate(text: string) {
  const pipeline = await getPipeline("translation", "hi", "sat");
  const endpoint = pipeline.pipelineInferenceAPIEndPoint;
  const serviceId = pipeline.pipelineResponseConfig[0].config[0].serviceId;

  const res = await fetch(endpoint.callbackUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: endpoint.inferenceApiKey.value,
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: "translation",
          config: { language: { sourceLanguage: "hi", targetLanguage: "sat" }, serviceId },
        },
      ],
      inputData: { input: [{ source: text }] },
    }),
  });

  if (!res.ok) throw new Error(`Bhashini translate failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return (data.pipelineResponse[0].output[0].target as string).trim();
}

export async function bhashiniSantaliTTS(text: string) {
  const pipeline = await getPipeline("tts", "sat");
  const endpoint = pipeline.pipelineInferenceAPIEndPoint;
  const serviceId = pipeline.pipelineResponseConfig[0].config[0].serviceId;

  const res = await fetch(endpoint.callbackUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: endpoint.inferenceApiKey.value,
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: "tts",
          config: { language: { sourceLanguage: "sat" }, serviceId, gender: "female" },
        },
      ],
      inputData: { input: [{ source: text }] },
    }),
  });

  if (!res.ok) throw new Error(`Bhashini TTS failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.pipelineResponse[0].audio[0].audioContent as string; // base64
}
