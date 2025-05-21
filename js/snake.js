/* 🐍 Snake Game */

// Store the latest swipe direction for Python access
window.latestSwipeDirection = null;

// Flag to prevent multiple simultaneous swipes
window.isSwiping = false;

// Runs when the DOM is fully loaded to ensure canvas is available
window.addEventListener('load', () => {

  // Gets the canvas element by its ID
  const canvas = document.getElementById('game-canvas');

  // Gets the 2D rendering context for drawing on the canvas
  const ctx = canvas.getContext('2d');

  // Exposes the canvas context to PyScript for Python access
  window.ctx = ctx;

  // Sets canvas dimensions to match HTML attributes (500x500 pixels)
  canvas.width = 500;
  canvas.height = 500;

  // Add touchstart listener for swipe detection on mobile
  canvas.addEventListener('touchstart', (event) => {

    // Prevent default touch behaviors like scrolling
    event.preventDefault();

    // Gets the first touch point from the touch event
    const touch = event.touches[0];

    // Stores starting X and Y coordinates of the touch for swipe detection
    window.swipeStartX = touch.clientX;
    window.swipeStartY = touch.clientY;

    // Mark swipe as in progress
    window.isSwiping = true;
  });

  // Add touchend listener to detect swipe completion on mobile
  canvas.addEventListener('touchend', (event) => {

    // Get the ending touch coordinates
    const touch = event.changedTouches[0];
    window.swipeEndX = touch.clientX;
    window.swipeEndY = touch.clientY;

    // Calculate swipe distance
    const deltaX = window.swipeEndX - window.swipeStartX;
    const deltaY = window.swipeEndY - window.swipeStartY;

    // Only process swipes longer than 30 pixels
    if (Math.abs(deltaX) > 30 || Math.abs(deltaY) > 30) {

      // If horizontal axis is 1.5 times larger than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {

        // Set direction to right if deltaX is positive, otherwise left
        window.swipeDirection = deltaX > 0 ? 'right' : 'left';

      // If vertical axis is 1.5 times larger than horizontal
      } else if (Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {

        // Set direction to up if deltaY is positive, otherwise down
        window.swipeDirection = deltaY > 0 ? 'up' : 'down';
      }

      // Update latest swipe direction if valid
      if (window.swipeDirection) {
        window.latestSwipeDirection = window.swipeDirection;
      }
    }

    // Reset swipe flag
    window.isSwiping = false;
  });

  // Add touchmove listener to prevent scrolling during swipes
  canvas.addEventListener('touchmove', (event) => {

    // Stops default browser actions like scrolling
    event.preventDefault();
  });

  // Add touchcancel listener to reset swipe state
  canvas.addEventListener('touchcancel', () => {

    // Reset swipe flag and clear direction
    window.isSwiping = false;
    window.latestSwipeDirection = null;
  });
});
