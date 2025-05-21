/*
  Yin Yang Toggle: A light/dark mode switch for the site,
  symbolizing balance with the ☯️ icon.

  This script:
  1. Remembers a visitor's theme preference using localStorage.
  2. Displays a toggle button for visitors to switch themes.
  3. Saves the visitor's choice for future visits.
*/

// Function to initialize and manage the Yin-Yang theme toggle
function initializeYinYangToggle() {
  // Check if localStorage is available to ensure compatibility across environments
  const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

  // Declare variable to store the saved theme, initially undefined
  let savedTheme;

  // If localStorage is available, try to retrieve the saved theme
  if (isLocalStorageAvailable) {
    try {
      // Get the saved theme from localStorage ('light' or 'dark')
      savedTheme = localStorage.getItem('theme');
    } catch (e) {
      // Log any errors if localStorage retrieval fails (e.g., quota exceeded)
      console.error('Failed to retrieve theme from localStorage:', e);
      // Set savedTheme to null if retrieval fails
      savedTheme = null;
    }
  } else {
    // If localStorage isn’t available, default to null (no saved preference)
    savedTheme = null;
  }

  // Apply light theme class if explicitly saved as 'light' (dark is default otherwise)
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }

  // Get the toggle button element from the DOM by its ID
  const toggle = document.getElementById('yin-yang-toggle');

  // Check if the toggle button exists; if not, log an error and exit
  if (!toggle) {
    console.error('Yin-Yang toggle button not found! Theme functionality disabled.');
    return;
  }

  // Function to update the button’s UI based on the current theme
  function updateThemeUI(isLightTheme) {
    // Set the button text to the Yin-Yang emoji (☯️) regardless of theme
    toggle.textContent = '☯️';
    // Update aria-label to reflect the action (e.g., "Switch to dark theme")
    toggle.setAttribute('aria-label', `Switch to ${isLightTheme ? 'dark' : 'light'} theme`);
  }

  // Initialize the button’s UI based on the current theme (light or dark)
  updateThemeUI(document.body.classList.contains('light-theme'));

  // Add a click event listener to the toggle button
  toggle.addEventListener('click', () => {
    // Toggle the 'light-theme' class on the body, returning true if added, false if removed
    const isLightTheme = document.body.classList.toggle('light-theme');

    // Update the button’s UI after the theme changes
    updateThemeUI(isLightTheme);

    // If localStorage is available, save the new theme preference
    if (isLocalStorageAvailable) {
      try {
        // Store the current theme ('light' or 'dark') in localStorage
        localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
      } catch (e) {
        // Log any errors if saving to localStorage fails
        console.error('Failed to save theme to localStorage:', e);
      }
    }
  });
}

// Run the initialization function when the script loads
initializeYinYangToggle();
