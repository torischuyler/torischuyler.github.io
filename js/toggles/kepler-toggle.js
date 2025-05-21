/*
  📐 Kepler toggles: Handles keyboard interactions for gallery toggle controls.
  Listens for Enter/Space key presses on .kepler labels,
  triggering the associated radio button to toggle gallery images.
*/

const handleKeyToggle = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    const radioId = event.target.getAttribute('for');
    document.getElementById(radioId).click();
  }
};

document.querySelectorAll('.gallery-controls .kepler').forEach(label => {
  label.addEventListener('keydown', handleKeyToggle);
});
