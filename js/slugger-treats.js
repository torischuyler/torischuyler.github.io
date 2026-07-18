/*
  Slugger's Treat Bowl: JavaScript
  Click a button to toss a bone, Sea Dog Biscuit, or ball into Slugger's bowl.
  The bowl starts fresh on every page load. Each treat plays its own bark.

  Bark recordings (trimmed/edited), via Wikimedia Commons:
  - woof-bone.mp3: "Perro ladrando" by Armartinell, CC BY-SA 4.0
  - woof-biscuit.mp3: "Barking of a dog" by Amada44, CC BY-SA 3.0 (pitched up)
  - woof-ball.mp3: "Barking of a dog 2" by Amada44, CC BY-SA 3.0
*/

document.addEventListener('DOMContentLoaded', () => {
  const bowlItems = document.getElementById('treat-bowl-items');
  const emptyNote = document.getElementById('treat-bowl-empty');
  const reaction = document.getElementById('treat-reaction');
  const buttons = document.querySelectorAll('.treat-btn');

  if (!bowlItems || buttons.length === 0) return;

  // Keep the bowl from overflowing visually; counts keep climbing forever.
  const MAX_VISIBLE_PER_TYPE = 10;

  const TREATS = {
    bone: {
      emoji: '🦴',
      reactions: [
        'Woof! Crunch crunch. 🐾',
        'A bone?! Best. Day. EVER. 🐶',
        'Slugger buries it for later. 🕳️',
      ],
    },
    biscuit: {
      emoji: '🍪',
      reactions: [
        'Slugger drools in binary. 🤖',
      ],
    },
    ball: {
      emoji: '⚾',
      reactions: [
        'Squeak! Slugger pounces. 🐕',
        'Fetch mode: activated. 🤖',
        '*zoomies intensify* 💨',
      ],
    },
  };

  const counts = { bone: 0, biscuit: 0, ball: 0 };

  /* ---------- Treat sounds (real barks) ---------- */

  const SOUNDS = {
    bone: new Audio('/assets/audio/pidog/woof-bone.mp3'),
    biscuit: new Audio('/assets/audio/pidog/woof-biscuit.mp3'),
    ball: new Audio('/assets/audio/pidog/woof-ball.mp3'),
  };

  for (const audio of Object.values(SOUNDS)) {
    audio.preload = 'auto';
  }

  function playSound(type) {
    const audio = SOUNDS[type];
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Play comes from a click, so this should never be blocked; ignore if it is.
    });
  }

  /* ---------- Bowl, tallies, and reactions ---------- */

  function visibleCount(type) {
    return bowlItems.querySelectorAll(`[data-treat-item="${type}"]`).length;
  }

  function addItemToBowl(type) {
    if (visibleCount(type) >= MAX_VISIBLE_PER_TYPE) return;

    const item = document.createElement('span');
    item.className = 'treat-item dropping';
    item.dataset.treatItem = type;
    item.textContent = TREATS[type].emoji;
    item.style.left = `${8 + Math.random() * 78}%`;
    item.style.bottom = `${10 + Math.random() * 38}%`;
    item.style.transform = `rotate(${Math.round(Math.random() * 50 - 25)}deg)`;
    item.addEventListener('animationend', () => item.classList.remove('dropping'));

    bowlItems.appendChild(item);
  }

  function updateTallies() {
    for (const type of Object.keys(counts)) {
      const el = document.getElementById(`tally-${type}`);
      if (el) el.textContent = counts[type];
    }
    if (emptyNote) {
      const total = counts.bone + counts.biscuit + counts.ball;
      emptyNote.hidden = total > 0;
    }
  }

  function showReaction(type) {
    if (!reaction) return;
    const lines = TREATS[type].reactions;
    reaction.textContent = lines[Math.floor(Math.random() * lines.length)];
    reaction.classList.remove('pop');
    void reaction.offsetWidth; // restart the animation
    reaction.classList.add('pop');
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.treat;
      if (!TREATS[type]) return;

      counts[type] += 1;
      addItemToBowl(type);
      updateTallies();
      showReaction(type);
      playSound(type);
    });
  });
});
