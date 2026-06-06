/*
  Birthday Stats modal (triggered by ♊️ on homepage)
  Builds the DOM and wires up dismissal; presentation lives in /css/birthday-modal.css.
*/

function showBirthdayStatsModal() {
  // Prevent multiple modals
  if (document.getElementById('birthday-stats-modal')) return;

  // Create overlay (styled via #birthday-stats-modal)
  const overlay = document.createElement('div');
  overlay.id = 'birthday-stats-modal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Birthday Stats');

  // Create the card
  const card = document.createElement('div');
  card.className = 'birthday-modal-card';

  card.innerHTML = `
    <h2>Birthday Stats 🎂</h2>
    <ul>
      <li><strong>Astrological Sign:</strong> <span class="birthday-stat-value">Gemini</span></li>
      <li><strong>Chinese Zodiac Sign:</strong> <span class="birthday-stat-value">Metal Horse</span></li>
      <li><strong>Gregorian Day of the Year:</strong> <span class="birthday-stat-value">169, 170 (Leap Year)</span></li>
      <li><strong>Generation:</strong> <span class="birthday-stat-value">Millennial</span></li>
      <li><strong>Month & Day first appears in Phi at decimal digit:</strong> <span class="birthday-stat-value">1</span></li>
      <li><strong>Age in Periodic Table Years:</strong> <span class="birthday-stat-value">Bromine, Metalloid</span></li>
      <li><strong>Age on Neptune:</strong> <span class="birthday-stat-value">👶🏼</span></li>
      <li><strong>Age according to a Kindergartener:</strong> <span class="birthday-stat-value">Very, very old.</span></li>
    </ul>
  `;

  // Stop click from bubbling to overlay (so it doesn't close when clicking inside)
  card.addEventListener('click', (e) => e.stopPropagation());

  // Dismiss when clicking the overlay (outside the card)
  overlay.addEventListener('click', () => {
    closeModal();
  });

  // Also allow Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  document.addEventListener('keydown', handleEscape, { once: true });

  function closeModal() {
    overlay.classList.remove('is-visible');

    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.removeEventListener('keydown', handleEscape);
    }, 200);
  }

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  // Gentle entrance (next frame so the opacity transition runs)
  requestAnimationFrame(() => {
    overlay.classList.add('is-visible');
  });
}

// Make it available globally (homepage gemini toggle calls this)
window.showBirthdayStatsModal = showBirthdayStatsModal;
