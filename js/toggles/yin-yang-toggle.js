/*
  Yin-Yang personality button (TIL pages nav)
  Placeholder behavior: Shows "Stay tuned" modal. No emoji flip (single symbol).
*/

function initializeYinYangToggle() {
  const toggle = document.getElementById('yin-yang-toggle');
  if (!toggle) {
    console.error('Yin-Yang toggle button not found.');
    return;
  }

  toggle.textContent = '☯️';
  toggle.setAttribute('aria-label', 'Fun button (coming soon)');

  toggle.addEventListener('click', () => {
    window.showStayTunedModal();
  });
}

initializeYinYangToggle();
