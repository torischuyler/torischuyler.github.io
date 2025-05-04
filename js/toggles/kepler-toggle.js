/*
  📐 Kepler toggles: Handles keyboard interactions for the gallery toggle controls.
  Listens for Enter/Space key presses on .kepler labels,
  triggering the associated radio button to toggle gallery images.
 */

// Selects all elements with class 'kepler' inside 'gallery-controls' and iterates over them.
document.querySelectorAll('.gallery-controls .kepler').forEach(label => {

  // Adds a keydown event listener to each kepler label.
  label.addEventListener('keydown', event => {

    // Checks if the pressed key is Enter or Space.
    if (event.key === 'Enter' || event.key === ' ') {

      // Prevents default behavior (e.g., scrolling for Space key).
      event.preventDefault();

      // Gets the ID of the radio button associated with the label via its 'for' attribute.
      const radioId = label.getAttribute('for');

      // Programmatically clicks the associated radio button to toggle the gallery image.
      document.getElementById(radioId).click();
    }
  });
});
