/*
Yin Yang Toggle: A light/dark mode switch for the site,
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

// Apply dark theme if previously selected.
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

// Reference to the theme toggle button in the DOM.
const toggle = document.getElementById('yin-yang-toggle');

// Check if the toggle button exists in the DOM.
if (!toggle) {
    // Log an error if the toggle button is not found.
    console.error('Toggle button not found!');
}

// Function to update UI based on the current theme.
function updateThemeUI(isDarkTheme) {
    // Set button icon to sun if dark theme, moon if light theme.
    toggle.textContent = isDarkTheme ? '🌞' : '🌙';
    // Update aria-label for screen readers.
    toggle.setAttribute('aria-label', `Switch to ${isDarkTheme ? 'light' : 'dark'} theme`);
    // Update aria-pressed to reflect the current state (true for dark, false for light).
    toggle.setAttribute('aria-pressed', isDarkTheme ? 'true' : 'false');
}

// Set initial UI based on current theme to ensure consistency with actual state.
updateThemeUI(document.body.classList.contains('dark-theme'));

// Add click event listener to toggle button.
toggle.addEventListener('click', () => {
    // Toggle dark theme class on body.
    const isDarkTheme = document.body.classList.toggle('dark-theme');

    // Update UI based on new theme state.
    updateThemeUI(isDarkTheme);

    // Check if localStorage is available before attempting to save data.
    if (isLocalStorageAvailable) {
        // Attempt to save the theme to localStorage.
        try {
            localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        // Catch any errors that occur during the saving process.
        } catch (e) {
            // Log the error to console for debugging.
            console.error('Failed to save theme to localStorage:', e);
        }
    }
});