/*
  🌐 Browser: This script detects and displays the visitor's browser in a mystical way.
*/

// Function to detect if the browser is Arc using CSS variables
function detectArc() {
  return getComputedStyle(document.documentElement).getPropertyValue('--arc-palette-title').trim() !== '';
}

// Returns a fun, browser-specific message based on the userAgent string
function getMysticalBrowser(userAgent) {
  if (detectArc()) return "the radiant arcs of Arc";
  if (/Edg/i.test(userAgent)) return "the sharp edges of Edge";
  if (/Chrome/i.test(userAgent)) return "the gleaming paths of Chrome";
  if (/Safari/i.test(userAgent)) return "the wild orchards of Safari (or you're on an iPhone and it's all one big Safari 😂)";
  if (/Firefox/i.test(userAgent)) return "the fiery trails of Firefox";
  return "an unseen web whisperer";
}

// Updates the browser display once the DOM and CSS are ready
document.addEventListener("DOMContentLoaded", () => {
  const userAgent = navigator.userAgent;
  // Use requestAnimationFrame to ensure CSS variables are loaded
  requestAnimationFrame(() => {
    const mysticalBrowser = getMysticalBrowser(userAgent);
    document.getElementById("browser").innerHTML =
      `🔮 The winds of the web carried you here via <i>${mysticalBrowser}</i>`;
  });
});
