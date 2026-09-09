# Sahayak — Vernacular Maths Assistant (Next.js / Vercel edition)

Hindi → Santali Class 3 maths assistant, rebuilt as a Next.js app so it can
deploy natively on Vercel. This replaces the Streamlit prototype — same
Sarvam + Bhashini APIs underneath, but the UI runs in the browser and each
AI call is a serverless API route.

## Structure
- `app/page.tsx` — the UI (phone-style card, matching your mockup)
- `app/api/explain` — Sarvam LLM step-by-step Hindi explanation
- `app/api/translate` — Hindi → Santali, Sarvam or Bhashini (toggle in UI)
- `app/api/tts` — Hindi voice, via Sarvam Bulbul
- `app/api/tts-santali` — Santali voice, via Bhashini (Sarvam has no
  Santali voice yet)
- `app/api/asr` — voice question → Hindi text, via Sarvam
- `lib/sarvam.ts`, `lib/bhashini.ts` — server-only API clients; your keys
  never reach the browser

## Run locally
```bash
npm install
cp .env.example .env.local   # then fill in your real keys
npm run dev
```
Open http://localhost:3000

## Deploy
See `DEPLOYMENT.md` for the exact GitHub → Vercel steps.

## Notes
- This prototype does not yet include the worksheet PDF generator from
  the Streamlit version — say the word and I'll add a `/worksheet` route
  (client-side PDF via a library like `pdf-lib`, since Vercel serverless
  functions can't hold long-running Python/reportlab).
- The local Excel curriculum dataset and its retrieval logic weren't
  ported either — the Streamlit prototype's RAG-over-Excel step is
  Python-specific. If you want that here too, it would move into an API
  route reading a JSON/CSV copy of the dataset.
