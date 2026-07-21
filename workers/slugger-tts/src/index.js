/**
 * Slugger Speaks — Cloudflare Worker proxy for xAI TTS.
 * Keeps XAI_API_KEY server-side; returns MP3 audio to the Speak page.
 */

const MAX_CHARS = 140;
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const VOICE_ID = 'atlas';

const ALLOWED_ORIGINS = new Set([
  'https://torischuyler.github.io',
]);

/** @type {Map<string, { count: number, resetAt: number }>} */
const hits = new Map();

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;

  try {
    const url = new URL(origin);
    const localHosts = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);
    return url.protocol === 'http:' && localHosts.has(url.hostname);
  } catch {
    return false;
  }
}

function corsHeaders(origin) {
  if (!isAllowedOrigin(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...corsHeaders(origin),
    },
  });
}

function checkRateLimit(ip) {
  const now = Date.now();
  let entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_WINDOW_MS };
    hits.set(ip, entry);
  }
  entry.count += 1;
  return entry.count <= RATE_LIMIT;
}

export default {
  /**
   * @param {Request} request
   * @param {{ XAI_API_KEY?: string }} env
   */
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      if (!isAllowedOrigin(origin)) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders(origin),
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, origin);
    }

    if (!isAllowedOrigin(origin)) {
      return json({ error: 'Forbidden' }, 403, origin);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(ip)) {
      return json({ error: 'Too many requests. Try again in a minute.' }, 429, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400, origin);
    }

    const text = typeof body?.text === 'string' ? body.text.trim() : '';
    if (!text) {
      return json({ error: 'Text is required' }, 400, origin);
    }
    if (text.length > MAX_CHARS) {
      return json({ error: 'Text too long' }, 400, origin);
    }

    if (!env.XAI_API_KEY) {
      return json({ error: 'TTS not configured' }, 500, origin);
    }

    const ttsRes = await fetch('https://api.x.ai/v1/tts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice_id: VOICE_ID,
        language: 'en',
      }),
    });

    if (!ttsRes.ok) {
      return json({ error: 'TTS failed' }, 502, origin);
    }

    const audio = await ttsRes.arrayBuffer();
    return new Response(audio, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
        ...corsHeaders(origin),
      },
    });
  },
};
