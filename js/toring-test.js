// Toring Test interactivity
const emailLink = document.querySelector('footer a[href^="mailto:"]');
const mailtoHref = emailLink.getAttribute('href');
const modal = document.getElementById('toringModal');
const closeBtn = modal.querySelector('.close-btn');
const gridItems = document.querySelectorAll('.grid-item');
const statusRegion = document.getElementById('toringStatus');
let selectedToriCount = 0;
let testPassed = false;

function openModal() {
  modal.style.display = 'flex';
  statusRegion.textContent = '';
  closeBtn.focus();
}

function closeModal() {
  modal.style.display = 'none';
  // Return focus to the link that opened the modal
  emailLink.focus();
}

emailLink.addEventListener('click', (event) => {
  // Once the test is passed, the link behaves like a normal mailto link
  if (testPassed) return;
  event.preventDefault();
  openModal();
});

closeBtn.addEventListener('click', () => {
  const canHover = window.matchMedia('(hover: hover)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // On hover-capable devices the wave already played on hover/focus, and with
  // reduced motion the animation never fires, so close right away in both cases
  if (canHover || reducedMotion) {
    closeModal();
    return;
  }

  // On touch devices, play the wave first, then close when it finishes
  if (closeBtn.classList.contains('waving')) return;
  closeBtn.classList.add('waving');
  closeBtn.addEventListener('animationend', () => {
    closeBtn.classList.remove('waving');
    closeModal();
  }, { once: true });
});

// Keep keyboard focus inside the modal and let Escape dismiss it
modal.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
    return;
  }
  if (event.key !== 'Tab') return;
  const focusable = modal.querySelectorAll('button');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

gridItems.forEach(item => {
  item.addEventListener('click', () => {
    if (item.classList.contains('selected')) return;

    const imgSrc = item.querySelector('img').src;
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.setAttribute('aria-hidden', 'true');

    if (imgSrc.includes('1-toring-test') || imgSrc.includes('2-toring-test') ||
        imgSrc.includes('3-toring-test') || imgSrc.includes('4-toring-test') ||
        imgSrc.includes('5-toring-test') || imgSrc.includes('6-toring-test') ||
        imgSrc.includes('7-toring-test')) {
      overlay.innerHTML = '✔';
      overlay.className += ' checkmark';
      selectedToriCount++;
      statusRegion.textContent = `Correct, that's Tori! ${selectedToriCount} of 7 found.`;
      if (selectedToriCount === 7) {
        setTimeout(showSuccessPopup, 500);
      }
    } else {
      overlay.innerHTML = '✖';
      overlay.className += ' cross';
      statusRegion.textContent = "Nope, that's not Tori.";
    }

    item.classList.add('selected');
    item.setAttribute('aria-pressed', 'true');
    item.appendChild(overlay);
  });
});

function launchConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  container.setAttribute('aria-hidden', 'true');
  const colors = ['#EF3629', '#FFD166', '#D7E3B6', '#3D7AB8', '#FFF'];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.animationDuration = `${2.5 + Math.random() * 2}s`;
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 200}px`);
    if (i % 3 === 0) piece.style.borderRadius = '50%';
    container.appendChild(piece);
  }
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 6000);
}

function showSuccessPopup() {
  testPassed = true;
  modal.style.display = 'none';
  launchConfetti();
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = `
    <div class="popup-content" role="alertdialog" aria-modal="true" aria-labelledby="popupTitle" aria-describedby="popupMessage">
      <h2 id="popupTitle">Congratulations...</h2>
      <p id="popupMessage">You're a human!</p>
      <p class="disclaimer"><i>...just kidding, that's not really a valid test. Humans and AI can both do it.</i></p>
      <p>Want a more real-ish test? Trace a squiggle.</p>
      <div class="popup-actions">
        <button type="button" class="squiggle-btn" aria-label="Take the more real-ish test" title="Take the more real-ish test">〰️</button>
        <button type="button" class="close-popup-btn" aria-label="Skip and email Tori" title="Skip and email Tori">📩</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  const squiggleButton = popup.querySelector('.squiggle-btn');
  const emailButton = popup.querySelector('.close-popup-btn');
  squiggleButton.focus();
  squiggleButton.addEventListener('click', () => {
    closePopup();
    showSquigglePopup();
  });
  emailButton.addEventListener('click', () => {
    closePopup();
    window.location.href = mailtoHref;
  });
  trapPopupFocus(popup);
}

// --- The "real" test: trace a squiggle ---
// A pointer-drag task that's easy for a hand and awkward for a script.
// Passing requires covering the squiggle AND moving like a human:
// taking real time, with speed that wobbles instead of staying constant.

function buildSquiggle(width, height) {
  const margin = 24;
  const midY = height / 2;
  const amplitude = height / 2 - margin;
  const waves = 1.5 + Math.random();
  const phase = Math.random() * Math.PI * 2;
  const points = [];
  for (let i = 0; i <= 80; i++) {
    const t = i / 80;
    // Sine wave tapered toward the ends so the curve stays in frame
    const taper = 0.6 + 0.4 * Math.sin(Math.PI * t);
    points.push({
      x: margin + t * (width - margin * 2),
      y: midY + Math.sin(phase + t * waves * 2 * Math.PI) * amplitude * taper,
    });
  }
  return points;
}

function judgeTrace(trace, target) {
  // Coverage: the stroke must pass close to nearly every point of the squiggle
  const tolerance = 26;
  let covered = 0;
  for (const point of target) {
    const hit = trace.some(
      (p) => (p.x - point.x) ** 2 + (p.y - point.y) ** 2 <= tolerance ** 2
    );
    if (hit) covered++;
  }
  if (covered / target.length < 0.9) return 'miss';

  // Human-ness: real hands take time and don't move at constant speed
  const duration = trace[trace.length - 1].t - trace[0].t;
  if (trace.length < 25 || duration < 400) return 'robot';
  const speeds = [];
  for (let i = 1; i < trace.length; i++) {
    const dt = trace[i].t - trace[i - 1].t;
    if (dt <= 0) continue;
    speeds.push(Math.hypot(trace[i].x - trace[i - 1].x, trace[i].y - trace[i - 1].y) / dt);
  }
  const mean = speeds.reduce((sum, s) => sum + s, 0) / speeds.length;
  const variance = speeds.reduce((sum, s) => sum + (s - mean) ** 2, 0) / speeds.length;
  if (mean === 0 || Math.sqrt(variance) / mean < 0.15) return 'robot';

  return 'human';
}

function showSquigglePopup() {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = `
    <div class="popup-content squiggle-content" role="dialog" aria-modal="true" aria-labelledby="squiggleTitle" aria-describedby="squiggleHint">
      <button type="button" class="close-btn" aria-label="Close">👋</button>
      <h2 id="squiggleTitle">The Real Test</h2>
      <p id="squiggleHint">Trace the squiggle in one motion, starting anywhere.</p>
      <canvas class="squiggle-canvas"></canvas>
      <p class="squiggle-status" role="status"></p>
      <img class="squiggle-cat" src="/assets/images/sassy-tortie.jpg" alt="Sassy Tortie, a tortoiseshell cat in black sunglasses, judging your squiggle">
    </div>
  `;
  document.body.appendChild(popup);

  const closeButton = popup.querySelector('.close-btn');
  const canvas = popup.querySelector('.squiggle-canvas');
  const status = popup.querySelector('.squiggle-status');
  const cat = popup.querySelector('.squiggle-cat');
  const ctx = canvas.getContext('2d');
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

  // Match the canvas buffer to its on-screen size, sharp on retina displays
  const dpr = window.devicePixelRatio || 1;
  const bounds = canvas.getBoundingClientRect();
  const width = bounds.width;
  const height = bounds.height;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  let target = buildSquiggle(width, height);
  let trace = [];
  let drawing = false;

  function drawTarget() {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    target.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.strokeStyle = 'rgb(255 255 255 / 35%)';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  function pointFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top, t: event.timeStamp };
  }

  canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    drawing = true;
    trace = [pointFromEvent(event)];
    status.textContent = '';
    cat.classList.remove('visible');
    // Each press starts a fresh attempt
    drawTarget();
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!drawing) return;
    const point = pointFromEvent(event);
    const previous = trace[trace.length - 1];
    ctx.beginPath();
    ctx.moveTo(previous.x, previous.y);
    ctx.lineTo(point.x, point.y);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
    trace.push(point);
  });

  canvas.addEventListener('pointerup', () => {
    if (!drawing) return;
    drawing = false;
    const verdict = judgeTrace(trace, target);
    if (verdict === 'human') {
      closePopup();
      showFinalPopup();
      return;
    }
    status.textContent = verdict === 'robot'
      ? 'Suspiciously smooth. That\'s exactly what a clanker would draw. Try again.'
      : 'You missed part of the squiggle. Try again.';
    cat.classList.add('visible');
    // New squiggle each attempt, so there's nothing to memorize and replay
    target = buildSquiggle(width, height);
    drawTarget();
  });

  drawTarget();
  closeButton.focus();
  closeButton.addEventListener('click', () => {
    closePopup();
    emailLink.focus();
  });
  trapPopupFocus(popup);
}

function showFinalPopup() {
  launchConfetti();
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = `
    <div class="popup-content" role="alertdialog" aria-modal="true" aria-labelledby="finalTitle" aria-describedby="finalMessage">
      <h2 id="finalTitle">Okay, yeah...</h2>
      <p id="finalMessage">You're probably human.</p>
      <p class="disclaimer"><i>Probably.</i></p>
      <button type="button" class="close-popup-btn" aria-label="Email Tori" title="Email Tori">📩</button>
    </div>
  `;
  document.body.appendChild(popup);

  const closeButton = popup.querySelector('.close-popup-btn');
  closeButton.focus();
  closeButton.addEventListener('click', () => {
    closePopup();
    window.location.href = mailtoHref;
  });
  trapPopupFocus(popup);
}

// Keep keyboard focus inside a popup and let Escape dismiss it
function trapPopupFocus(popup) {
  popup.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePopup();
      emailLink.focus();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = popup.querySelectorAll('button');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function closePopup() {
  document.querySelector('.popup').remove();
}
