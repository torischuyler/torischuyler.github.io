/*
Footer: JavaScript

This code is a simple but useful JavaScript snippet that automatically updates 
the year in the website's footer. It works by:
    1. Waiting for the page to fully load (DOMContentLoaded event).
    2. Finding an HTML element with the ID "year."
    3. Setting its text content to the current year (e.g., 2025).

This is a common pattern used in website footers so you don't have to manually 
update the copyright year each January. The code will automatically 
display the current year whenever the page loads.
*/

// Wait for DOM to be fully loaded before executing the footer year update function.
document.addEventListener('DOMContentLoaded', updateFooterYear);

// Function to update the year in the footer.
function updateFooterYear() {
    // Try to find the element with ID 'year' in the DOM and store it.
    const yearElement = document.getElementById('year');
    
    // Check if the element exists before attempting to modify it.
    if (yearElement) {
        // Set the element's text content to the current year (e.g., 2025).
        yearElement.textContent = new Date().getFullYear();
    } else {
        // Log a warning if the year element isn't found in the DOM.
        console.warn('Element with ID "year" not found in the DOM.');
    }
}