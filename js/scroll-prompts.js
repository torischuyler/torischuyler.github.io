/*
  🪄 HTML and CSS ASCII blueprint prompts: shows the prompts on homepage only after scrolling to the bottom of the page.
*/

// Listens for scroll events to toggle visibility of HTML and CSS prompts.
window.addEventListener('scroll', function () {

  // Selects the HTML prompt element and assigns it to a constant for visibility toggling.
  const htmlPrompt = document.querySelector('.html-prompt');

  // Selects the CSS prompt element and assigns it to a constant for visibility toggling.
  const cssPrompt = document.querySelector('.css-prompt');

  /*
    Calculates the bottom of the viewport and assigns it to a constant to store the visitor's scroll position
    to be able to determine if they have scrolled to the bottom of the page.

    - window.scrollY: This property returns the number of pixels the document has been scrolled vertically from the top.
      For example, if the visitor hasn’t scrolled at all, window.scrollY is 0; if they’ve scrolled down 500 pixels, it’s 500.

    - window.innerHeight: This property returns the height of the viewport (the visible area of the browser window) in pixels.
      For example, on a mobile device, this might be around 667px (depending on the device and browser UI).

    - window.scrollY + window.innerHeight: This calculates the position of the bottom of the viewport relative to the top of the
    document. Essentially, it tells us how far down the page the bottom of the visitor’s screen is. For example, if window.scrollY
    is 500 and window.innerHeight is 667, then scrollPosition is 500 + 667 = 1167, meaning the bottom of the viewport is 1167
    pixels from the top of the document.
  */
  const scrollPosition = window.scrollY + window.innerHeight;

  // Retrieves the total document height and assigns it to a constant for scroll comparison.
  const documentHeight = document.documentElement.scrollHeight;

  // If the scroll position is at least the document height minus 50px, we're near the bottom, so let’s show the prompts!
  if (scrollPosition >= documentHeight - 50) {
    htmlPrompt.style.display = 'block';
    cssPrompt.style.display = 'block';

  // Since we're not near the bottom (within 50px), let’s hide the prompts!
  } else {
    htmlPrompt.style.display = 'none';
    cssPrompt.style.display = 'none';
  }
});
