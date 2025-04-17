/*
  🏛️ Blueprint Modal: This script controls the display of the HTML and CSS blueprint modals,
  with functions to open and close it, and an event listener to close it when clicking outside.
*/

// Function to open the modal
function openModal() {

  // Get the modal element by ID
  const modal = document.getElementById('blueprint-modal');

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
