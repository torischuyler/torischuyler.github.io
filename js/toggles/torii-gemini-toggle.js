/*
  Torii / Gemini personality button (homepage nav)
  Placeholder behavior: Shows "Stay tuned" modal, then flips between ⛩️ and ♊️.
*/

function initializeToriiGeminiToggle() {
  const toggle = document.getElementById('torii-gemini-toggle');
  if (!toggle) {
    console.error('Torii-Gemini toggle button not found.');
    return;
  }

  // Starting emoji (we can change this later)
  let currentEmoji = '⛩️';
  toggle.textContent = currentEmoji;
  toggle.setAttribute('aria-label', 'Fun button (coming soon)');

  const flipTo = (newEmoji) => {
    currentEmoji = newEmoji;
    toggle.textContent = currentEmoji;
  };

  toggle.addEventListener('click', () => {
    // Show the placeholder modal. Flip the emoji after the user closes it.
    window.showStayTunedModal(() => {
      const next = currentEmoji === '⛩️' ? '♊️' : '⛩️';
      flipTo(next);
    });
  });
}

initializeToriiGeminiToggle();
