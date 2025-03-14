/*
  🍔 Mobile Nav: JavaScript

  This script lets you tap the hamburger menu on mobile to show
  and interact with the navigation links.
*/

// Finds the hamburger menu button (the ☰ icon) on the page
const hamburger = document.querySelector('.hamburger');

// Finds the navigation menu (the list of links) on the page
const navMenu = document.querySelector('.nav-menu');

// Listens for a click on the hamburger button
hamburger.addEventListener('click', function() {

// Shows or hides the menu by adding/removing the 'active' class
navMenu.classList.toggle('active');
});
