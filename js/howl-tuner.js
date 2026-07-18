/*
  Call to the Moon — howl frequency tuner
  Drag a slider to change pitch; a canvas waveform animates live.
  Web Audio synthesizes a howl-ish tone (no audio file needed).
  Hit the sweet spot (~340–420 Hz) and the moon wakes up.
*/

document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.howl-tuner');
  const canvas = document.getElementById('howl-wave');
  const freqInput = document.getElementById('howl-freq');
  const freqReadout = document.getElementById('howl-freq-readout');
  const toggleBtn = document.getElementById('howl-toggle');
  const statusEl = document.getElementById('howl-status');
  const moon = document.getElementById('howl-moon');

  if (!section || !canvas || !freqInput || !toggleBtn) return;

  const ctx2d = canvas.getContext('2d');
  if (!ctx2d) return;

  const MIN_HZ = Number(freqInput.min) || 120;
  const MAX_HZ = Number(freqInput.max) || 720;
  const SWEET_LOW = 340;
  const SWEET_HIGH = 420;
  const SWEET_CENTER = (SWEET_LOW + SWEET_HIGH) / 2;

  let audioCtx = null;
  let osc = null;
  let oscLow = null;
  let filter = null;
  let gainNode = null;
  let lfo = null;
  let lfoGain = null;
  let howling = false;
  let phase = 0;
  let rafId = 0;

  function getFreq() {
    return Number(freqInput.value);
  }

  function sweetProximity(hz) {
    const dist = Math.abs(hz - SWEET_CENTER);
    const maxDist = Math.max(SWEET_CENTER - MIN_HZ, MAX_HZ - SWEET_CENTER);
    return Math.max(0, 1 - dist / (maxDist * 0.55));
  }

  function isSweet(hz) {
    return hz >= SWEET_LOW && hz <= SWEET_HIGH;
  }

  function updateReadout(hz) {
    freqReadout.textContent = `${hz} Hz`;
    freqInput.setAttribute('aria-valuenow', String(hz));
    freqInput.setAttribute('aria-valuetext', `${hz} hertz`);
  }

  function updateMoon(hz) {
    const proximity = sweetProximity(hz);
    const activeBoost = howling ? 0.25 : 0;
    const glow = Math.min(1, proximity * 0.85 + activeBoost + (howling && isSweet(hz) ? 0.35 : 0));
    const scale = 1 + proximity * 0.12 + (howling && isSweet(hz) ? 0.08 : 0);
    section.style.setProperty('--howl-moon-glow', glow.toFixed(3));
    section.style.setProperty('--howl-moon-scale', scale.toFixed(3));
    if (moon) {
      moon.classList.toggle('is-awake', howling && isSweet(hz));
    }
  }

  function updateStatus(hz) {
    if (!statusEl) return;
    if (howling && isSweet(hz)) {
      statusEl.textContent = 'The moon hears you — pack howl locked in.';
      statusEl.classList.add('is-sweet');
    } else if (howling) {
      statusEl.textContent = 'Howling… nudge the pitch toward the moon.';
      statusEl.classList.remove('is-sweet');
    } else if (isSweet(hz)) {
      statusEl.textContent = 'Sweet spot found — press start to call the moon.';
      statusEl.classList.add('is-sweet');
    } else {
      statusEl.textContent = 'Tune first — then press start to howl.';
      statusEl.classList.remove('is-sweet');
    }
  }

  function applyFrequency(hz) {
    if (!audioCtx || !osc || !filter) return;
    const t = audioCtx.currentTime;
    osc.frequency.setTargetAtTime(hz, t, 0.03);
    if (oscLow) oscLow.frequency.setTargetAtTime(hz * 0.5, t, 0.03);
    filter.frequency.setTargetAtTime(Math.min(2200, hz * 3.2), t, 0.05);
    if (lfoGain) {
      // Slightly more vibrato on higher howls
      const depth = 4 + ((hz - MIN_HZ) / (MAX_HZ - MIN_HZ)) * 10;
      lfoGain.gain.setTargetAtTime(depth, t, 0.05);
    }
  }

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function buildVoice() {
    const ctx = getAudioCtx();
    const hz = getFreq();

    osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = hz;

    oscLow = ctx.createOscillator();
    oscLow.type = 'triangle';
    oscLow.frequency.value = hz * 0.5;

    filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = Math.min(2200, hz * 3.2);
    filter.Q.value = 1.1;

    gainNode = ctx.createGain();
    gainNode.gain.value = 0.0001;

    lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 5.5;
    lfoGain = ctx.createGain();
    lfoGain.gain.value = 6;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const mixLow = ctx.createGain();
    mixLow.gain.value = 0.35;

    osc.connect(filter);
    oscLow.connect(mixLow).connect(filter);
    filter.connect(gainNode).connect(ctx.destination);

    const now = ctx.currentTime;
    osc.start(now);
    oscLow.start(now);
    lfo.start(now);
  }

  function startHowl() {
    try {
      if (!osc) buildVoice();
      const ctx = getAudioCtx();
      const t = ctx.currentTime;
      applyFrequency(getFreq());
      gainNode.gain.cancelScheduledValues(t);
      gainNode.gain.setValueAtTime(Math.max(gainNode.gain.value, 0.0001), t);
      gainNode.gain.exponentialRampToValueAtTime(0.14, t + 0.18);
      howling = true;
      toggleBtn.textContent = 'Stop Howl';
      toggleBtn.classList.add('is-on');
      syncUi();
    } catch {
      if (statusEl) {
        statusEl.textContent = 'Audio unavailable in this browser.';
        statusEl.classList.remove('is-sweet');
      }
    }
  }

  function stopHowl() {
    if (!gainNode || !audioCtx) {
      howling = false;
      toggleBtn.textContent = 'Start Howl';
      toggleBtn.classList.remove('is-on');
      syncUi();
      return;
    }
    const t = audioCtx.currentTime;
    gainNode.gain.cancelScheduledValues(t);
    gainNode.gain.setValueAtTime(Math.max(gainNode.gain.value, 0.0001), t);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    howling = false;
    toggleBtn.textContent = 'Start Howl';
    toggleBtn.classList.remove('is-on');
    syncUi();
  }

  function syncUi() {
    const hz = getFreq();
    updateReadout(hz);
    updateMoon(hz);
    updateStatus(hz);
    if (howling) applyFrequency(hz);
  }

  function drawWave(timestamp) {
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth || 420;
    const cssH = 140;
    const w = Math.round(cssW * dpr);
    const h = Math.round(cssH * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const hz = getFreq();
    const tNorm = (hz - MIN_HZ) / (MAX_HZ - MIN_HZ);
    const cycles = 2 + tNorm * 10;
    const amp = (0.28 + tNorm * 0.18) * h * (howling ? 1 : 0.72);
    const speed = 0.0022 + tNorm * 0.0045;
    phase += speed * (howling ? 1.35 : 0.85);

    ctx2d.clearRect(0, 0, w, h);

    // Soft baseline
    ctx2d.strokeStyle = 'rgba(201, 194, 186, 0.18)';
    ctx2d.lineWidth = 1 * dpr;
    ctx2d.beginPath();
    ctx2d.moveTo(0, h / 2);
    ctx2d.lineTo(w, h / 2);
    ctx2d.stroke();

    const sweet = isSweet(hz);
    const stroke = sweet
      ? (howling ? 'rgba(250, 202, 161, 0.95)' : 'rgba(250, 202, 161, 0.7)')
      : (howling ? 'rgba(156, 187, 128, 0.9)' : 'rgba(201, 194, 186, 0.75)');

    ctx2d.strokeStyle = stroke;
    ctx2d.lineWidth = (howling ? 2.4 : 1.8) * dpr;
    ctx2d.lineJoin = 'round';
    ctx2d.beginPath();

    for (let x = 0; x <= w; x += 2) {
      const pct = x / w;
      // Soft envelope so the wave eases at the edges
      const envelope = Math.sin(Math.PI * pct);
      const y = h / 2 + Math.sin((pct * cycles + phase) * Math.PI * 2) * amp * envelope;
      if (x === 0) ctx2d.moveTo(x, y);
      else ctx2d.lineTo(x, y);
    }
    ctx2d.stroke();

    // Faint secondary harmonic for richness
    ctx2d.strokeStyle = sweet
      ? 'rgba(250, 202, 161, 0.28)'
      : 'rgba(156, 187, 128, 0.22)';
    ctx2d.lineWidth = 1 * dpr;
    ctx2d.beginPath();
    for (let x = 0; x <= w; x += 3) {
      const pct = x / w;
      const envelope = Math.sin(Math.PI * pct);
      const y = h / 2 + Math.sin((pct * cycles * 2 + phase * 1.3) * Math.PI * 2) * amp * 0.35 * envelope;
      if (x === 0) ctx2d.moveTo(x, y);
      else ctx2d.lineTo(x, y);
    }
    ctx2d.stroke();

    rafId = requestAnimationFrame(drawWave);
  }

  freqInput.addEventListener('input', syncUi);
  toggleBtn.addEventListener('click', () => {
    if (howling) stopHowl();
    else startHowl();
  });

  // Stop audio if the tab is hidden so a howl doesn't keep going forever.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && howling) stopHowl();
  });

  syncUi();
  rafId = requestAnimationFrame(drawWave);

  window.addEventListener('beforeunload', () => {
    if (rafId) cancelAnimationFrame(rafId);
    if (howling) stopHowl();
  });
});
