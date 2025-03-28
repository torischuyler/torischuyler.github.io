/*
  📍 Location: This script contains a function that fetches visitor location data.
*/

// Function to fetch location data
async function getVisitorLocation() {

  // "Try" is like a safety net—it runs code and catches any errors so the program doesn’t crash.
  try {

      // Sets a variable 'response' to hold location data fetched from ipapi.co in JSON format, waiting until the data arrives.
      const response = await fetch('https://ipapi.co/json/');

      // Sets a variable 'data' to store the JSON data extracted from the response, waiting until it’s fully processed.
      const data = await response.json();

      // Pulls out the region and country from 'data'; uses 'unknown region' or 'unknown country' if the API doesn’t provide them.
      const region = data.region || 'unknown region';
      const country = data.country_name || 'unknown country';

      // Update the HTML with the location
      document.getElementById('location').textContent =
          `🔮 I see you hailing from ${region}, ${country}… or perhaps a mystical nearby realm`;

  // If something goes wrong in the 'try' block, 'catch' grabs the error so we can handle it nicely.
  } catch (error) {

      // Logs the error to the console for developers to see in dev tools, not visible to regular visitors.
      console.error('Error fetching location:', error);

      // Updates the HTML with a friendly message for visitors to see in the UI if the location fetch fails.
      document.getElementById('location').textContent =
          `🔮 The spirits couldn't pinpoint you… somewhere mysterious, I wager`;
  }
}

// Call the function when the page loads
window.onload = getVisitorLocation;
