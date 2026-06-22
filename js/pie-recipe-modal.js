// js/pie-recipe-modal.js

const PIE_RECIPES = {
  ingredients: {
    title: 'Ingredients',
    body: `
      <ul>
        <li>1 package pre-made pie crust (used both: one bottom, one top)</li>
        <li>4–6 cups blueberries</li>
        <li>¾ cup sugar</li>
        <li>4 Tbsp cornstarch</li>
        <li>A few shakes of cinnamon</li>
        <li>Milk</li>
      </ul>
    `
  },
  steps: {
    title: 'Steps',
    body: `
      <ol>
        <li><strong>Filling:</strong> Wash blueberries and drain excess liquid. Mix blueberries with sugar, cornstarch, and cinnamon in a large bowl. Heat in saucepan over medium, stirring constantly about 2 minutes until thickened and bubbly.</li>
        <li><strong>Assemble:</strong> Pour filling into unbaked bottom crust. Place second crust on top, cut slits for steam. Brush top with milk.</li>
        <li><strong>Bake:</strong> 350°F for 60 minutes until crust golden and filling is bubbling.</li>
        <li><strong>Cool:</strong> At least 1–2 hours before slicing for best set. Anthropomorphize your pie with whipped cream :)</li>
      </ol>
    `
  },
  iykyk: {
    title: 'IYKYK',
    body: `
      <ul>
        <li>Maine (my home state) official state berry is the blueberry, designated in 1991.</li>
        <li>Indigenous peoples of North America called wild blueberries “star fruits” ⭐️ because the blossom end of each berry forms a five-pointed star shape.</li>
        <li>People have been eating blueberries for more than 13,000 years, making them one of the oldest foods in the human diet on this continent.</li>
      </ul>
    `
  }
};

function showPieRecipeModal(recipeKey) {
  const recipe = PIE_RECIPES[recipeKey];
  if (!recipe || document.getElementById('pie-recipe-modal')) return;

  const overlay = document.createElement('div');
  overlay.id = 'pie-recipe-modal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', recipe.title);

  const card = document.createElement('div');
  card.className = 'pie-modal-card';
  card.innerHTML = `<h2>${recipe.title}</h2>${recipe.body}`;

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
      showPieRecipeModal(button.dataset.recipe);
    });
  });
});