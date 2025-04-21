/*
  🏛️ Blueprint Modal: This script controls the display of a single blueprint modal,
  pulling the HTML and CSS blueprints from hidden elements in the HTML
  and dynamically setting the aria-label and title.


  This script has functions to open and close the modal, and
  an event listener to close it when clicking outside.
*/

// Function to open the modal
function openModal(type) {

  // Get the modal element by ID
  const modal = document.getElementById('blueprint-modal');

  // Get the modal's title element (the <h3> tag)
  const modalTitle = document.getElementById('modal-title');

  // Get the <code> element in the modal where the blueprint content will go
  const modalContent = document.getElementById('modal-content').querySelector('code');

  // Check if we're showing the HTML Blueprint
  if (type === 'html') {
    // Get the HTML Blueprint content from the hidden element
    const blueprintContent = document.getElementById('html-blueprint').querySelector('code').textContent;

    // Put the HTML Blueprint content into the modal
    modalContent.textContent = blueprintContent;

    // Set the modal's title to show it's the HTML Blueprint
    modalTitle.textContent = 'Homepage HTML Blueprint';

    // Update the modal's aria-label for accessibility
    modal.setAttribute('aria-label', 'HTML Blueprint Modal');
  }

  // Makes the modal visible by setting its display to block
  modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {

  // Get the modal element by ID
  const modal = document.getElementById('blueprint-modal');

  // Hides the modal by setting its display to none
  modal.style.display = 'none';
}

// Event listener to close the modal when clicking outside the modal content
window.onclick = function(event) {

  // Get the modal element
  const modal = document.getElementById('blueprint-modal');

  // Check if the click target is the modal overlay
  if (event.target === modal) {

      // Hide the modal
      modal.style.display = 'none';
  }
};
