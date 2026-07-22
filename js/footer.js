/*
  Footer: JavaScript
  Automatically updates the year in the site's footer
  and adds the Hubble header image credit (CC BY 4.0).
*/

document.addEventListener('DOMContentLoaded', () => {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  } else {
    console.warn('Element with ID "year" not found.');
  }

  const footer = document.querySelector('footer');
  if (footer && !footer.querySelector('.image-credit')) {
    const credit = document.createElement('p');
    credit.className = 'image-credit';
    credit.innerHTML =
      'Header image: ' +
      '<a href="https://esahubble.org/images/heic1501a/" rel="noopener noreferrer">' +
      'Pillars of Creation (M16)</a>' +
      ' — NASA, ESA/Hubble and the Hubble Heritage Team';
    footer.appendChild(credit);
  }
});
