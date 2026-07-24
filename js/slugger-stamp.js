/*
  Slugger Stamp — personal insignia maker
  Initials (or paw), western sign emoji, Chinese element+animal emojis,
  favorite number. Renders on change only; local PNG download.
*/

document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.slugger-stamp');
  const canvas = document.getElementById('slugger-stamp-canvas');
  const form = document.getElementById('slugger-stamp-form');
  const initialsInput = document.getElementById('slugger-stamp-initials');
  const yearInput = document.getElementById('slugger-stamp-year');
  const monthInput = document.getElementById('slugger-stamp-month');
  const dayInput = document.getElementById('slugger-stamp-day');
  const numberInput = document.getElementById('slugger-stamp-number');
  const resetBtn = document.getElementById('slugger-stamp-reset');
  const downloadBtn = document.getElementById('slugger-stamp-download');
  const errorEl = document.getElementById('slugger-stamp-error');

  if (!section || !canvas || !form || !initialsInput || !yearInput || !monthInput
      || !dayInput || !numberInput || !resetBtn || !downloadBtn) {
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const DESIGN = 640;
  const SLUGGER = {
    initials: '',
    year: 2026,
    month: 7,
    day: 16,
    number: 4,
    theme: 'rider',
  };

  // Inspired by the 1869 U.S. pictorial issue (colors/motifs, not replicas).
  const THEMES = {
    franklin: {
      id: 'franklin',
      label: 'Franklin',
      cents: '1¢',
      paper: ['#f6e6c4', '#e2c48a', '#c9a66a'],
      ring: '#6e4e28',
      ink: '#3a2818',
      accent: '#8a6238',
      motif: 'key',
    },
    rider: {
      id: 'rider',
      label: 'Post rider',
      cents: '2¢',
      paper: ['#e8d2b8', '#c9a888', '#9a6a48'],
      ring: '#5a3420',
      ink: '#2e1c14',
      accent: '#7a4a2e',
      motif: 'horse',
    },
    loco: {
      id: 'loco',
      label: 'Locomotive',
      cents: '3¢',
      paper: ['#b8d0f0', '#5a88c8', '#2a4e88'],
      ring: '#1a3058',
      ink: '#101828',
      accent: '#3a68a8',
      motif: 'train',
    },
    washington: {
      id: 'washington',
      label: 'Washington',
      cents: '6¢',
      paper: ['#d8e8f0', '#90b8c0', '#3a7888'],
      ring: '#1e4850',
      ink: '#102028',
      accent: '#4a8890',
      motif: 'bust',
    },
    eagle: {
      id: 'eagle',
      label: 'Eagle & shield',
      cents: '10¢',
      paper: ['#f8e8a8', '#e0c050', '#a87820'],
      ring: '#6a4810',
      ink: '#3a2808',
      accent: '#c89828',
      motif: 'shield',
    },
    adriatic: {
      id: 'adriatic',
      label: 'S.S. Adriatic',
      cents: '12¢',
      paper: ['#c8e0c8', '#78b080', '#2e6838'],
      ring: '#1e4828',
      ink: '#102818',
      accent: '#4a8860',
      motif: 'ship',
    },
    columbus: {
      id: 'columbus',
      label: 'Columbus',
      cents: '15¢',
      paper: ['#e0d0b8', '#8a9ec0', '#5a3820'],
      ring: '#2a3048',
      ink: '#1a1810',
      accent: '#d8c8a8',
      biColor: true,
      motif: 'landfall',
    },
    declaration: {
      id: 'declaration',
      label: 'Declaration',
      cents: '24¢',
      paper: ['#d0e8c8', '#8a70b0', '#2a5838'],
      ring: '#281848',
      ink: '#141028',
      accent: '#c8b8e0',
      biColor: true,
      motif: 'quill',
    },
    flags: {
      id: 'flags',
      label: 'Eagle & flags',
      cents: '30¢',
      paper: ['#c8d8f0', '#c05060', '#284080'],
      ring: '#181828',
      ink: '#101018',
      accent: '#e8d0d4',
      biColor: true,
      motif: 'banner',
    },
    lincoln: {
      id: 'lincoln',
      label: 'Lincoln',
      cents: '90¢',
      paper: ['#f0c8cc', '#b84858', '#3a1018'],
      ring: '#1a080c',
      ink: '#1a0c10',
      accent: '#e8d0d4',
      biColor: true,
      motif: 'star',
    },
  };

  // Chinese New Year as MMDD for years 1924–2044 (inclusive).
  // Index 0 = 1924. Source: standard lunar new year calendar.
  const CNY_START = 1924;
  const CNY_MMDD = [
    205, 124, 213, 202, 123, 210, 130, 217, 206, 126, 214, 204, 124, 211, 131, 219, 208, 127,
    215, 205, 125, 213, 202, 122, 210, 129, 217, 206, 127, 214, 203, 124, 212, 131, 218, 208,
    128, 215, 205, 125, 213, 202, 121, 209, 130, 217, 206, 127, 215, 203, 123, 211, 131, 218,
    207, 128, 216, 205, 125, 213, 202, 220, 209, 129, 217, 206, 127, 215, 204, 123, 210, 131,
    219, 207, 128, 216, 205, 124, 212, 201, 122, 209, 129, 218, 207, 126, 214, 203, 123, 210,
    131, 219, 208, 128, 216, 205, 125, 212, 201, 122, 210, 129, 217, 206, 126, 213, 203, 123,
    211, 131, 219, 208, 128, 215, 204, 124, 212, 201, 122, 210, 130,
  ];

  const ANIMALS = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐴', '🐐', '🐵', '🐓', '🐕', '🐖'];
  const ELEMENTS = [
    { name: 'Metal', emoji: '⚙️' },
    { name: 'Metal', emoji: '⚙️' },
    { name: 'Water', emoji: '💧' },
    { name: 'Water', emoji: '💧' },
    { name: 'Wood', emoji: '🌳' },
    { name: 'Wood', emoji: '🌳' },
    { name: 'Fire', emoji: '🔥' },
    { name: 'Fire', emoji: '🔥' },
    { name: 'Earth', emoji: '⛰️' },
    { name: 'Earth', emoji: '⛰️' },
  ];

  const WESTERN = [
    { name: 'Capricorn', emoji: '♑', until: [1, 19] },
    { name: 'Aquarius', emoji: '♒', until: [2, 18] },
    { name: 'Pisces', emoji: '♓', until: [3, 20] },
    { name: 'Aries', emoji: '♈', until: [4, 19] },
    { name: 'Taurus', emoji: '♉', until: [5, 20] },
    { name: 'Gemini', emoji: '♊', until: [6, 20] },
    { name: 'Cancer', emoji: '♋', until: [7, 22] },
    { name: 'Leo', emoji: '♌', until: [8, 22] },
    { name: 'Virgo', emoji: '♍', until: [9, 22] },
    { name: 'Libra', emoji: '♎', until: [10, 22] },
    { name: 'Scorpio', emoji: '♏', until: [11, 21] },
    { name: 'Sagittarius', emoji: '♐', until: [12, 21] },
    { name: 'Capricorn', emoji: '♑', until: [12, 31] },
  ];

  function setError(message) {
    if (!errorEl) return;
    if (message) {
      errorEl.hidden = false;
      errorEl.textContent = message;
    } else {
      errorEl.hidden = true;
      errorEl.textContent = '';
    }
  }

  function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  function parseStampDate() {
    const year = Number(yearInput.value);
    const month = Number(monthInput.value);
    const day = Number(dayInput.value);

    if (!Number.isInteger(year) || year < CNY_START || year > 2044) {
      return { ok: false, error: `Year must be between ${CNY_START} and 2044.` };
    }
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return { ok: false, error: 'Month must be 1–12.' };
    }
    const maxDay = daysInMonth(year, month);
    if (!Number.isInteger(day) || day < 1 || day > maxDay) {
      return { ok: false, error: `Day must be 1–${maxDay} for that month.` };
    }
    return { ok: true, year, month, day };
  }

  function getWesternSign(month, day) {
    for (let i = 0; i < WESTERN.length; i += 1) {
      const [um, ud] = WESTERN[i].until;
      if (month < um || (month === um && day <= ud)) {
        return WESTERN[i];
      }
    }
    return WESTERN[0];
  }

  function cnyMmdd(year) {
    const idx = year - CNY_START;
    if (idx < 0 || idx >= CNY_MMDD.length) return null;
    return CNY_MMDD[idx];
  }

  function getChineseYear(year, month, day) {
    const mmdd = month * 100 + day;
    const start = cnyMmdd(year);
    if (start == null) return year;
    return mmdd < start ? year - 1 : year;
  }

  function getChineseZodiac(year, month, day) {
    const cy = getChineseYear(year, month, day);
    const animal = ANIMALS[((cy - 4) % 12 + 12) % 12];
    const element = ELEMENTS[((cy % 10) + 10) % 10];
    return {
      year: cy,
      animalEmoji: animal,
      elementEmoji: element.emoji,
      elementName: element.name,
      pair: `${element.emoji}${animal}`,
    };
  }

  function normalizeInitials(raw) {
    return String(raw || '')
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, 3);
  }

  function parseFavoriteNumber() {
    const n = Number(numberInput.value);
    if (!Number.isInteger(n) || n < 0 || n > 999) {
      return { ok: false, error: 'Favorite number must be 0–999.' };
    }
    return { ok: true, number: n };
  }

  function getSelectedTheme() {
    const picked = form.querySelector('input[name="slugger-stamp-theme"]:checked');
    const id = (picked && picked.value) || SLUGGER.theme;
    return THEMES[id] || THEMES.rider;
  }

  function setTheme(themeId) {
    const input = form.querySelector(`input[name="slugger-stamp-theme"][value="${themeId}"]`);
    if (input) input.checked = true;
  }

  function resizeCanvas() {
    const cssW = canvas.clientWidth || 420;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const px = Math.round(cssW * dpr);
    if (canvas.width !== px || canvas.height !== px) {
      canvas.width = px;
      canvas.height = px;
    }
    return px / DESIGN;
  }

  function drawMotif(theme, scale, cx, cy, r) {
    ctx.save();
    ctx.translate(cx, cy + r * 0.08);
    ctx.scale(scale * 1.35, scale * 1.35);
    ctx.fillStyle = theme.accent;
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.globalAlpha = theme.biColor ? 0.14 : 0.12;

    if (theme.motif === 'key') {
      ctx.beginPath();
      ctx.arc(-18, 0, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(36, 0);
      ctx.moveTo(36, 0);
      ctx.lineTo(36, 12);
      ctx.moveTo(26, 0);
      ctx.lineTo(26, 10);
      ctx.stroke();
    } else if (theme.motif === 'horse') {
      ctx.beginPath();
      ctx.moveTo(-40, 10);
      ctx.quadraticCurveTo(-12, -26, 10, -10);
      ctx.quadraticCurveTo(26, -22, 40, -6);
      ctx.quadraticCurveTo(24, 6, 12, 12);
      ctx.quadraticCurveTo(-4, 18, -22, 14);
      ctx.quadraticCurveTo(-34, 20, -40, 10);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(4, -16, 7, 0, Math.PI * 2);
      ctx.fill();
    } else if (theme.motif === 'train') {
      ctx.fillRect(-34, -4, 48, 20);
      ctx.fillRect(-10, -20, 26, 16);
      ctx.beginPath();
      ctx.arc(-18, 18, 9, 0, Math.PI * 2);
      ctx.arc(10, 18, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(14, -8, 18, 12);
      ctx.fillRect(-4, -32, 7, 12);
    } else if (theme.motif === 'bust') {
      ctx.beginPath();
      ctx.ellipse(0, -8, 18, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-28, 28);
      ctx.quadraticCurveTo(0, 8, 28, 28);
      ctx.lineTo(28, 36);
      ctx.lineTo(-28, 36);
      ctx.closePath();
      ctx.fill();
    } else if (theme.motif === 'shield') {
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(24, -16);
      ctx.lineTo(24, 8);
      ctx.quadraticCurveTo(24, 28, 0, 36);
      ctx.quadraticCurveTo(-24, 28, -24, 8);
      ctx.lineTo(-24, -16);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-10, -4);
      ctx.quadraticCurveTo(0, -16, 10, -4);
      ctx.quadraticCurveTo(0, 8, -10, -4);
      ctx.fillStyle = theme.paper[0];
      ctx.globalAlpha = 0.35;
      ctx.fill();
    } else if (theme.motif === 'ship' || theme.motif === 'landfall') {
      ctx.beginPath();
      ctx.moveTo(-36, 16);
      ctx.lineTo(36, 16);
      ctx.lineTo(20, 28);
      ctx.lineTo(-20, 28);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 16);
      ctx.lineTo(0, -28);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -24);
      ctx.lineTo(22, 8);
      ctx.lineTo(0, 8);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(-18, 8);
      ctx.lineTo(0, 8);
      ctx.closePath();
      ctx.fill();
    } else if (theme.motif === 'quill') {
      ctx.beginPath();
      ctx.moveTo(-28, 20);
      ctx.quadraticCurveTo(-8, -8, 24, -28);
      ctx.lineTo(28, -22);
      ctx.quadraticCurveTo(-2, 0, -22, 26);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-30, 24);
      ctx.lineTo(-38, 34);
      ctx.stroke();
    } else if (theme.motif === 'banner') {
      ctx.beginPath();
      ctx.moveTo(-8, -28);
      ctx.lineTo(8, -28);
      ctx.lineTo(8, 8);
      ctx.lineTo(0, 16);
      ctx.lineTo(-8, 8);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(8, -20);
      ctx.lineTo(34, -12);
      ctx.lineTo(34, 8);
      ctx.lineTo(8, 0);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-8, -16);
      ctx.lineTo(-32, -8);
      ctx.lineTo(-32, 10);
      ctx.lineTo(-8, 2);
      ctx.closePath();
      ctx.fill();
    } else if (theme.motif === 'star') {
      const spikes = 5;
      const outer = 28;
      const inner = 12;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i += 1) {
        const ang = (Math.PI / 2) * -1 + (i * Math.PI) / spikes;
        const rad = i % 2 === 0 ? outer : inner;
        const x = Math.cos(ang) * rad;
        const y = Math.sin(ang) * rad;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  function drawSealBackground(theme, scale) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = (DESIGN * 0.48) * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const g = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.3, r * 0.1, cx, cy, r);
    g.addColorStop(0, theme.paper[0]);
    g.addColorStop(0.55, theme.paper[1]);
    g.addColorStop(1, theme.paper[2]);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    drawMotif(theme, scale, cx, cy, r);

    ctx.strokeStyle = theme.ring;
    ctx.lineWidth = Math.max(3, 10 * scale);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r - 16 * scale, 0, Math.PI * 2);
    ctx.strokeStyle = theme.biColor ? theme.accent : theme.ring;
    ctx.globalAlpha = theme.biColor ? 0.85 : 0.45;
    ctx.lineWidth = Math.max(1.5, 3 * scale);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.setLineDash([6 * scale, 5 * scale]);
    ctx.beginPath();
    ctx.arc(cx, cy, r - 28 * scale, 0, Math.PI * 2);
    ctx.strokeStyle = theme.ring;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = Math.max(1, 2 * scale);
    ctx.stroke();
    ctx.restore();
  }

  function drawDenomination(theme, scale) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = (DESIGN * 0.48) * scale;
    ctx.font = `700 ${26 * scale}px "Space Grotesk", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = theme.biColor ? theme.accent : theme.ring;
    ctx.globalAlpha = 0.95;
    ctx.fillText(theme.cents, cx, cy + r * 0.78);
    ctx.globalAlpha = 1;
  }

  function drawPaw(theme, scale) {
    const cx = DESIGN * 0.5;
    const cy = DESIGN * 0.48;
    ctx.fillStyle = theme.ink;

    ctx.beginPath();
    ctx.ellipse(cx * scale, (cy + 22) * scale, 68 * scale, 54 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    const toes = [
      { x: cx - 62, y: cy - 48, rx: 22, ry: 30 },
      { x: cx - 22, y: cy - 70, rx: 24, ry: 32 },
      { x: cx + 22, y: cy - 70, rx: 24, ry: 32 },
      { x: cx + 62, y: cy - 48, rx: 22, ry: 30 },
    ];
    toes.forEach((t) => {
      ctx.beginPath();
      ctx.ellipse(t.x * scale, t.y * scale, t.rx * scale, t.ry * scale, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawInitials(theme, text, scale) {
    const fontSize = text.length >= 3 ? 110 * scale : text.length === 2 ? 140 * scale : 180 * scale;
    ctx.font = `${fontSize}px "Lilita One", "Righteous", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = theme.ink;
    ctx.fillText(text, canvas.width / 2, canvas.height * 0.5);
  }

  function drawFavoriteNumber(theme, n, scale) {
    const fontSize = 60 * scale;
    ctx.font = `${fontSize}px "Lilita One", "Righteous", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = theme.ink;
    ctx.globalAlpha = 0.92;
    ctx.fillText(String(n), canvas.width / 2, canvas.height * 0.7);
    ctx.globalAlpha = 1;
  }

  function drawCornerEmojis(westernEmoji, chinesePair, scale) {
    const size = 48 * scale;
    ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(westernEmoji, canvas.width * 0.27, canvas.height * 0.26);
    ctx.fillText(chinesePair, canvas.width * 0.73, canvas.height * 0.26);
  }

  function updateCanvasLabel(meta) {
    const center = meta.initials ? `initials ${meta.initials}` : 'a paw print';
    canvas.setAttribute(
      'aria-label',
      `Slugger Stamp ${meta.theme.cents} ${meta.theme.label}: ${center}, ${meta.western.name}, `
      + `${meta.chinese.elementName} ${meta.chinese.animalEmoji}, favorite number ${meta.number}`
    );
  }

  function render() {
    const date = parseStampDate();
    const fav = parseFavoriteNumber();
    const theme = getSelectedTheme();

    if (!date.ok) {
      setError(date.error);
    } else if (!fav.ok) {
      setError(fav.error);
    } else {
      setError('');
    }

    const year = date.ok ? date.year : SLUGGER.year;
    const month = date.ok ? date.month : SLUGGER.month;
    const day = date.ok ? date.day : SLUGGER.day;
    const number = fav.ok ? fav.number : SLUGGER.number;
    const initials = normalizeInitials(initialsInput.value);

    const western = getWesternSign(month, day);
    const chinese = getChineseZodiac(year, month, day);
    const scale = resizeCanvas();

    drawSealBackground(theme, scale);
    drawCornerEmojis(western.emoji, chinese.pair, scale);
    if (initials) {
      drawInitials(theme, initials, scale);
    } else {
      drawPaw(theme, scale);
    }
    drawFavoriteNumber(theme, number, scale);
    drawDenomination(theme, scale);
    updateCanvasLabel({ initials, western, chinese, number, theme });
  }

  function resetToSlugger() {
    initialsInput.value = SLUGGER.initials;
    yearInput.value = String(SLUGGER.year);
    monthInput.value = String(SLUGGER.month);
    dayInput.value = String(SLUGGER.day);
    numberInput.value = String(SLUGGER.number);
    setTheme(SLUGGER.theme);
    setError('');
    render();
    initialsInput.focus();
  }

  function downloadPng() {
    render();
    const link = document.createElement('a');
    link.download = 'slugger-stamp.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  initialsInput.addEventListener('input', () => {
    const cleaned = normalizeInitials(initialsInput.value);
    if (initialsInput.value !== cleaned) {
      initialsInput.value = cleaned;
    }
    render();
  });

  [yearInput, monthInput, dayInput, numberInput].forEach((el) => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });

  form.querySelectorAll('input[name="slugger-stamp-theme"]').forEach((el) => {
    el.addEventListener('change', render);
  });

  resetBtn.addEventListener('click', resetToSlugger);
  downloadBtn.addEventListener('click', downloadPng);
  window.addEventListener('resize', render);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    downloadPng();
  });

  const fontsReady = (document.fonts && document.fonts.load)
    ? document.fonts.load('180px "Lilita One"')
    : Promise.resolve();

  fontsReady.then(render).catch(render);
});
