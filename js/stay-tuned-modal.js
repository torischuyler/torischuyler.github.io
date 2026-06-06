/*
  Stay Tuned Modal
  Simple, reusable placeholder modal for personality emoji buttons.
  Shows a friendly "Stay tuned" message. Calls onClose when dismissed.
*/

function showStayTunedModal(onClose) {
  // Prevent multiple modals
  if (document.getElementById('stay-tuned-modal')) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'stay-tuned-modal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Stay tuned');

  // Basic inline styles so we don't need extra CSS for this placeholder
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9999',
    padding: '1rem',
    cursor: 'pointer'
  });

  // Create the card
  const card = document.createElement('div');
  Object.assign(card.style, {
    backgroundColor: 'var(--primary-color, #0D1B2A)',
    color: 'var(--text-color, #fff)',
    border: '1px solid var(--secondary-color, #2A3F54)',
    borderRadius: '16px',
    padding: '2rem 2.5rem',
    maxWidth: '320px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    cursor: 'default'
  });

  card.innerHTML = `
    <div style="font-size: 2.25rem; margin-bottom: 0.75rem;">✨</div>
    <h2 style="font-family: Righteous, system-ui, sans-serif; margin: 0 0 0.5rem; font-size: 1.5rem; color: var(--header-color, #9CBB80);">
      Stay tuned.
    </h2>
    <p style="margin: 0; opacity: 0.85; font-size: 0.95rem; line-height: 1.4;">
      Something fun is coming for this button.
    </p>
  `;

  // Stop click from bubbling to overlay
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
    overlay.style.transition = 'opacity 0.15s ease';
    overlay.style.opacity = '0';

    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.removeEventListener('keydown', handleEscape);
      if (typeof onClose === 'function') onClose();
    }, 120);
  }

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  // Gentle entrance
  requestAnimationFrame(() => {
    overlay.style.transition = 'opacity 0.2s ease';
    overlay.style.opacity = '1';
  });
}

// Make it available globally for the toggle scripts
window.showStayTunedModal = showStayTunedModal;
