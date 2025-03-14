/*
  Footer: JavaScript

  This script automatically updates the year in the site's footer.
*/

// Add event listener to wait for the DOM to be fully loaded.
document.addEventListener('DOMContentLoaded', updateFooterYear);

// Define the function to update the footer year.
function updateFooterYear() {

  // Try to find the element with ID 'year'.
  const yearElement = document.getElementById('year');

  // Check if the year element exists.
  if (yearElement) {

    // Update the text content of the year element with the current year.
    yearElement.textContent = new Date().getFullYear();

    // Log a warning if the year element isn't found.
  } else {
    console.warn('Element with ID "year" not found in the DOM.');
  }
}

// Function to update the heart based on theme
function updateHeart() {
  const heart = document.querySelector(".heart");
  const isLightTheme = document.body.classList.contains("light-theme");

  if (isLightTheme) {
      // Red heart for light mode
      heart.textContent = "❤️";
  } else {
      // Blue heart for dark mode
      heart.textContent = "💙";
  }
}

// Run it once on page load
updateHeart();

/*
    Watch for theme switches to keep the heart in sync.
    This MutationObserver acts like a little spy 👀 on the <body> tag. It listens for changes to the 'class' attribute
    (specifically when 'light-theme' is added or removed by the theme toggle). When that happens, it triggers
    updateHeart() to swap the heart emoji between 💙 (dark mode) and ❤️ (light mode). It’s here to catch theme
    changes automatically, so the heart updates even if the toggle script doesn’t directly call this function.
    Think of it as a safety net ensuring the footer heart stays theme-consistent no matter how the mode switches!
*/
const observer = new MutationObserver(updateHeart);
observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
