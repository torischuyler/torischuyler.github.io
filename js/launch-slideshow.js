// js/launch-slideshow.js

document.addEventListener('DOMContentLoaded', () => {
  const images = Array.from(document.querySelectorAll('.launch-slideshow .slideshow-image'));
  const prevBtn = document.querySelector('.launch-slideshow .slideshow-prev');
  const nextBtn = document.querySelector('.launch-slideshow .slideshow-next');
  const caption = document.getElementById('launch-slideshow-caption');
  const counter = document.getElementById('launch-slideshow-counter');
  const slideshow = document.querySelector('.launch-slideshow');

  if (images.length === 0 || !prevBtn || !nextBtn) return;

  let currentIndex = images.findIndex((img) => img.classList.contains('is-active'));
  if (currentIndex < 0) currentIndex = 0;

  const showSlide = (index) => {
    if (index < 0 || index >= images.length) return;
    images.forEach((img, i) => {
      const isActive = i === index;
      img.classList.toggle('is-active', isActive);
      img.hidden = !isActive;
    });

    if (caption) {
      caption.textContent = images[index].dataset.caption || images[index].alt;
    }

    if (counter) {
      counter.textContent = `${index + 1} / ${images.length}`;
    }

    currentIndex = index;
  };

  const goToPrev = () => {
    showSlide((currentIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    showSlide((currentIndex + 1) % images.length);
  };

  prevBtn.addEventListener('click', goToPrev);
  nextBtn.addEventListener('click', goToNext);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  });

  if (slideshow) {
    let touchStartX = 0;

    slideshow.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    slideshow.addEventListener('touchend', (e) => {
      const swipeDistance = e.changedTouches[0].clientX - touchStartX;

      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
          goToPrev();
        } else {
          goToNext();
        }
      }
    }, { passive: true });
  }

  showSlide(currentIndex);
});