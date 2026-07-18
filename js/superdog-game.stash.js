/*
  STASHED — Sea Dog Biscuit Dodge (not loaded on the live page).
  To restore: paste the HTML fragment from
  til/pidog/tricks/stash/biscuit-dodge.fragment.html into superdog.html,
  link css/superdog-game.stash.css, and load this script after superdog.js
  (or merge back into superdog.js and call initBiscuitDodge on DOMContentLoaded).
*/

document.addEventListener('DOMContentLoaded', () => {
  if (typeof initBiscuitDodge === 'function') initBiscuitDodge();
});

const QUESTIONS = [
  {
    prompt: 'Force equals mass times… what?',
    choices: ['Velocity', 'Acceleration', 'Distance', 'Temperature'],
    answer: 1,
    explain: 'Newton’s second law: F = m·a. Bigger force or smaller mass → more acceleration.',
  },
  {
    prompt: 'On Earth, gravity pulls objects…',
    choices: ['Toward the Moon', 'Toward Earth’s center', 'Only sideways', 'Only when they are heavy'],
    answer: 1,
    explain: 'Gravity pulls toward Earth’s center. “Down” is just the local direction of that pull.',
  },
  {
    prompt: 'Krypton (element 36) is which type of element?',
    choices: ['Alkali metal', 'Halogen', 'Noble gas', 'Lanthanide'],
    answer: 2,
    explain: 'Noble gases (He, Ne, Ar, Kr, Xe, Rn…) have full outer shells and rarely react.',
  },
  {
    prompt: 'Speed is how fast you go. Velocity also includes…',
    choices: ['Color', 'Direction', 'Temperature', 'Mass'],
    answer: 1,
    explain: 'Velocity is a vector: speed + direction. Flying north at 10 m/s ≠ flying south at 10 m/s.',
  },
  {
    prompt: 'If Slugger flies at constant velocity, the net force on him is…',
    choices: ['Huge', 'Zero', 'Equal to his weight only', 'Infinite'],
    answer: 1,
    explain: 'No net force means no acceleration — constant velocity (Newton’s first law).',
  },
  {
    prompt: 'Potential energy is energy of…',
    choices: ['Position / configuration', 'Only heat', 'Only sound', 'Random guessing'],
    answer: 0,
    explain: 'A biscuit held high has gravitational potential energy that can become kinetic energy if it falls.',
  },
  {
    prompt: 'Every action force has…',
    choices: ['No reaction', 'An equal and opposite reaction', 'A weaker reaction', 'A louder reaction'],
    answer: 1,
    explain: 'Newton’s third law: forces come in pairs. Push the air back, the air pushes you forward.',
  },
  {
    prompt: 'Light in a vacuum travels at about…',
    choices: ['340 m/s', '3×10⁸ m/s', '3 m/s', 'The speed of sound squared'],
    answer: 1,
    explain: 'c ≈ 300,000,000 m/s. Nothing with mass reaches that speed.',
  },
  {
    prompt: 'A noble gas is “noble” mainly because it…',
    choices: ['Costs a lot', 'Rarely forms chemical bonds', 'Is always radioactive', 'Is always solid'],
    answer: 1,
    explain: 'Full valence shells make noble gases chemically snobby — they prefer not to react.',
  },
  {
    prompt: 'In programming, a variable is best described as…',
    choices: ['A named box for a value', 'A type of cookie', 'A forever-fixed number', 'A Wi-Fi password'],
    answer: 0,
    explain: 'Variables store values you can read and update — like `score = 3`.',
  },
  {
    prompt: 'A function (or method) is mainly for…',
    choices: ['Decorating CSS only', 'Reusing a chunk of named behavior', 'Deleting the internet', 'Storing images forever'],
    answer: 1,
    explain: 'Functions package steps you can call again — `dodgeBiscuit()` instead of copy-paste chaos.',
  },
  {
    prompt: 'Kinetic energy depends on mass and…',
    choices: ['Only color', 'Speed (velocity squared)', 'Only height', 'Atomic number'],
    answer: 1,
    explain: 'KE = ½mv². Double the speed, quadruple the kinetic energy.',
  },
  {
    prompt: 'Friction usually…',
    choices: ['Speeds you up forever', 'Opposes sliding motion', 'Creates noble gases', 'Deletes mass'],
    answer: 1,
    explain: 'Friction fights relative motion — why skidding eventually stops (and why landings need care).',
  },
  {
    prompt: 'Which best describes acceleration?',
    choices: ['Any change in velocity', 'Only speeding up', 'Only turning left', 'Standing still forever'],
    answer: 0,
    explain: 'Speed up, slow down, or change direction — all are acceleration.',
  },
  {
    prompt: 'Why do we often mute autoplaying videos on websites?',
    choices: ['Browsers block loud surprise audio', 'Videos cannot make sound', 'CSS forbids volume', 'Gravity eats the speakers'],
    answer: 0,
    explain: 'Autoplay with sound is usually blocked. Muted autoplay + a controls attribute is the friendly pattern.',
  },
];

function initBiscuitDodge() {
  const canvas = document.getElementById('sd-canvas');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('sd-score');
  const livesEl = document.getElementById('sd-lives');
  const bestEl = document.getElementById('sd-best');
  const bestWrap = document.getElementById('sd-best-wrap');
  const startOverlay = document.getElementById('sd-start-overlay');
  const quizOverlay = document.getElementById('sd-quiz-overlay');
  const overOverlay = document.getElementById('sd-over-overlay');
  const startBtn = document.getElementById('sd-start-btn');
  const retryBtn = document.getElementById('sd-retry-btn');
  const quizPrompt = document.getElementById('sd-quiz-prompt');
  const quizChoices = document.getElementById('sd-quiz-choices');
  const quizFeedback = document.getElementById('sd-quiz-feedback');
  const reflectBox = document.getElementById('sd-reflect');
  const reflectInput = document.getElementById('sd-reflect-input');
  const reflectSubmit = document.getElementById('sd-reflect-submit');
  const reflectQuit = document.getElementById('sd-reflect-quit');
  const overCopy = document.getElementById('sd-over-copy');

  const W = canvas.width;
  const H = canvas.height;
  const STORAGE_KEY = 'superdog-biscuit-best';

  const keys = new Set();
  let pointerY = null;
  let running = false;
  let paused = false;
  let rafId = 0;
  let lastTs = 0;
  let spawnTimer = 0;
  let score = 0;
  let lives = 3;
  let best = Number.parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) || 0;
  let questionPool = [];
  let currentQuestion = null;

  const dog = {
    x: 90,
    y: H / 2,
    w: 54,
    h: 34,
    vy: 0,
  };

  /** @type {{x:number,y:number,r:number,vy:number,scored:boolean}[]} */
  let biscuits = [];

  if (best > 0) {
    bestWrap.hidden = false;
    bestEl.textContent = String(best);
  }

  function resetRun() {
    score = 0;
    lives = 3;
    biscuits = [];
    dog.y = H / 2;
    dog.vy = 0;
    spawnTimer = 0.6;
    lastTs = 0;
    questionPool = shuffle(QUESTIONS.slice());
    scoreEl.textContent = '0';
    livesEl.textContent = '3';
    hide(quizOverlay);
    hide(overOverlay);
    reflectBox.hidden = true;
    quizFeedback.hidden = true;
    quizChoices.innerHTML = '';
    reflectInput.value = '';
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function hide(el) {
    el.hidden = true;
  }

  function show(el) {
    el.hidden = false;
  }

  function startGame() {
    resetRun();
    hide(startOverlay);
    running = true;
    paused = false;
    lastTs = 0;
    rafId = requestAnimationFrame(loop);
  }

  function endGame(reason) {
    running = false;
    paused = false;
    cancelAnimationFrame(rafId);
    if (score > best) {
      best = score;
      localStorage.setItem(STORAGE_KEY, String(best));
      bestWrap.hidden = false;
      bestEl.textContent = String(best);
    }
    overCopy.textContent = `${reason} You dodged ${score} biscuit${score === 1 ? '' : 's'}.${best ? ` Best: ${best}.` : ''}`;
    hide(quizOverlay);
    show(overOverlay);
  }

  function nextQuestion() {
    if (questionPool.length === 0) questionPool = shuffle(QUESTIONS.slice());
    return questionPool.pop();
  }

  function openQuiz() {
    paused = true;
    currentQuestion = nextQuestion();
    quizPrompt.textContent = currentQuestion.prompt;
    quizFeedback.hidden = true;
    quizFeedback.textContent = '';
    reflectBox.hidden = true;
    reflectInput.value = '';
    quizChoices.innerHTML = '';

    currentQuestion.choices.forEach((label, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sd-quiz-choice';
      btn.textContent = label;
      btn.addEventListener('click', () => onAnswer(index, btn));
      quizChoices.appendChild(btn);
    });

    show(quizOverlay);
  }

  function onAnswer(index, btn) {
    const buttons = [...quizChoices.querySelectorAll('button')];
    buttons.forEach((b) => { b.disabled = true; });

    const correct = index === currentQuestion.answer;
    buttons[currentQuestion.answer].classList.add('sd-choice-correct');
    if (!correct) btn.classList.add('sd-choice-wrong');

    quizFeedback.hidden = false;
    quizFeedback.textContent = currentQuestion.explain;

    if (correct) {
      window.setTimeout(() => resumeAfterSave(), 1100);
      return;
    }

    // Second chance: explain the lesson
    reflectBox.hidden = false;
    reflectInput.focus();
  }

  function reflectionLooksReal(text) {
    const cleaned = text.trim().replace(/\s+/g, ' ');
    const words = cleaned.split(' ').filter(Boolean);
    if (cleaned.length < 20 || words.length < 4) return false;
    // Reject keyboard-mashing / same-letter spam
    const unique = new Set(cleaned.toLowerCase().replace(/[^a-z]/g, ''));
    return unique.size >= 6;
  }

  function resumeAfterSave() {
    hide(quizOverlay);
    reflectBox.hidden = true;
    quizChoices.innerHTML = '';
    // Clear nearby biscuits so you don't instantly re-collide
    biscuits = biscuits.filter((b) => b.x > dog.x + 120);
    paused = false;
    lastTs = 0;
    rafId = requestAnimationFrame(loop);
  }

  function failLifeOrEnd(message) {
    lives -= 1;
    livesEl.textContent = String(lives);
    if (lives <= 0) {
      endGame(message);
      return;
    }
    resumeAfterSave();
  }

  reflectSubmit.addEventListener('click', () => {
    if (reflectionLooksReal(reflectInput.value)) {
      resumeAfterSave();
      return;
    }
    failLifeOrEnd('Slugger needed a real lesson from that miss — not vibes alone.');
  });

  reflectQuit.addEventListener('click', () => {
    failLifeOrEnd('No reflection, no flight plan.');
  });

  startBtn.addEventListener('click', startGame);
  retryBtn.addEventListener('click', startGame);

  window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', ' ', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
      e.preventDefault();
    }
    keys.add(e.key);
  });
  window.addEventListener('keyup', (e) => keys.delete(e.key));

  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    pointerY = ((e.clientY - rect.top) / rect.height) * H;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (pointerY === null) return;
    const rect = canvas.getBoundingClientRect();
    pointerY = ((e.clientY - rect.top) / rect.height) * H;
  });
  canvas.addEventListener('pointerup', () => { pointerY = null; });
  canvas.addEventListener('pointercancel', () => { pointerY = null; });

  function spawnBiscuit() {
    const r = 16 + Math.random() * 8;
    biscuits.push({
      x: W + r + 10,
      y: r + 20 + Math.random() * (H - 2 * r - 40),
      r,
      vy: (Math.random() - 0.5) * 40,
      scored: false,
    });
  }

  function update(dt) {
    let move = 0;
    if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) move -= 1;
    if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) move += 1;
    if (pointerY !== null) {
      const target = pointerY;
      move = Math.max(-1, Math.min(1, (target - dog.y) / 40));
    }

    dog.vy = move * 280;
    dog.y = Math.max(28, Math.min(H - 28, dog.y + dog.vy * dt));

    const speed = 160 + Math.min(140, score * 6);
    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawnBiscuit();
      spawnTimer = Math.max(0.55, 1.35 - score * 0.03);
    }

    for (const b of biscuits) {
      b.x -= speed * dt;
      b.y += b.vy * dt;
      if (b.y < b.r + 8 || b.y > H - b.r - 8) b.vy *= -1;

      if (!b.scored && b.x + b.r < dog.x - dog.w / 2) {
        b.scored = true;
        score += 1;
        scoreEl.textContent = String(score);
      }
    }

    biscuits = biscuits.filter((b) => b.x > -40);

    // Collision: circle vs dog box
    for (const b of biscuits) {
      const nearestX = Math.max(dog.x - dog.w / 2, Math.min(b.x, dog.x + dog.w / 2));
      const nearestY = Math.max(dog.y - dog.h / 2, Math.min(b.y, dog.y + dog.h / 2));
      const dx = b.x - nearestX;
      const dy = b.y - nearestY;
      if (dx * dx + dy * dy < b.r * b.r) {
        biscuits = biscuits.filter((x) => x !== b);
        openQuiz();
        return;
      }
    }
  }

  function drawSky() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#1a3a5c');
    g.addColorStop(0.55, '#2d5a8e');
    g.addColorStop(1, '#8eb4d4');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Soft clouds
    ctx.fillStyle = 'rgb(255 255 255 / 12%)';
    drawCloud(120, 70, 1);
    drawCloud(420, 110, 0.8);
    drawCloud(600, 50, 0.7);
  }

  function drawCloud(x, y, s) {
    ctx.beginPath();
    ctx.ellipse(x, y, 50 * s, 18 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 30 * s, y - 8 * s, 36 * s, 16 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(x - 28 * s, y - 4 * s, 32 * s, 14 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawDog() {
    const { x, y } = dog;
    ctx.save();
    ctx.translate(x, y);

    // Cape
    ctx.fillStyle = '#c45c4a';
    ctx.beginPath();
    ctx.moveTo(-8, -6);
    ctx.quadraticCurveTo(-48, 4 + Math.sin(performance.now() / 180) * 4, -40, 22);
    ctx.quadraticCurveTo(-20, 14, -4, 10);
    ctx.closePath();
    ctx.fill();

    // Body + head
    ctx.fillStyle = '#c9c2ba';
    ctx.fillRect(-18, -10, 36, 20);
    ctx.beginPath();
    ctx.moveTo(-20, -8);
    ctx.quadraticCurveTo(-22, -18, -8, -16);
    ctx.lineTo(8, -14);
    ctx.quadraticCurveTo(10, -6, 6, -4);
    ctx.lineTo(-16, -4);
    ctx.closePath();
    ctx.fill();

    // Legs stretched back (Superman pose)
    ctx.strokeStyle = '#a89f94';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-10, 8);
    ctx.lineTo(-28, 18);
    ctx.moveTo(2, 8);
    ctx.lineTo(-18, 22);
    ctx.stroke();

    // Front legs forward
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(30, -8);
    ctx.moveTo(12, 6);
    ctx.lineTo(32, 2);
    ctx.stroke();

    // Ear / eye
    ctx.fillStyle = '#2a3f54';
    ctx.fillRect(-18, -22, 8, 8);
    ctx.fillStyle = '#9cbb80';
    ctx.beginPath();
    ctx.arc(2, -8, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Motion lines
    ctx.strokeStyle = 'rgb(255 255 255 / 25%)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-36, -4);
    ctx.lineTo(-52, -4);
    ctx.moveTo(-34, 6);
    ctx.lineTo(-48, 6);
    ctx.stroke();

    ctx.restore();
  }

  function drawBiscuit(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    // Cookie
    ctx.fillStyle = '#5c3a22';
    ctx.beginPath();
    ctx.arc(0, 0, b.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7a4e2e';
    ctx.beginPath();
    ctx.arc(0, 0, b.r * 0.82, 0, Math.PI * 2);
    ctx.fill();
    // Ice cream middle
    ctx.fillStyle = '#f5efe6';
    ctx.beginPath();
    ctx.ellipse(0, 0, b.r * 0.55, b.r * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    // Chips
    ctx.fillStyle = '#3a2414';
    [[-0.35, -0.25], [0.25, -0.15], [-0.1, 0.3], [0.35, 0.2]].forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px * b.r, py * b.r, b.r * 0.12, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function draw() {
    drawSky();
    for (const b of biscuits) drawBiscuit(b);
    drawDog();
  }

  function loop(ts) {
    if (!running || paused) return;
    if (!lastTs) lastTs = ts;
    const dt = Math.min(0.033, (ts - lastTs) / 1000);
    lastTs = ts;
    update(dt);
    draw();
    if (running && !paused) rafId = requestAnimationFrame(loop);
  }

  // Idle preview frame
  draw();
}
