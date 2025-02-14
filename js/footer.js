/*
Footer: JavaScript

This script automatically updates the year in the site's footer.
*/

// Add event listener to wait for the DOM to be fully loaded.
document.addEventListener('DOMContentLoaded', updateFooterYear);

// Define the function to update the footer year.
function updateFooterYear() {

    // Try to find the element with ID 'year'.
    const yearElement = document.getElementById('year');
    
    // Check if the year element exists.
    if (yearElement) {

        // Update the text content of the year element with the current year.
        yearElement.textContent = new Date().getFullYear();

    // Log a warning if the year element isn't found.
    } else {
        console.warn('Element with ID "year" not found in the DOM.');
    }
}