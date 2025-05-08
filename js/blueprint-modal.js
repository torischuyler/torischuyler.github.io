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

  // Select the paragraph element to toggle its visibility
  const paragraph = document.querySelector('#blueprint-modal .modal-content p');

  // Check if we're showing the HTML Blueprint
  if (type === 'html') {

    // Get the HTML Blueprint content from the hidden element
    const blueprintContent = document.getElementById('html-blueprint').querySelector('code').textContent;

    // Put the HTML Blueprint content into the modal
    modalContent.textContent = blueprintContent;

    // Set the modal's title to show it's the HTML Blueprint
    modalTitle.textContent = 'Homepage HTML Blueprint';

    // Show the paragraph when displaying the HTML blueprint
    paragraph.style.display = 'block';

    // Update the modal's aria-label for accessibility
    modal.setAttribute('aria-label', 'HTML Blueprint Modal');

  // Check if we're showing the CSS Blueprint
  } else if (type === 'css') {

    // Get the CSS Blueprint content from the hidden element
    const blueprintContent = document.getElementById('css-blueprint').querySelector('code').textContent;

    // Put the CSS Blueprint content into the modal
    modalContent.textContent = blueprintContent;

    // Set the modal's title to show it's the CSS Blueprint
    modalTitle.textContent = 'Homepage CSS Blueprint';

    // Update the modal's aria-label for accessibility
    modal.setAttribute('aria-label', 'CSS Blueprint Modal');

    // Hide the paragraph when displaying the CSS blueprint
    paragraph.style.display = 'none';
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
