/*
  Torii / Gemini personality button (homepage nav)
  Placeholder behavior: Shows "Stay tuned" modal, then flips between ⛩️ and ♊️.
  Torii is hidden for now — only Gemini is shown. Set TORII_HIDDEN to false to restore.
*/

const TORII_EMOJI = '⛩️';
const GEMINI_EMOJI = '♊️';
const TORII_HIDDEN = true;

function initializeToriiGeminiToggle() {
  const toggle = document.getElementById('torii-gemini-toggle');
  if (!toggle) {
    console.error('Torii-Gemini toggle button not found.');
    return;
  }

  let currentEmoji = TORII_HIDDEN ? GEMINI_EMOJI : TORII_EMOJI;
  toggle.textContent = currentEmoji;
  toggle.setAttribute('aria-label', 'Fun button (coming soon)');

  const flipTo = (newEmoji) => {
    currentEmoji = newEmoji;
    toggle.textContent = currentEmoji;
  };

  toggle.addEventListener('click', () => {
    window.showStayTunedModal(() => {
      if (TORII_HIDDEN) {
        flipTo(GEMINI_EMOJI);
        return;
      }

      const next = currentEmoji === TORII_EMOJI ? GEMINI_EMOJI : TORII_EMOJI;
      flipTo(next);
    });
  });
}

initializeToriiGeminiToggle();
