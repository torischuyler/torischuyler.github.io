/*
  Footer: JavaScript
  Automatically updates the year in the site's footer.
*/

document.addEventListener('DOMContentLoaded', () => {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  } else {
    console.warn('Element with ID "year" not found.');
  }
});
