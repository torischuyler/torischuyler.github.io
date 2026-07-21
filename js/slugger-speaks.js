/*
  Slugger Speaks — xAI TTS via Cloudflare Worker, with browser speech fallback
  only when the Worker endpoint is not configured.
*/

document.addEventListener('DOMContentLoaded', () => {
  const lab = document.querySelector('.ss-lab');
  if (!lab) return;

  const nameInput = document.getElementById('ss-name');
  const greetBtn = document.getElementById('ss-greet');
  const textArea = document.getElementById('ss-text');
  const countEl = document.getElementById('ss-count');
  const counterEl = document.getElementById('ss-counter');
  const speakBtn = document.getElementById('ss-speak');
  const statusEl = document.getElementById('ss-status');
  const presetButtons = [...lab.querySelectorAll('.ss-preset')];

  if (!nameInput || !textArea || !speakBtn) return;

  const MAX_CHARS = 140;

  // Set after: cd workers/slugger-tts && npx wrangler@latest deploy
  const TTS_ENDPOINT = 'https://slugger-tts.tori-schuyler.workers.dev';

  // Browser fallback voice — only used if TTS_ENDPOINT is not configured
  const SLUGGER = {
    pitch: 0.85,
    rate: 0.95,
    hints: ['daniel', 'alex', 'fred', 'david', 'male'],
  };

  let voices = [];
  /** @type {HTMLAudioElement | null} */
  let currentAudio = null;
  /** @type {string | null} */
  let currentObjectUrl = null;
  /** @type {AbortController | null} */
  let fetchAbort = null;
  let speakGeneration = 0;

  function setStatus(message, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.toggle('is-error', isError);
  }

  function supportsSpeech() {
    return typeof window.speechSynthesis !== 'undefined'
      && typeof window.SpeechSynthesisUtterance !== 'undefined';
  }

  function loadVoices() {
    voices = window.speechSynthesis.getVoices();
  }

  function pickSystemVoice() {
    if (!voices.length) return null;

    const english = voices.filter((v) => /^en(-|_)/i.test(v.lang) || /english/i.test(v.name));
    const pool = english.length ? english : voices;
    const hints = SLUGGER.hints.map((h) => h.toLowerCase());

    for (const hint of hints) {
      const match = pool.find((v) => v.name.toLowerCase().includes(hint));
      if (match) return match;
    }

    return pool.find((v) => v.default) || pool[0] || null;
  }

  function stopPlayback() {
    if (fetchAbort) {
      fetchAbort.abort();
      fetchAbort = null;
    }
    if (currentAudio) {
      currentAudio.onended = null;
      currentAudio.onerror = null;
      currentAudio.pause();
      currentAudio.src = '';
      currentAudio = null;
    }
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }
    if (supportsSpeech()) {
      window.speechSynthesis.cancel();
    }
  }

  function ttsConfigured() {
    return TTS_ENDPOINT && !TTS_ENDPOINT.includes('REPLACE_ME');
  }

  function speakBrowser(text) {
    if (!supportsSpeech()) {
      setStatus('Speech isn’t available in this browser.', true);
      return Promise.reject(new Error('speechSynthesis unavailable'));
    }

    stopPlayback();

    const utter = new SpeechSynthesisUtterance(text);
    utter.pitch = SLUGGER.pitch;
    utter.rate = SLUGGER.rate;
    const voice = pickSystemVoice();
    if (voice) utter.voice = voice;

    setStatus('Slugger is speaking…');

    return new Promise((resolve, reject) => {
      utter.onend = () => {
        setStatus('');
        resolve();
      };
      utter.onerror = (event) => {
        if (event.error === 'interrupted' || event.error === 'canceled') {
          resolve();
          return;
        }
        setStatus('Couldn’t finish speaking. Try again?', true);
        reject(event.error);
      };
      window.speechSynthesis.speak(utter);
    });
  }

  async function speakXai(text, generation) {
    stopPlayback();
    fetchAbort = new AbortController();
    setStatus('Slugger is speaking…');

    const response = await fetch(TTS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: fetchAbort.signal,
    });

    if (generation !== speakGeneration) return;

    if (response.status === 429) {
      throw new Error('rate_limited');
    }

    if (!response.ok) {
      throw new Error(`tts_http_${response.status}`);
    }

    const blob = await response.blob();
    if (generation !== speakGeneration) return;

    currentObjectUrl = URL.createObjectURL(blob);
    currentAudio = new Audio(currentObjectUrl);

    await new Promise((resolve, reject) => {
      currentAudio.onended = () => {
        if (generation === speakGeneration) {
          setStatus('');
          stopPlayback();
        }
        resolve();
      };
      currentAudio.onerror = () => {
        // Superseded by a newer Speak click — not a real failure
        if (generation !== speakGeneration) {
          resolve();
          return;
        }
        reject(new Error('audio_playback_failed'));
      };
      currentAudio.play().catch((err) => {
        if (generation !== speakGeneration) {
          resolve();
          return;
        }
        reject(err);
      });
    });
  }

  /**
   * Speak text with xAI TTS when configured.
   * Browser speech is only used if the Worker endpoint is not set up.
   */
  async function speakText(text) {
    const trimmed = text.trim();
    if (!trimmed) {
      setStatus('Type something for Slugger to say.', true);
      return Promise.reject(new Error('empty text'));
    }

    const generation = ++speakGeneration;

    if (ttsConfigured()) {
      try {
        await speakXai(trimmed, generation);
        return;
      } catch (err) {
        if (generation !== speakGeneration) return;
        if (err?.name === 'AbortError') return;
        if (err?.message === 'rate_limited') {
          setStatus('Whoa — too many requests. Try again in a minute.', true);
          return;
        }
        console.warn('xAI TTS failed.', err);
        setStatus('Couldn’t reach Slugger’s voice. Try again?', true);
        return;
      }
    }

    return speakBrowser(trimmed);
  }

  function updateCounter() {
    const len = textArea.value.length;
    if (countEl) countEl.textContent = String(len);
    if (counterEl) counterEl.classList.toggle('is-full', len >= MAX_CHARS);
  }

  greetBtn?.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      setStatus('Type your name so Slugger can say hi.', true);
      nameInput.focus();
      return;
    }
    speakText(`Hi ${name}. Nice to meet you.`);
  });

  nameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      greetBtn?.click();
    }
  });

  textArea.addEventListener('input', updateCounter);

  presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const line = btn.dataset.text || btn.textContent || '';
      textArea.value = line.slice(0, MAX_CHARS);
      updateCounter();
      textArea.focus();
      speakText(textArea.value);
    });
  });

  speakBtn.addEventListener('click', () => {
    speakText(textArea.value.slice(0, MAX_CHARS));
  });

  if (supportsSpeech()) {
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
  } else if (!ttsConfigured()) {
    setStatus('Speech isn’t available in this browser.', true);
    greetBtn && (greetBtn.disabled = true);
    speakBtn.disabled = true;
  }

  updateCounter();
});
