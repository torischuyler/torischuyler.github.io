/*
  🌐 Browser: This script detects and displays the visitor's browser in a mystical way.
*/

// Function to detect if the browser is Arc by checking for Arc-specific CSS variables
function detectArc() {
  const arcVariable = getComputedStyle(document.documentElement).getPropertyValue('--arc-palette-title').trim();
  return arcVariable !== '';
}

// Function to detect if the browser is Brave by checking if it blocks requests to doubleclick.net
function detectBrave(callback) {
  // Create an image element to attempt loading a resource from a tracking domain
  const img = new Image();
  // Load a resource from doubleclick.net, a tracking domain that Brave Shields blocks by default, with a timestamp to prevent caching
  img.src = 'https://doubleclick.net/favicon.ico?' + new Date().getTime();

  // Set a 2-second timeout to determine if the request was blocked; if it doesn’t load, assume it’s Brave
  const timeout = setTimeout(() => {
      // If the image doesn't load within 2 seconds, it's likely blocked by Brave Shields
      callback(true);
  }, 2000);

  img.onload = () => {
      // If the image loads successfully, it's not Brave (or Shields is disabled)
      clearTimeout(timeout);
      callback(false);
  };

  img.onerror = () => {
      // If the request fails (blocked by Brave Shields), it's likely Brave
      clearTimeout(timeout);
      callback(true);
  };
}

// Defines a function that takes the raw userAgent string and uses additional detection methods to return a fun, browser-specific message
function getMysticalBrowser(userAgent) {
  // Check for Arc first using the CSS variable method
  if (detectArc()) return "the radiant arcs of Arc";
  // If not Arc, proceed with user agent checks for other browsers
  if (userAgent.includes("Tor")) return "the shadowed veils of Tor";
  if (userAgent.includes("Opera")) return "the grand opera of Opera";
  if (userAgent.includes("Samsung Internet")) return "the cosmic waves of Samsung Internet";
  if (userAgent.includes("Android")) return "the ancient scrolls of Android Browser";
  if (userAgent.includes("Yandex")) return "the icy winds of Yandex";
  if (userAgent.includes("UCBrowser") || userAgent.includes("UC Browser")) return "the swift currents of UC Browser";
  if (userAgent.includes("Huawei")) return "the silken roads of Huawei";
  if (userAgent.includes("Edge")) return "the sharp edges of Edge";
  if (userAgent.includes("Firefox")) return "the fiery trails of Firefox";
  if (userAgent.includes("Safari")) return "the wild orchards of Safari";
  if (userAgent.includes("Chrome")) return "the gleaming paths of Chrome";
  // Fallback for unknown browsers
  return "an unseen web whisperer";
}

// Waits for the HTML document to be fully loaded before running the code
document.addEventListener("DOMContentLoaded", function() {
  // Gets the raw user agent string from the browser
  const userAgent = navigator.userAgent;

  /*
  Since Arc detection requires CSS variables that may load after DOMContentLoaded,
  and Brave detection requires an async network request, we add a small delay (500 ms)
  to ensure the variables are available and the request has time to complete.
  */
  setTimeout(() => {
    // Check for Brave first, since it requires an async callback
    detectBrave((isBrave) => {
        let mysticalBrowser;
        if (isBrave) {
            mysticalBrowser = "the valiant shields of Brave";
        } else {
            // If not Brave, check for Arc and other browsers
            mysticalBrowser = getMysticalBrowser(userAgent);
        }
        // Updates the HTML element with id "browser" to show the browser message with italics
        document.getElementById("browser").innerHTML =
            `🔮 The winds of the web carried you here via <i>${mysticalBrowser}</i>`;
    });
}, 500);
});
