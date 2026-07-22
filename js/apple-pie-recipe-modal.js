// js/apple-pie-recipe-modal.js

const APPLE_PIE_RECIPES = {
  'pie-instructions': {
    title: 'Pie Instructions',
    body: `
      <p>Preheat oven to 375 °F. Arrange apple slices in crust. In a medium bowl, stir together the sugar, flour, and salt.
      Add the cream and egg, whisk until thoroughly combined. Pour the custard over the apples.
      Click the tree to see how to make the crisp topping!</p>
      <button type="button" class="pie-orchard-link pie-orchard-big" data-recipe-target="crisp-topping-instructions" aria-label="Open crisp topping instructions">🌳</button>
    `
  },
  'crisp-topping-instructions': {
    title: 'Crisp Topping Instructions',
    body: `
      <p>In a bowl, mix together sugars and flour. Cut in the butter with a fork until it resembles tiny pebbles.
      Spread over apples and custard. Sprinkle the top with cinnamon. Bake for 1 hour until apples are tender and topping is crisp.
      Let it cool and enjoy!</p>
      <button type="button" class="pie-orchard-link pie-orchard-big pie-orchard-close" aria-label="Finish and shake the tree">🍎</button>
    `
  }
};

function launchAppleOrchardShow() {
  const show = document.createElement('div');
  show.className = 'pie-orchard-show';
  document.body.appendChild(show);

  const tree = document.createElement('div');
  tree.className = 'pie-orchard-tree';
  tree.textContent = '🌳';
  tree.setAttribute('aria-hidden', 'true');
  show.appendChild(tree);

  const appleCount = 16;
  const spawnDelay = 90;
  const fallDurationMs = 2200;

  for (let i = 0; i < appleCount; i++) {
    setTimeout(() => {
      const apple = document.createElement('span');
      apple.className = 'pie-orchard-apple';
      apple.textContent = '🍎';
      apple.setAttribute('aria-hidden', 'true');

      const startLeft = 28 + Math.random() * 44;
      const drift = (Math.random() - 0.5) * 180;
      const spin = (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 540);
      const duration = 1.6 + Math.random() * 0.9;
      const size = 1.6 + Math.random() * 1.4;

      apple.style.left = `${startLeft}%`;
      apple.style.top = '28%';
      apple.style.fontSize = `${size}rem`;
      apple.style.setProperty('--drift', `${drift}px`);
      apple.style.setProperty('--spin', `${spin}deg`);
      apple.style.setProperty('--fall-duration', `${duration}s`);

      show.appendChild(apple);
    }, 280 + i * spawnDelay);
  }

  setTimeout(() => show.remove(), 280 + appleCount * spawnDelay + fallDurationMs);
}

function setApplePieRecipeModalContent(card, overlay, recipeKey, closeModal) {
  const recipe = APPLE_PIE_RECIPES[recipeKey];
  if (!recipe) return;

  card.innerHTML = `<h2>${recipe.title}</h2>${recipe.body}`;
  overlay.setAttribute('aria-label', recipe.title);

  card.querySelectorAll('.pie-orchard-link[data-recipe-target]').forEach((orchardButton) => {
    orchardButton.addEventListener('click', (e) => {
      e.stopPropagation();
      setApplePieRecipeModalContent(card, overlay, orchardButton.dataset.recipeTarget, closeModal);
    });
  });

  card.querySelectorAll('.pie-orchard-close').forEach((closeButton) => {
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      launchAppleOrchardShow();
      closeModal();
    });
  });
}

function showApplePieRecipeModal(recipeKey) {
  const recipe = APPLE_PIE_RECIPES[recipeKey];
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

  setApplePieRecipeModalContent(card, overlay, recipeKey, closeModal);

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
      showApplePieRecipeModal(button.dataset.recipe);
    });
  });
});
