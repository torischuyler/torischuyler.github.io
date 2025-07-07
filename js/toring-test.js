// Toring Test interactivity
const toringLink = document.querySelector('.toring-link');
const modal = document.getElementById('toringModal');
const closeBtn = document.querySelector('.close-btn');
const gridItems = document.querySelectorAll('.grid-item');
let selectedToriCount = 0;

toringLink.addEventListener('click', () => {
  modal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

gridItems.forEach(item => {
  item.addEventListener('click', () => {
    if (item.classList.contains('selected')) return;

    const imgSrc = item.querySelector('img').src;
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    if (imgSrc.includes('1-toring-test') || imgSrc.includes('2-toring-test') ||
        imgSrc.includes('3-toring-test') || imgSrc.includes('4-toring-test') ||
        imgSrc.includes('5-toring-test') || imgSrc.includes('6-toring-test') ||
        imgSrc.includes('7-toring-test')) {
      overlay.innerHTML = '✔';
      overlay.className += ' checkmark';
      selectedToriCount++;
      if (selectedToriCount === 7) {
        setTimeout(showSuccessPopup, 500);
      }
    } else {
      overlay.innerHTML = '✖';
      overlay.className += ' cross';
    }

    item.classList.add('selected');
    item.appendChild(overlay);
  });
});

function showSuccessPopup() {
  modal.style.display = 'none';
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = `
    <div class="popup-content">
      <h2>Congratulations...</h2>
      <p>You're a human!</p>
      <p><i>(Disclaimer: Test results not guaranteed.)</i></p>
      <button class="close-popup-btn">Close</button>
    </div>
  `;
  document.body.appendChild(popup);

  const closeButton = popup.querySelector('.close-popup-btn');
  closeButton.addEventListener('click', closePopup);
}

function closePopup() {
  document.querySelector('.popup').remove();
}
