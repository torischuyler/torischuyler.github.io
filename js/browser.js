/*
  🌐 Browser: This script detects and displays the visitor's browser in a mystical way.
*/

// Defines a function that takes the raw userAgent string and returns a fun, browser-specific message
function getMysticalBrowser(userAgent) {
  if (userAgent.includes("Tor")) return "the shadowed veils of Tor";
  if (userAgent.includes("Brave")) return "the valiant shields of Brave";
  if (userAgent.includes("Arc")) return "the radiant arcs of Arc";
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
  // Sets mysticalBrowser to the fun name we get from translating the raw userAgent
  const mysticalBrowser = getMysticalBrowser(userAgent);
  // Updates the HTML element with id "browser" to show the browser message with italics
  document.getElementById("browser").innerHTML =
      `🔮 The winds of the web carried you here via <i>${mysticalBrowser}</i>`;
});
