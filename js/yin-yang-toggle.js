/*
Yin Yang Toggle: JavaScript

This code creates a light/dark mode toggle for the website. It does three main things:
1. Checks if you've used the site before and remembers your theme preference (using localStorage).
2. Shows a sun (☀️) or moon (🌙) button that you can click to switch themes.
3. Saves your choice for next time you visit.
*/

/*
Check if localStorage is available by verifying both:
1. The window object exists (we're in a browser environment).
2. The localStorage API is available on the window object.
This prevents errors in environments where localStorage isn't available
(like Node.js, private browsing, or when cookies are disabled).
*/
const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

/*
Retrieve any previously saved theme preference from localStorage.
If localStorage isn't available or no theme was saved, default to null.
*/
const savedTheme = isLocalStorageAvailable ? localStorage.getItem('theme') : null;

/*
If user previously selected dark theme, apply it immediately.
This prevents a flash of light theme when the page loads.
*/
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

/*
Get reference to the theme toggle button in the DOM.
This button must have an ID of 'yin-yang-toggle' in the HTML.
Will return null if element doesn't exist, so ensure HTML includes this element.
*/
const toggle = document.getElementById('yin-yang-toggle');

/**
Updates all theme-related UI elements:
- Button emoji (☀️ for dark mode, 🌙 for light mode).
- Aria-label for screen readers.
@param {boolean} isDarkTheme - true if dark theme is active.
*/
function updateThemeUI(isDarkTheme) {
    toggle.textContent = isDarkTheme ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', `Switch to ${isDarkTheme ? 'light' : 'dark'} theme`);
}

/*
Set initial UI state based on current body class rather than savedTheme.
This ensures UI accurately reflects the actual theme state in case:
1. localStorage was cleared.
2. Theme was set by other means (e.g., system preferences).
3. savedTheme is out of sync with actual state.
*/
updateThemeUI(document.body.classList.contains('dark-theme'));

/*
Add click event listener to theme toggle button.
When clicked, it:
1. Toggles the 'dark-theme' class and stores the new state
2. Updates the button's emoji and aria-label
3. Saves the preference to localStorage
*/
toggle.addEventListener('click', () => {
    // Returns true if class was added (dark mode), false if removed.
    const isDarkTheme = document.body.classList.toggle('dark-theme');
    
    // Update UI elements with new theme state.
    updateThemeUI(isDarkTheme);
    
    // Save the user's theme preference to localStorage.
    if (isLocalStorageAvailable) {
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    }
});