// js/fourth-of-july-pie-recipe-modal.js

const FOURTH_OF_JULY_PIE_RECIPES = {
  'pie-instructions': {
    title: 'Pie Instructions',
    body: `
      <p>Preheat oven to 400 °F. Rinse and dry blueberries. In a large bowl, mix together sugar, flour, and blueberries. 
      Put blueberries into a saucepan over medium heat, continually stir for 2 mins. Pour filling into the pie crust. 
      Click the fireworks to see how to make the crisp topping!</p>
      <button type="button" class="pie-fireworks-link pie-fireworks-big" data-recipe-target="crisp-topping-instructions" aria-label="Open crisp topping instructions">🎆</button>
    `
  },
  'crisp-topping-instructions': {
    title: 'Crisp Topping Instructions',
    body: `
      <p>In a bowl, mix together sugars and flour. Cut in the butter with a fork until it resembles tiny pebbles. 
      Sprinkle crisp topping over the top of pie. Bake for 50 mins, until filling is bubbling and topping is crisp. 
      Let it cool and enjoy!</p>
      <button type="button" class="pie-fireworks-link pie-fireworks-big pie-fireworks-close" aria-label="Finish and celebrate">🎇</button>
    `
  }
};

function launchPieFireworksShow() {
  const show = document.createElement('div');
  show.className = 'pie-fireworks-show';
  document.body.appendChild(show);

  const colors = ['#ff4d4d', '#fff', '#4d79ff', '#ffd24d', '#ff66cc'];
  const burstCount = 8;
  const burstDelay = 220;
  const particlesPerBurst = 16;

  for (let i = 0; i < burstCount; i++) {
    setTimeout(() => {
      const burst = document.createElement('div');
      burst.className = 'pie-firework-burst';
      burst.style.left = `${8 + Math.random() * 84}%`;
      burst.style.top = `${10 + Math.random() * 55}%`;

      for (let j = 0; j < particlesPerBurst; j++) {
        const particle = document.createElement('span');
        particle.className = 'pie-firework-particle';
        const angle = (Math.PI * 2 * j) / particlesPerBurst;
        const distance = 70 + Math.random() * 80;
        particle.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        burst.appendChild(particle);
      }

      show.appendChild(burst);
    }, i * burstDelay);
  }

  setTimeout(() => show.remove(), burstCount * burstDelay + 1400);
}

function setFourthOfJulyPieRecipeModalContent(card, overlay, recipeKey, closeModal) {
  const recipe = FOURTH_OF_JULY_PIE_RECIPES[recipeKey];
  if (!recipe) return;

  card.innerHTML = `<h2>${recipe.title}</h2>${recipe.body}`;
  overlay.setAttribute('aria-label', recipe.title);

  card.querySelectorAll('.pie-fireworks-link[data-recipe-target]').forEach((fireworksButton) => {
    fireworksButton.addEventListener('click', (e) => {
      e.stopPropagation();
      setFourthOfJulyPieRecipeModalContent(card, overlay, fireworksButton.dataset.recipeTarget, closeModal);
    });
  });

  card.querySelectorAll('.pie-fireworks-close').forEach((closeButton) => {
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      launchPieFireworksShow();
      closeModal();
    });
  });
}

function showFourthOfJulyPieRecipeModal(recipeKey) {
  const recipe = FOURTH_OF_JULY_PIE_RECIPES[recipeKey];
  if (!recipe || document.getElementById('pie-recipe-modal')) return;

  const overlay = document.createElement('div');
  overlay.id = 'pie-recipe-modal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  const card = document.createElement('div');
  card.className = 'pie-modal-card';
  card.addEventListener('click', (e) => e.stopPropagation());

  const closeModal = () => {
    overlay.classList.remove('is-visible');
    document.body.classList.remove('pie-modal-open');

    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.removeEventListener('keydown', handleEscape);
    }, 200);
  };

  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  setFourthOfJulyPieRecipeModalContent(card, overlay, recipeKey, closeModal);

  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', handleEscape);

  overlay.appendChild(card);
  document.body.appendChild(overlay);
  document.body.classList.add('pie-modal-open');

  requestAnimationFrame(() => {
    overlay.classList.add('is-visible');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.pie-recipe-link').forEach((button) => {
    button.addEventListener('click', () => {
      showFourthOfJulyPieRecipeModal(button.dataset.recipe);
    });
  });
});
