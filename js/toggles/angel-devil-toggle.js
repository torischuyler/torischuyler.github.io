/*
Angel Devil toggle: A light/dark mode switch for the site,
the angel (😇) represents light mode and devilish face (😈) for dark mode.

😇 "Lead me not into temptation... Oh, who am I kidding? Follow me, I know a shortcut!" 😈 —Anon

  This script:
  1. Remembers a visitor's theme preference using localStorage.
  2. Displays a toggle button for visitors to switch themes.
  3. Saves the visitor's choice for future visits.
*/

// Function to initialize and manage the Angel-Devil theme toggle
function initializeAngelDevilToggle() {
// Check if localStorage is available to ensure compatibility
const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

// Variable to store the saved theme
let savedTheme;

// Retrieve saved theme from localStorage if available
if (isLocalStorageAvailable) {
  try {
    savedTheme = localStorage.getItem('theme');
  } catch (e) {
    console.error('Failed to retrieve theme from localStorage:', e);
    savedTheme = null;
  }
} else {
  savedTheme = null;
}

// Apply light theme if saved as 'light' (dark is default)
if (savedTheme === 'light') {
  document.body.classList.add('light-theme');
}

// Get the toggle button by its ID
const toggle = document.getElementById('angel-devil-toggle');

// Check if the toggle button exists
if (!toggle) {
  console.error('Angel-Devil toggle button not found! Theme functionality disabled.');
  return;
}

// Function to update the button’s UI based on the current theme
function updateThemeUI(isLightTheme) {
  // Set icon to Devil (😈) for light mode, Angel (😇) for dark mode
  toggle.textContent = isLightTheme ? '😈' : '😇';
  // Update aria-label for accessibility
  toggle.setAttribute('aria-label', `Switch to ${isLightTheme ? 'dark' : 'light'} theme`);
}

// Set initial UI based on current theme
updateThemeUI(document.body.classList.contains('light-theme'));

// Add click event listener to toggle the theme
toggle.addEventListener('click', () => {
  // Toggle the light-theme class and get the new state
  const isLightTheme = document.body.classList.toggle('light-theme');

  // Update the UI after toggling
  updateThemeUI(isLightTheme);

  // Save the new theme preference to localStorage if available
  if (isLocalStorageAvailable) {
    try {
      localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
    } catch (e) {
      console.error('Failed to save theme to localStorage:', e);
    }
  }
});
}

// Initialize the toggle when the script runs
initializeAngelDevilToggle();
