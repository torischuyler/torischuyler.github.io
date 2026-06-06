/*
  Gemini emoji button (homepage nav)
  Clicking ♊️ opens a modal with Tori's birthday stats + a link to "Who Are You?"
  (Torii ⛩️ remains hidden.)
*/

const GEMINI_EMOJI = '♊️';

function initializeToriiGeminiToggle() {
  const toggle = document.getElementById('torii-gemini-toggle');
  if (!toggle) {
    console.error('Torii-Gemini toggle button not found.');
    return;
  }

  toggle.textContent = GEMINI_EMOJI;
  toggle.setAttribute('aria-label', 'Tori\'s birthday stats');

  toggle.addEventListener('click', () => {
    if (typeof window.showBirthdayStatsModal === 'function') {
      window.showBirthdayStatsModal();
    } else {
      console.error('showBirthdayStatsModal is not available');
    }
  });
}

initializeToriiGeminiToggle();
