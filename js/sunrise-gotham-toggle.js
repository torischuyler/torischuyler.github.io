/*
  Sunrise Gotham toggle: A light/dark mode switch for the site,
  the sunrise (🌅) represents dark mode and Gotham (🌃) for light mode.

  "Give me odorous at sunrise a garden of beautiful flowers where I can walk undisturbed." -Walt Whitman

  "The night is darkest just before dawn." -Harvey Dent (Two-Face) in The Dark Knight (2008).

  This script:
  1. Remembers a visitor's theme preference using localStorage.
  2. Displays a toggle button for visitors to switch themes.
  3. Saves the visitor's choice for future visits.
*/

// Function to initialize and manage the Sunrise-Gotham theme toggle
function initializeSunriseGothamToggle() {
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
  const toggle = document.getElementById('sunrise-gotham-toggle');

  // Check if the toggle button exists
  if (!toggle) {
    console.error('Sunrise-Gotham toggle button not found! Theme functionality disabled.');
    return;
  }

  // Function to update the button’s UI based on the current theme
  function updateThemeUI(isLightTheme) {
    // Set icon to Gotham (🌃) for light mode, Sunrise (🌅) for dark mode
    toggle.textContent = isLightTheme ? '🌃' : '🌅';
    // Update aria-label for accessibility
    toggle.setAttribute('aria-label', `Switch to ${isLightTheme ? 'dark' : 'light'} theme`);
    // Update aria-pressed to reflect the current state
    toggle.setAttribute('aria-pressed', isLightTheme ? 'true' : 'false');
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
initializeSunriseGothamToggle();
