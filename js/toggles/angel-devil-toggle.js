/*
  Angel / Devil personality button (Who Are You? page nav)
  Placeholder behavior: Shows "Stay tuned" modal, then flips between 😇 and 😈.
*/

function initializeAngelDevilToggle() {
  const toggle = document.getElementById('angel-devil-toggle');
  if (!toggle) {
    console.error('Angel-Devil toggle button not found.');
    return;
  }

  // Starting emoji
  let currentEmoji = '😇';
  toggle.textContent = currentEmoji;
  toggle.setAttribute('aria-label', 'Fun button (coming soon)');

  const flipTo = (newEmoji) => {
    currentEmoji = newEmoji;
    toggle.textContent = currentEmoji;
  };

  toggle.addEventListener('click', () => {
    window.showStayTunedModal(() => {
      const next = currentEmoji === '😇' ? '😈' : '😇';
      flipTo(next);
    });
  });
}

initializeAngelDevilToggle();
