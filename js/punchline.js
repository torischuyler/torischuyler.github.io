/*
  Punchline: JavaScript
  Click the boxing glove to reveal the joke's punchline,
  play a laugh track, and rain ha-ha's down the page.
*/

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('punchline-btn');
  const punchline = document.getElementById('punchline');
  const laughTrack = document.getElementById('laugh-track');

  if (!btn || !punchline) return;

  const LAUGHS = ['ha ha', 'LOL', '😂', 'hahaha', '🤣', 'HA!', '🤭', '😹'];
  const RAIN_DURATION_MS = 5000;
  const DROP_INTERVAL_MS = 180;

  function spawnLaugh() {
    const drop = document.createElement('span');
    drop.className = 'rpi-laugh-drop';
    drop.textContent = LAUGHS[Math.floor(Math.random() * LAUGHS.length)];
    drop.style.left = `${Math.random() * 92}vw`;
    drop.style.fontSize = `${1 + Math.random() * 1.5}rem`;
    drop.style.animationDuration = `${2.5 + Math.random() * 2.5}s`;
    drop.addEventListener('animationend', () => drop.remove());
    document.body.appendChild(drop);
  }

  function rainLaughs() {
    const intervalId = setInterval(spawnLaugh, DROP_INTERVAL_MS);
    setTimeout(() => clearInterval(intervalId), RAIN_DURATION_MS);
  }

  btn.addEventListener('click', () => {
    btn.hidden = true;
    punchline.hidden = false;
    punchline.classList.add('revealed');

    if (laughTrack) {
      laughTrack.currentTime = 0;
      laughTrack.play().catch(() => {
        // Autoplay restrictions shouldn't apply to a click, but just in case.
      });
    }

    rainLaughs();
  });
});
