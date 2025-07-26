// js/gallery-keyboard.js

document.addEventListener('DOMContentLoaded', () => {
  const radios = document.querySelectorAll('input[name="gallery"]');
  const radioArray = Array.from(radios);

  if (radioArray.length === 0) return; // Safety check if no gallery

  const galleryImages = document.querySelector('.gallery-images');
  let touchStartX = 0;

  galleryImages.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });

  galleryImages.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 50) { // Minimum swipe distance
      const currentIndex = radioArray.findIndex(r => r.checked);
      let newIndex;
      if (swipeDistance > 0) { // Swipe right
        newIndex = (currentIndex - 1 + radioArray.length) % radioArray.length;
      } else { // Swipe left
        newIndex = (currentIndex + 1) % radioArray.length;
      }
      radioArray[newIndex].checked = true;
    }
  });

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
