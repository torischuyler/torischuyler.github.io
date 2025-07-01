/*
  📱💻 Device: This script fetches device (user agent) data and displays a friendly name.
*/

// Maps user agent substrings to friendly device names
const deviceMap = {
  iPhone: "a magical iPhone",
  Pixel: "a prismatic Pixel",
  "SM-S921B": "a galactic Samsung Galaxy",
  "SM-X710": "a galactic Samsung Galaxy",
  Android: "an enchanted Android",
  Windows: "a mystical Windows",
  iPad: "an irresistible iPad",
  Mac: "a charmed Mac",
  Linux: "a legendary Linux"
};

// Returns a friendly device name based on the user agent string
function getFriendlyDevice(userAgent) {
  return Object.keys(deviceMap).find(key => userAgent.includes(key))
    ? deviceMap[Object.keys(deviceMap).find(key => userAgent.includes(key))]
    : "a mysterious gadget";
}

// Updates device info on page load
document.addEventListener("DOMContentLoaded", () => {
  const friendlyDevice = getFriendlyDevice(navigator.userAgent);
  const deviceElement = document.getElementById("device-info");

  // Create content safely using textContent and DOM manipulation
  deviceElement.textContent = "🔮 Your device whispers: ";

  const italicElement = document.createElement("i");
  italicElement.textContent = `You're on ${friendlyDevice}`;
  deviceElement.appendChild(italicElement);
});
