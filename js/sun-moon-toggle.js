/*
  Sun Moon Toggle: A light/dark mode switch for the site,
  symbolizing balance with sun (🌞) and moon (🌙) icons.

  This script:
  1. Remembers a visitor's theme preference using localStorage.
  2. Displays a toggle button for visitors to switch themes.
  3. Saves the visitor's choice for future visits.
*/

// Check if localStorage is available to avoid errors in unsupported environments.
const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

// Declare variable to hold the saved theme, initialized as undefined.
let savedTheme;

// Check if localStorage is available before attempting to retrieve data.
if (isLocalStorageAvailable) {
  // Attempt to get the theme from localStorage.
  try {
    savedTheme = localStorage.getItem('theme');
    // Catch any errors that occur during the retrieval.
  } catch (e) {
    // Log the error to console for debugging.
    console.error('Failed to retrieve theme from localStorage:', e);
    // Set savedTheme to null if retrieval fails.
    savedTheme = null;
  }
  // If localStorage is not available, set savedTheme to null.
} else {
  savedTheme = null;
}

// Apply light theme by default unless explicitly set to 'dark' in localStorage.
if (savedTheme === 'light') {
  document.body.classList.add('light-theme');
}

// Reference to the theme toggle button in the DOM.
const toggle = document.getElementById('sun-moon-toggle');

// Check if the toggle button exists in the DOM.
if (!toggle) {
  // Log an error if the toggle button is not found.
  console.error('Toggle button not found!');
}

// Function to update UI based on the current theme.
function updateThemeUI(isLightTheme) {
  // Set button icon to sun if dark (to switch to light), moon if light (to switch to dark).
  toggle.textContent = isLightTheme ? '🌙' : '🌞';
  // Update aria-label for screen readers.
  toggle.setAttribute('aria-label', `Switch to ${isLightTheme ? 'dark' : 'light'} theme`);
  // Update aria-pressed to reflect the current state (true for light, false for dark).
  toggle.setAttribute('aria-pressed', isLightTheme ? 'true' : 'false');
}

// Set initial UI based on current theme to ensure consistency with actual state.
updateThemeUI(document.body.classList.contains('light-theme'));

// Add click event listener to toggle button.
toggle.addEventListener('click', () => {
  // Toggle light theme class on body.
  const isLightTheme = document.body.classList.toggle('light-theme');

  // Update UI based on new theme state.
  updateThemeUI(isLightTheme);

  // Check if localStorage is available before attempting to save data.
  if (isLocalStorageAvailable) {
    // Attempt to save the theme to localStorage.
    try {
      localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
      // Catch any errors that occur during the saving process.
    } catch (e) {
      // Log the error to console for debugging.
      console.error('Failed to save theme to localStorage:', e);
    }
  }
});
