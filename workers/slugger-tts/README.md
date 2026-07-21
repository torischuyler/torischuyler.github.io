# Slugger TTS proxy (Cloudflare Worker)

Safe proxy for xAI text-to-speech. The API key stays in a Cloudflare secret — never in the browser or git.

## One-time setup

1. Create a free [Cloudflare account](https://dash.cloudflare.com/sign-up).
2. From this folder, log in and deploy:

```bash
cd workers/slugger-tts
npx wrangler@latest login
npx wrangler@latest secret put XAI_API_KEY
npx wrangler@latest deploy
```

3. Copy the printed `*.workers.dev` URL.
4. Paste it into:
   - `js/slugger-speaks.js` → `TTS_ENDPOINT`
   - `til/pidog/tricks/speak.html` → CSP `connect-src`

## Local test (optional)

```bash
npx wrangler@latest dev
```

Then temporarily point `TTS_ENDPOINT` at `http://127.0.0.1:8787`.
