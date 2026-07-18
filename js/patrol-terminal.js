/*
  🕶️ Patrol Command Center: JavaScript
  A fake movie-hacker terminal on the PiDog patrol page that secretly
  teaches real Linux commands (pwd, ls, cat, touch, mkdir, mv, rm, echo)
  through a mini mission game: help Slugger secure the yard.
*/

document.addEventListener('DOMContentLoaded', () => {
  const terminal = document.getElementById('pt-terminal');
  const screen = document.getElementById('pt-screen');
  const output = document.getElementById('pt-output');
  const inputRow = document.getElementById('pt-input-row');
  const input = document.getElementById('pt-input');
  const bootBtn = document.getElementById('pt-boot-btn');
  const modal = document.getElementById('pt-modal');
  const modalChoice = document.getElementById('pt-modal-choice');
  const modalNameForm = document.getElementById('pt-modal-name');
  const modalNameInput = document.getElementById('pt-agent-name');
  const acceptBtn = document.getElementById('pt-accept-btn');
  const declineBtn = document.getElementById('pt-decline-btn');

  if (!terminal || !screen || !output || !input || !bootBtn) return;

  let agentName = ''; // the player's codename, in caps

  function sanitizeName(raw) {
    return raw.trim().replace(/\s+/g, ' ').slice(0, 20).toUpperCase() || 'X';
  }

  // Replaces {AGENT} tokens in script lines with the player's codename.
  function fmt(text) {
    return text.replaceAll('{AGENT}', agentName || 'AGENT');
  }

  /* ---------- Alert sound (synthesized — no file, no copyright) ----------
     A retro two-tone "red alert" made with the Web Audio API. Browsers
     may keep it silent until the user's first click on the page. */

  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    return audioCtx;
  }

  function beep(ctx, freq, when, dur, volume = 0.15) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(volume, when + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(when);
    osc.stop(when + dur + 0.05);
  }

  function playAlertSound() {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;
      for (let i = 0; i < 3; i += 1) {
        const t = now + i * 0.45;
        beep(ctx, 932, t, 0.18);
        beep(ctx, 622, t + 0.21, 0.18);
      }
    } catch {
      // No audio available; the mission continues in silence.
    }
  }

  function playConfirmBeep() {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;
      beep(ctx, 660, now, 0.1, 0.12);
      beep(ctx, 990, now + 0.12, 0.16, 0.12);
    } catch {
      // No audio available; the mission continues in silence.
    }
  }

  /* ---------- Fake filesystem ----------
     One home dir ("yard") with optional one-level-deep folders.
     Just enough structure for ls/cat/touch/mkdir/mv/rm to feel real. */

  const HOME = '/home/slugger/yard';

  let fs; // name -> { type: 'file'|'dir', content?: string, children?: Map }

  function resetFs() {
    fs = new Map([
      ['mission.txt', {
        type: 'file',
        content: [
          '*** OPERATION: BACKYARD SHIELD ***',
          fmt('Agent {AGENT}, the yard is under squirrel surveillance.'),
          'Complete your patrol training to activate Slugger.',
          'Trust the terminal. The terminal is your friend.',
        ].join('\n'),
      }],
      ['acorn-virus.exe', {
        type: 'file',
        content: 'HA HA HA! -- planted by THE SQUIRREL 🐿️',
      }],
      ['doghouse', { type: 'dir', children: new Map() }],
    ]);
  }

  /* ---------- Missions ----------
     Each mission teaches one command. `check` runs after every valid
     command and returns true when the mission is accomplished. */

  const MISSIONS = [
    {
      cmd: 'pwd',
      brief: [
        'MISSION 1: Find your location.',
        'Every agent needs to know where they are. Type: pwd',
        '(pwd = "print working directory" — shows the folder you are in)',
      ],
      check: (c) => c.name === 'pwd',
      success: ['LOCATION CONFIRMED. You are in Slugger\'s yard. 🐾'],
    },
    {
      cmd: 'ls',
      brief: [
        'MISSION 2: Scan the area.',
        'See what\'s lying around in this folder. Type: ls',
        '(ls = "list" — shows the files and folders around you)',
      ],
      check: (c) => c.name === 'ls',
      success: ['AREA SCANNED. Wait... acorn-virus.exe?! That doesn\'t belong here.'],
    },
    {
      cmd: 'cat mission.txt',
      brief: [
        'MISSION 3: Read your secret orders.',
        'Open the mission file. Type: cat mission.txt',
        '(cat = "concatenate" — prints what\'s inside a file)',
      ],
      check: (c) => c.name === 'cat' && c.args[0] === 'mission.txt',
      success: ['ORDERS RECEIVED. This is bigger than we thought.'],
    },
    {
      cmd: 'rm acorn-virus.exe',
      brief: [
        'MISSION 4: Destroy the squirrel\'s virus.',
        'Delete that suspicious file. Type: rm acorn-virus.exe',
        '(rm = "remove" — deletes a file. Careful: there\'s no trash can!)',
      ],
      check: (c) => c.name === 'rm' && c.args[0] === 'acorn-virus.exe',
      success: ['VIRUS ELIMINATED. Nice work, Agent {AGENT}. The Squirrel is furious. 🐿️💢'],
    },
    {
      cmd: 'mkdir lookout',
      brief: [
        'MISSION 5: Build a lookout post.',
        'Slugger needs a base. Type: mkdir lookout',
        '(mkdir = "make directory" — creates a new folder)',
      ],
      check: (c) => c.name === 'mkdir' && c.args[0] === 'lookout',
      guard: (c) => {
        if (c.name === 'mkdir' && c.args[0] && c.args[0] !== 'lookout') {
          return [
            '📡 HQ: negative, agent — the blueprints name this base "lookout".',
            'Try: mkdir lookout',
          ];
        }
        return null;
      },
      success: ['LOOKOUT CONSTRUCTED. Run ls again if you want to see it!'],
    },
    {
      cmd: 'touch sea-dog-biscuit.txt',
      brief: [
        'MISSION 6: Deploy emergency rations.',
        'Create a Sea Dog Biscuit for Slugger. Type: touch sea-dog-biscuit.txt',
        '(touch — creates a brand-new empty file)',
      ],
      check: (c) => c.name === 'touch' && c.args[0] === 'sea-dog-biscuit.txt',
      guard: (c) => {
        if (c.name === 'touch' && c.args[0] && c.args[0] !== 'sea-dog-biscuit.txt') {
          return [
            '📡 HQ: Slugger only eats official rations, agent.',
            'Try: touch sea-dog-biscuit.txt',
          ];
        }
        return null;
      },
      success: ['RATIONS DEPLOYED. One fresh sea-dog-biscuit.txt, hot off the press. 🍪'],
    },
    {
      cmd: 'mv sea-dog-biscuit.txt lookout',
      brief: [
        'MISSION 7: Stash the biscuit in the lookout.',
        'Move the rations to the base. Type: mv sea-dog-biscuit.txt lookout',
        '(mv = "move" — moves a file into a folder, or renames it)',
      ],
      check: (c) => c.name === 'mv' && c.args[0] === 'sea-dog-biscuit.txt' && c.args[1] === 'lookout',
      guard: (c) => {
        if (c.name === 'mv' && c.args.length >= 2
          && !(c.args[0] === 'sea-dog-biscuit.txt' && c.args[1] === 'lookout')) {
          return [
            '📡 HQ: careful, agent — the biscuit goes in the lookout, nowhere else.',
            'Try: mv sea-dog-biscuit.txt lookout',
          ];
        }
        return null;
      },
      success: ['SUPPLIES SECURED. The Sea Dog Biscuit is safe inside the lookout.'],
    },
    {
      cmd: 'echo woof',
      brief: [
        'MISSION 8: Sound the all-clear bark.',
        'Send Slugger\'s signal over the radio. Type: echo woof',
        '(echo — makes the terminal say something back)',
      ],
      check: (c) => c.name === 'echo' && c.args.length > 0,
      success: ['SIGNAL BROADCAST. All units report: yard secure.'],
    },
  ];

  let missionIndex = -1; // -1 = game not started
  let busy = false; // true while lines are being typed out
  let inputMode = 'command'; // 'codename' while the terminal waits for a name

  /* ---------- Output helpers ---------- */

  function scrollToBottom() {
    screen.scrollTop = screen.scrollHeight;
  }

  function addLine(text, className) {
    const line = document.createElement('div');
    if (className) line.className = className;
    line.textContent = text;
    output.appendChild(line);
    scrollToBottom();
    return line;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Types text into a line character-by-character, movie style.
  async function typeLine(text, className, charDelay = 8) {
    const line = addLine('', className);
    const cursor = document.createElement('span');
    cursor.className = 'pt-cursor';
    line.appendChild(cursor);
    for (const ch of text) {
      cursor.before(ch);
      scrollToBottom();
      if (charDelay > 0) await sleep(charDelay);
    }
    cursor.remove();
  }

  async function printLines(lines, className, lineDelay = 60) {
    for (const text of lines) {
      addLine(text, className);
      await sleep(lineDelay);
    }
  }

  /* ---------- Boot sequence ---------- */

  const BOOT_LINES = [
    ['SLUGGER-OS v1.6.18 — initializing secure uplink...', 'pt-line-dim'],
    ['> handshake: K9-PROTOCOL ............ OK', 'pt-line-dim'],
    ['> decrypting bark codec (AES-256) ... OK', 'pt-line-dim'],
    ['> tail servo diagnostics ............ WAGGING', 'pt-line-dim'],
    ['> sniffing network packets .......... SMELLS FINE', 'pt-line-dim'],
    ['> loading patrol route: BACKYARD_01 . OK', 'pt-line-dim'],
    ['!! ALERT: unauthorized rodent activity detected !!', 'pt-line-alert'],
    ['!! Hostile identified — codename: THE SQUIRREL 🐿️ !!', 'pt-line-alert'],
    ['Recruiting field agent for Operation BACKYARD SHIELD...', 'pt-line-info'],
  ];

  async function boot() {
    bootBtn.remove();
    screen.classList.add('pt-flicker');

    await typeLine('access slugger-mainframe --override', 'pt-line-user', 35);
    await sleep(350);

    for (const [text, cls] of BOOT_LINES) {
      await typeLine(text, cls, 4);
      await sleep(120);
    }

    await sleep(400);

    if (agentName) {
      await welcomeAgent();
      return;
    }

    // No codename yet (they declined the transmission) — ask in-terminal.
    await typeLine('STATE YOUR CODENAME, AGENT:', 'pt-line-gold', 12);
    inputMode = 'codename';
    inputRow.hidden = false;
    input.focus();
  }

  async function welcomeAgent() {
    await typeLine(fmt('Agent recruited: AGENT {AGENT}.'), 'pt-line-gold', 10);
    await printLines([
      '',
      'Don\'t worry — these are REAL commands used by real programmers.',
      'Type help anytime to see them all. Let\'s train, agent.',
      '',
    ], 'pt-line-info', 90);

    resetFs();
    missionIndex = 0;
    await showMission();

    inputRow.hidden = false;
    input.focus();
  }

  async function showMission() {
    const mission = MISSIONS[missionIndex];
    for (const text of mission.brief) {
      addLine(text, 'pt-line-mission');
      await sleep(60);
    }
  }

  /* ---------- Command implementations ---------- */

  function findEntry(name) {
    return fs.get(name);
  }

  const COMMANDS = {
    help() {
      return [
        ['REAL LINUX COMMANDS YOU KNOW SO FAR:', 'pt-line-gold'],
        ['  pwd            where am I?', 'pt-line-info'],
        ['  ls             list files here', 'pt-line-info'],
        ['  cat <file>     read a file', 'pt-line-info'],
        ['  touch <file>   create an empty file', 'pt-line-info'],
        ['  mkdir <name>   create a folder', 'pt-line-info'],
        ['  mv <a> <b>     move (or rename) a file', 'pt-line-info'],
        ['  rm <file>      delete a file (no undo!)', 'pt-line-info'],
        ['  echo <words>   say something back', 'pt-line-info'],
        ['  clear          wipe the screen', 'pt-line-info'],
      ];
    },

    pwd() {
      return [[HOME, null]];
    },

    ls() {
      if (fs.size === 0) return [['(empty — nothing here)', 'pt-line-dim']];
      const names = [...fs.entries()]
        .map(([name, entry]) => (entry.type === 'dir' ? name + '/' : name))
        .sort();
      return [[names.join('   '), null]];
    },

    cat(args) {
      if (!args[0]) return [['cat: tell me which file! try: cat mission.txt', 'pt-line-alert']];
      const entry = findEntry(args[0]);
      if (!entry) return [[`cat: ${args[0]}: No such file`, 'pt-line-alert']];
      if (entry.type === 'dir') return [[`cat: ${args[0]}: That's a folder, not a file`, 'pt-line-alert']];
      if (!entry.content) return [['(this file is empty)', 'pt-line-dim']];
      return entry.content.split('\n').map((l) => [l, 'pt-line-gold']);
    },

    touch(args) {
      if (!args[0]) return [['touch: give your new file a name! try: touch sea-dog-biscuit.txt', 'pt-line-alert']];
      if (findEntry(args[0])) return [[`touch: ${args[0]} already exists`, 'pt-line-dim']];
      fs.set(args[0], { type: 'file', content: '' });
      return [[`created: ${args[0]}`, null]];
    },

    mkdir(args) {
      if (!args[0]) return [['mkdir: name your folder! try: mkdir lookout', 'pt-line-alert']];
      if (findEntry(args[0])) return [[`mkdir: ${args[0]} already exists`, 'pt-line-alert']];
      fs.set(args[0], { type: 'dir', children: new Map() });
      return [[`created folder: ${args[0]}/`, null]];
    },

    mv(args) {
      if (args.length < 2) return [['mv: needs two things! try: mv sea-dog-biscuit.txt lookout', 'pt-line-alert']];
      const [srcName, dstName] = args;
      const src = findEntry(srcName);
      if (!src) return [[`mv: ${srcName}: No such file`, 'pt-line-alert']];
      const dst = findEntry(dstName);
      if (dst && dst.type === 'dir') {
        fs.delete(srcName);
        dst.children.set(srcName, src);
        return [[`moved ${srcName} into ${dstName}/`, null]];
      }
      fs.delete(srcName);
      fs.set(dstName, src);
      return [[`renamed ${srcName} to ${dstName}`, null]];
    },

    rm(args) {
      if (!args[0]) return [['rm: tell me what to delete! try: rm acorn-virus.exe', 'pt-line-alert']];
      const entry = findEntry(args[0]);
      if (!entry) return [[`rm: ${args[0]}: No such file`, 'pt-line-alert']];
      if (entry.type === 'dir') return [[`rm: ${args[0]} is a folder — let's leave folders alone for now`, 'pt-line-alert']];
      fs.delete(args[0]);
      return [[`deleted: ${args[0]}`, null]];
    },

    echo(args) {
      return [[args.join(' ') || '', null]];
    },

    clear() {
      output.textContent = '';
      return [];
    },
  };

  /* ---------- Game loop ---------- */

  function parse(raw) {
    const parts = raw.trim().split(/\s+/);
    return { name: parts[0] ?? '', args: parts.slice(1) };
  }

  // During the game, HQ blocks wrong-but-destructive moves (like deleting
  // the wrong file) and mission-specific mistakes. Free play allows anything.
  function guardCommand(cmd) {
    if (missionIndex < 0) return null;
    const mission = MISSIONS[missionIndex];

    if (cmd.name === 'rm' && cmd.args[0] && findEntry(cmd.args[0]) && !mission.check(cmd)) {
      if (mission.cmd.startsWith('rm')) {
        return [
          '⛔ HQ OVERRIDE: hold your fire, agent!',
          `${cmd.args[0]} is friendly. The threat is acorn-virus.exe.`,
          'Try: rm acorn-virus.exe',
        ];
      }
      return [
        '⛔ HQ OVERRIDE: hold your fire, agent!',
        'You have no demolition orders right now — that file might matter later.',
      ];
    }

    return mission.guard ? mission.guard(cmd) : null;
  }

  async function handleCommand(raw) {
    const cmd = parse(raw);
    addLine(`slugger@patrol:~$ ${raw}`, 'pt-line-user');

    if (!cmd.name) return;

    const impl = COMMANDS[cmd.name];
    if (!impl) {
      addLine(`command not found: ${cmd.name} — type help to see your toolkit`, 'pt-line-alert');
      return;
    }

    const blocked = guardCommand(cmd);
    if (blocked) {
      for (const text of blocked) {
        addLine(text, 'pt-line-alert');
        await sleep(30);
      }
      return;
    }

    const lines = impl(cmd.args);
    for (const [text, cls] of lines) {
      addLine(text, cls);
      await sleep(30);
    }

    // Mission progression
    const mission = MISSIONS[missionIndex];
    if (mission && mission.check(cmd)) {
      await sleep(250);
      for (const text of mission.success) {
        await typeLine(`>> ${fmt(text)}`, 'pt-line-gold', 10);
      }
      missionIndex += 1;

      if (missionIndex < MISSIONS.length) {
        await sleep(300);
        addLine('', null);
        await showMission();
      } else {
        await finale();
      }
    }
  }

  async function finale() {
    missionIndex = -1;
    await sleep(400);
    addLine('', null);
    await typeLine('*** OPERATION BACKYARD SHIELD: COMPLETE ***', 'pt-line-gold', 15);
    await typeLine(fmt('Outstanding work, Agent {AGENT}.'), 'pt-line-gold', 15);
    await printLines([
      'Patrol mode: ACTIVATED. Slugger is on duty. 🐕‍🦺',
      '',
      'You just used 8 real Linux commands — the same ones that',
      'control robots, servers, and, well... Slugger.',
      '',
      'Try them on a real computer:',
      '🍎 Mac: press Cmd + Space, type "Terminal", press Enter.',
      '🪟 Windows: press the Windows key, type "PowerShell", press Enter.',
      '   (one twist: on Windows, "touch" is spelled "ni")',
      '',
      'The terminal is not scary. The terminal is your friend.',
      '(Free play unlocked — keep typing commands as long as you like.)',
    ], 'pt-line-info', 110);
    terminal.classList.add('pt-complete');
  }

  /* ---------- Wiring ---------- */

  bootBtn.addEventListener('click', () => {
    if (busy) return;
    busy = true;
    boot().finally(() => { busy = false; });
  });

  async function handleCodename(raw) {
    agentName = sanitizeName(raw);
    inputMode = 'command';
    inputRow.hidden = true;
    addLine(`> ${agentName}`, 'pt-line-user');
    await sleep(300);
    await welcomeAgent();
  }

  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || busy) return;
    const raw = input.value;
    input.value = '';
    busy = true;
    const job = inputMode === 'codename' ? handleCodename(raw) : handleCommand(raw);
    job.finally(() => {
      busy = false;
      input.focus();
    });
  });

  /* ---------- Incoming transmission modal ---------- */

  if (modal && modalChoice && modalNameForm && modalNameInput && acceptBtn && declineBtn) {
    // Auto-open a couple seconds after landing.
    setTimeout(() => {
      if (busy || missionIndex !== -1) return;
      modal.showModal();
      playAlertSound(); // may be silent until the user's first click
    }, 2200);

    acceptBtn.addEventListener('click', () => {
      playConfirmBeep();
      modalChoice.hidden = true;
      modalNameForm.hidden = false;
      modalNameInput.focus();
    });

    declineBtn.addEventListener('click', () => {
      modal.close();
    });

    modalNameForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (busy) return;
      agentName = sanitizeName(modalNameInput.value);
      playConfirmBeep();
      modal.close();
      terminal.scrollIntoView({ behavior: 'smooth', block: 'center' });
      busy = true;
      boot().finally(() => { busy = false; });
    });
  }

  // Clicking anywhere on the screen refocuses the input (like a real terminal).
  screen.addEventListener('click', () => {
    if (!inputRow.hidden) input.focus();
  });
});
