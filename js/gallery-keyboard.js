// js/gallery-keyboard.js

document.addEventListener('DOMContentLoaded', () => {
  const radios = document.querySelectorAll('input[name="gallery"]');
  const radioArray = Array.from(radios);

  if (radioArray.length === 0) return; // Safety check if no gallery

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

    const currentIndex = radioArray.findIndex(r => r.checked);
    let newIndex;

    if (e.key === 'ArrowLeft') {
      newIndex = (currentIndex - 1 + radioArray.length) % radioArray.length;
    } else {
      newIndex = (currentIndex + 1) % radioArray.length;
    }

    radioArray[newIndex].checked = true;

    // Optional: Uncomment to prevent page scrolling on arrow keys
    // e.preventDefault();
  });
});
