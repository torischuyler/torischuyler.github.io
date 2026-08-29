// Swap the text cursor for an emoji once it finishes blinking
document.querySelectorAll('h2').forEach(heading => {
  heading.addEventListener('animationend', event => {
    if (event.animationName === 'blink') {
      heading.classList.add('typed');
    }
  });
});
