/*
  🌐 Browser: This script detects and displays the visitor's browser in a mystical way.
*/

// Function to detect if the browser is Arc by checking for Arc-specific CSS variables
function detectArc() {
  const arcVariable = getComputedStyle(document.documentElement).getPropertyValue('--arc-palette-title').trim();
  return arcVariable !== '';
}

// Defines a function that takes the raw userAgent string and uses additional detection methods to return a fun, browser-specific message
function getMysticalBrowser(userAgent) {
  // Check for Arc first using the CSS variable method
  if (detectArc()) return "the radiant arcs of Arc";
  // If not Arc, proceed with user agent checks for other browsers
  if (userAgent.includes("Edg")) return "the sharp edges of Edge";
  if (userAgent.includes("Chrome")) return "the gleaming paths of Chrome";
  if (userAgent.includes("Safari")) return "the wild orchards of Safari (or you're on an iPhone and it's all one big Safari 😂)";
  if (userAgent.includes("Firefox")) return "the fiery trails of Firefox";
  // Fallback for unknown browsers
  return "an unseen web whisperer";
}

// Waits for the HTML document to be fully loaded before running the code
document.addEventListener("DOMContentLoaded", function() {
    // Gets the raw user agent string from the browser
    const userAgent = navigator.userAgent;

    /*
      Since Arc detection requires CSS variables that may load after DOMContentLoaded,
      we add a small delay to ensure the variables are available.
    */
    setTimeout(() => {
        // Sets mysticalBrowser to the fun name we get from translating the raw userAgent
        const mysticalBrowser = getMysticalBrowser(userAgent);
        // Updates the HTML element with id "browser" to show the browser message with italics
        document.getElementById("browser").innerHTML =
            `🔮 The winds of the web carried you here via <i>${mysticalBrowser}</i>`;
    // 500ms delay to ensure Arc's CSS variables are injected
    }, 500);
});
