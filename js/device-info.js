/*
  📱💻 Device: This script contains a function that fetches device (user agent) data.
*/

// Defines a function that takes the raw userAgent string and returns a fun, friendly device name
function getFriendlyDevice(userAgent) {
  if (userAgent.includes("iPhone")) return "a magical iPhone";
  if (userAgent.includes("Android")) return "an enchanted Android";
  if (userAgent.includes("Windows")) return "a mystical Windows";
  if (userAgent.includes("Mac")) return "a charmed Mac";
  if (userAgent.includes("Linux")) return "a legendary Linux";

  // Fallback: returns a default name if no specific device type matches
  return "a mysterious gadget";
}

// Waits for the HTML document to be fully loaded before running the code
document.addEventListener("DOMContentLoaded", function() {

  // Gets the raw user agent string from the browser
  const userAgent = navigator.userAgent;

  // Sets friendlyDevice to the fun name we get from translating the raw userAgent
  const friendlyDevice = getFriendlyDevice(userAgent);

  // Updates the HTML element with id "device-info" to show the friendly device message
  document.getElementById("device-info").innerHTML = `🔮 Your device whispers: <i>You're on ${friendlyDevice}</i>`;
});
