/*
  ⏳ Time: This script contains a function that fetches and displays the visitor's local time and time zone.
*/

// Waits for the HTML document to be fully loaded before running the code
document.addEventListener("DOMContentLoaded", function() {

  // Creates a new Date object to get the current local time of the visitor
  const now = new Date();

  // Formats the time into a readable string (e.g., "3:44:18 AM") using the visitor's locale
  const timeString = now.toLocaleTimeString();

  // Gets the time zone name (e.g., "America/New_York" or "Eastern Standard Time") using Intl.DateTimeFormat
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Updates the HTML element with id "time" to show the visitor's local time and time zone
  document.getElementById("time").textContent =
      `🔮 The sands of time say you arrived here at ${timeString} from the zone of ${timeZone}`;
});
