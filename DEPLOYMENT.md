# Deploying to Vercel

## 1. Push the code to GitHub
```bash
cd sahayak-next
git init
git add .
git commit -m "Initial commit: Sahayak Next.js app"
git branch -M main
git remote add origin https://github.com/<your-username>/sahayak-next.git
git push -u origin main
```
(Create the empty repo on github.com first — same as before, don't
initialize it with a README.)

## 2. Import into Vercel
1. Go to vercel.com → sign in with GitHub.
2. Click **Add New → Project**.
3. Select your `sahayak-next` repo. Vercel auto-detects it's Next.js —
   leave the build settings as default (`npm run build`, output `.next`).
4. Before deploying, open **Environment Variables** and add:
   - `SARVAM_API_KEY`
   - `BHASHINI_USER_ID`
   - `BHASHINI_API_KEY`
   (paste the same values you were using in Streamlit secrets)
5. Click **Deploy**. You'll get a live URL like
   `https://sahayak-next.vercel.app` in about a minute.

## 3. Updating later
Every `git push` to `main` auto-redeploys on Vercel — no extra steps.

## 4. Things that behave differently from Streamlit
- Each AI call (`/api/explain`, `/api/translate`, etc.) is its own
  serverless function with a timeout (10s on Vercel's free Hobby plan,
  longer on Pro). If Sarvam's LLM call is slow, you may hit that limit —
  Pro plan raises it to 60s, or you can move slow calls to an Edge/
  background function later.
- Microphone recording uses the browser's `MediaRecorder` API
  (`audio/webm`), sent to Sarvam's speech-to-text — this needs HTTPS,
  which Vercel gives you by default, but won't work over plain `http://`
  on a custom domain without SSL.
- There's no server-side session cache like `st.session_state` had —
  add a database (e.g. Vercel KV or Postgres) later if you want to cache
  repeated translations across users.
