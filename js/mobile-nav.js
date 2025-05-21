/*
  🍔 Mobile Nav: JavaScript
  Toggles the navigation menu on mobile when the hamburger icon is clicked.
*/

// Select DOM elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Toggle menu visibility on hamburger click
hamburger?.addEventListener('click', () => {
  navMenu?.classList.toggle('active');
});
