/*
  PiDog corner pet prototype — Slugger sprite + canned bubble on /til/pidog.
  Dismiss collapses to a mini launcher (always reopenable). Refresh shows him again.
*/

(function initPidogPet() {
  const ENTER_DELAY_MS = 900;

  // Clear older dismiss flag so a refresh always brings Slugger back.
  try {
    sessionStorage.removeItem('pidog-pet-dismissed');
  } catch {
    // ignore
  }

  const TRICKS = [
    {
      id: 'speak',
      label: 'Speak',
      className: 'is-speak',
      duration: 1400,
      line: 'Arf! Arf!',
      href: '/til/pidog/tricks/speak.html',
      labButton: 'See speak trick page',
    },
    {
      id: 'spin',
      label: 'Spin',
      className: 'is-spin',
      duration: 1100,
      line: 'Superdog spin!',
      href: '/til/pidog/tricks/superdog.html',
      labButton: 'See superdog trick page',
    },
    {
      id: 'howl',
      label: 'Howl',
      className: 'is-howl',
      duration: 1500,
      line: 'Awoooo!',
      href: '/til/pidog/tricks/howl.html',
      labButton: 'See howl trick page',
    },
    {
      id: 'patrol',
      label: 'Patrol',
      className: 'is-patrol',
      duration: 1600,
      line: 'On patrol…',
      href: '/til/pidog/tricks/patrol.html',
      labButton: 'See patrol trick page',
    },
    {
      id: 'sit',
      label: 'Sit',
      className: 'is-sit',
      duration: 1400,
      line: 'Sit. Good boy.',
      href: '/til/pidog/tricks/demo.html',
      labButton: 'See sit trick page',
    },
    {
      id: 'pushups',
      label: 'Push-ups',
      className: 'is-pushups',
      duration: 1350,
      line: 'Push-ups! One… two… three!',
      href: '/til/pidog/tricks/push-ups.html',
      labButton: 'See push-ups trick page',
    },
  ];

  const PROMPT_LINE = 'Hey, wanna see a trick?';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const root = document.createElement('aside');
  root.className = 'pidog-pet';
  root.setAttribute('aria-label', 'Slugger');
  root.innerHTML = `
    <div class="pidog-pet-bubble" role="status">
      <button type="button" class="pidog-pet-close" aria-label="Hide Slugger">&times;</button>
      <p class="pidog-pet-line">${PROMPT_LINE}</p>
      <div class="pidog-pet-actions" data-panel="prompt">
        <button type="button" class="pidog-pet-action" data-action="choose">Yes!</button>
        <button type="button" class="pidog-pet-action" data-action="later">Maybe later</button>
      </div>
      <div class="pidog-pet-actions" data-panel="chooser" hidden>
        ${TRICKS.map((trick) => (
          `<button type="button" class="pidog-pet-action" data-action="trick" data-trick="${trick.id}">${trick.label}</button>`
        )).join('')}
        <button type="button" class="pidog-pet-action" data-action="later">Maybe later</button>
      </div>
      <div class="pidog-pet-actions" data-panel="after" hidden>
        <button type="button" class="pidog-pet-action" data-action="choose">Pick another trick</button>
        <button type="button" class="pidog-pet-action" data-action="lab">See trick page</button>
      </div>
    </div>
    <div class="pidog-pet-stage" tabindex="0" role="button" aria-label="Ask Slugger for a trick">
      <img
        class="pidog-pet-sprite"
        src="/assets/images/pidog/slugger/pet.png"
        width="127"
        height="140"
        alt=""
        decoding="async"
      >
    </div>
  `;

  const closeBtn = root.querySelector('.pidog-pet-close');
  const stage = root.querySelector('.pidog-pet-stage');
  const lineEl = root.querySelector('.pidog-pet-line');
  const promptPanel = root.querySelector('[data-panel="prompt"]');
  const chooserPanel = root.querySelector('[data-panel="chooser"]');
  const afterPanel = root.querySelector('[data-panel="after"]');
  const labBtn = afterPanel.querySelector('[data-action="lab"]');
  let trickTimer = null;
  let busy = false;
  let collapsed = false;
  let lastTrick = TRICKS[0];

  function setLine(text) {
    lineEl.textContent = text;
  }

  function showPanel(panel) {
    promptPanel.hidden = panel !== 'prompt';
    chooserPanel.hidden = panel !== 'chooser';
    afterPanel.hidden = panel !== 'after';
  }

  function resetPrompt() {
    clearTrickClasses();
    busy = false;
    setLine(PROMPT_LINE);
    showPanel('prompt');
  }

  function showChooser() {
    if (busy) return;
    setLine('Pick a trick:');
    showPanel('chooser');
  }

  function expand() {
    collapsed = false;
    root.classList.remove('is-collapsed');
    stage.setAttribute('aria-label', 'Ask Slugger for a trick');
    resetPrompt();
  }

  function collapse() {
    if (collapsed) return;
    collapsed = true;
    clearTimeout(trickTimer);
    clearTrickClasses();
    busy = false;
    root.classList.add('is-collapsed');
    stage.setAttribute('aria-label', 'Show Slugger');
  }

  function clearTrickClasses() {
    TRICKS.forEach((trick) => {
      root.classList.remove(trick.className);
    });
    root.classList.remove('is-busy');
  }

  function doTrick(trick) {
    if (collapsed || busy || !trick) return;

    lastTrick = trick;
    busy = true;
    clearTimeout(trickTimer);
    clearTrickClasses();

    setLine(trick.line);
    showPanel(null);
    root.classList.add('is-busy');

    if (!reduceMotion) {
      void root.offsetWidth;
      root.classList.add(trick.className);
    }

    trickTimer = window.setTimeout(() => {
      clearTrickClasses();
      busy = false;
      setLine('Nice! What next?');
      labBtn.dataset.href = trick.href;
      labBtn.textContent = trick.labButton;
      showPanel('after');
    }, reduceMotion ? 400 : trick.duration);
  }

  function trickById(id) {
    return TRICKS.find((trick) => trick.id === id);
  }

  closeBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    collapse();
  });

  root.querySelector('.pidog-pet-bubble').addEventListener('click', (event) => {
    const button = event.target.closest('.pidog-pet-action');
    if (!button) return;
    event.stopPropagation();

    const action = button.dataset.action;
    if (action === 'choose') {
      showChooser();
      return;
    }
    if (action === 'later') {
      collapse();
      return;
    }
    if (action === 'lab') {
      window.location.href = button.dataset.href || lastTrick.href;
      return;
    }
    if (action === 'trick') {
      doTrick(trickById(button.dataset.trick));
    }
  });

  stage.addEventListener('click', () => {
    if (collapsed) {
      expand();
      return;
    }
    showChooser();
  });

  stage.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (collapsed) {
        expand();
        return;
      }
      showChooser();
    }
  });

  document.body.appendChild(root);

  window.setTimeout(() => {
    root.classList.add('is-visible');
  }, ENTER_DELAY_MS);
}());
