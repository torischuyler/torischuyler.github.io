/*
  🌐 Browser: This script detects and displays the visitor's browser in a mystical way.
*/

// Function to detect if the browser is Arc by checking for Arc-specific CSS variables
function detectArc() {
  const arcVariable = getComputedStyle(document.documentElement).getPropertyValue('--arc-palette-title').trim();
  return arcVariable !== '';
}

// Function to detect if the browser is Brave by checking if it blocks tracking requests, with a more specific user agent check
function detectBrave(callback, userAgent) {
  // Rule out non-Chromium browsers and specific Chromium browsers that are not Brave
  /* eslint-disable no-console */
  if (userAgent.includes("Firefox")) {
      console.log('User agent indicates Firefox - not Brave');
      setTimeout(() => callback(false), 0);
      return;
  }
  if (userAgent.includes("Safari") && userAgent.includes("Version/")) {
      console.log('User agent indicates true Safari - not Brave');
      setTimeout(() => callback(false), 0);
      return;
  }
  if (userAgent.includes("Edg/")) {
      console.log('User agent indicates Edge - not Brave');
      setTimeout(() => callback(false), 0);
      return;
  }
  if (userAgent.includes("OPR/")) {
      console.log('User agent indicates Opera - not Brave');
      setTimeout(() => callback(false), 0);
      return;
  }
  if (userAgent.includes("SamsungBrowser/")) {
      console.log('User agent indicates Samsung Internet - not Brave');
      setTimeout(() => callback(false), 0);
      return;
  }
  if (userAgent.includes("UCBrowser/")) {
      console.log('User agent indicates UC Browser - not Brave');
      setTimeout(() => callback(false), 0);
      return;
  }
  if (userAgent.includes("YaBrowser/")) {
      console.log('User agent indicates Yandex Browser - not Brave');
      setTimeout(() => callback(false), 0);
      return;
  }

  // Confirm it's a Chromium-based browser
  if (!userAgent.includes("Chrome")) {
      console.log('User agent does not indicate a Chromium-based browser - not Brave');
      setTimeout(() => callback(false), 0);
      return;
  }

  // Create an image element to attempt loading a resource from a tracking domain
  const img = new Image();
  // Load a resource from doubleclick.net, a tracking domain that Brave Shields blocks by default
  img.src = 'https://doubleclick.net/favicon.ico?' + new Date().getTime();

  // Set a 2-second timeout to determine if the request was blocked
  const timeout = setTimeout(() => {
      console.log('Timeout reached - request likely blocked, and user agent is Chromium-based - likely Brave');
      callback(true);
  }, 2000);

  img.onload = () => {
      clearTimeout(timeout);
      console.log('Image loaded successfully - not Brave (or Shields disabled)');
      callback(false);
  };

  img.onerror = () => {
      clearTimeout(timeout);
      console.log('Image failed to load - request likely blocked, and user agent is Chromium-based - likely Brave');
      callback(true);
  };
  /* eslint-enable no-console */
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
  if (userAgent.includes("Safari")) return "the wild orchards of Safari (or you're on an iPhone and it's all one big Safari 😂)";
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
      and Brave detection requires an async network request, we add a small delay to ensure
      the variables are available and the request has time to complete.
  */
  setTimeout(() => {
      // Check for Brave first, since it requires an async callback
      detectBrave((isBrave) => {
          let mysticalBrowser;
          let disclaimer = "";
          if (isBrave) {
              mysticalBrowser = "the valiant shields of Brave";
              disclaimer = " (or so the spirits tell me—perhaps you wield another shield of privacy?)";
          } else {
              // If not Brave, check for Arc and other browsers
              mysticalBrowser = getMysticalBrowser(userAgent);
          }
          // Updates the HTML element with id "browser" to show the browser message with italics
          document.getElementById("browser").innerHTML =
              `🔮 The winds of the web carried you here via <i>${mysticalBrowser}</i>${disclaimer}`;
      }, userAgent); // Pass userAgent to detectBrave
  }, 500);
});
