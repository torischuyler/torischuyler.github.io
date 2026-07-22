/**
 * Interactive US map of official state fruits and berries.
 * Add new items to STATE_PRODUCE — legend + highlights update from that data.
 */
(function () {
  const MAP_URL = "/assets/maps/us-states.svg";
  const STATE_NAMES = {
    al: "Alabama",
    ak: "Alaska",
    az: "Arizona",
    ar: "Arkansas",
    ca: "California",
    co: "Colorado",
    ct: "Connecticut",
    de: "Delaware",
    dc: "District of Columbia",
    fl: "Florida",
    ga: "Georgia",
    hi: "Hawaii",
    id: "Idaho",
    il: "Illinois",
    in: "Indiana",
    ia: "Iowa",
    ks: "Kansas",
    ky: "Kentucky",
    la: "Louisiana",
    me: "Maine",
    md: "Maryland",
    ma: "Massachusetts",
    mi: "Michigan",
    mn: "Minnesota",
    ms: "Mississippi",
    mo: "Missouri",
    mt: "Montana",
    ne: "Nebraska",
    nv: "Nevada",
    nh: "New Hampshire",
    nj: "New Jersey",
    nm: "New Mexico",
    ny: "New York",
    nc: "North Carolina",
    nd: "North Dakota",
    oh: "Ohio",
    ok: "Oklahoma",
    or: "Oregon",
    pa: "Pennsylvania",
    ri: "Rhode Island",
    sc: "South Carolina",
    sd: "South Dakota",
    tn: "Tennessee",
    tx: "Texas",
    ut: "Utah",
    vt: "Vermont",
    va: "Virginia",
    wa: "Washington",
    wv: "West Virginia",
    wi: "Wisconsin",
    wy: "Wyoming",
  };

  /**
   * Official state fruit/berry designations.
   * `states` maps postal code → { designation, year, fruitName? }.
   * `fruitName` overrides the produce label in focus copy (e.g. variety).
   */
  const STATE_PRODUCE = [
    {
      id: "blueberry",
      label: "Blueberry",
      emoji: "🫐",
      className: "fruit-blueberry",
      href: "/til/pies/recipes/fourth-of-july-pie.html",
      states: {
        me: {
          designation: "berry",
          year: 1991,
          factLines: [
            "Official state berry",
            "is the blueberry.",
            "(1991)",
          ],
        },
        nj: {
          designation: "fruit",
          year: 2003,
          factLines: [
            "Official state fruit",
            "is the blueberry.",
            "(2003)",
          ],
        },
        nc: {
          designation: "berry",
          year: 2001,
          factLines: [
            "Official state berries are",
            "the blueberry and the strawberry.",
            "(2001)",
          ],
        },
        ms: {
          designation: "fruit",
          year: 2023,
          factLines: [
            "Official state fruit",
            "is the blueberry.",
            "(2023)",
          ],
        },
      },
    },
    {
      id: "apple",
      label: "Apple",
      emoji: "🍎",
      className: "fruit-apple",
      href: "/til/pies/recipes/apple-pie.html",
      states: {
        ny: {
          designation: "fruit",
          year: 1976,
          factLines: [
            "Official state fruit",
            "is the apple.",
            "(1976)",
          ],
        },
        wa: {
          designation: "fruit",
          year: 1989,
          factLines: [
            "Official state fruit",
            "is the apple.",
            "(1989)",
          ],
        },
        vt: {
          designation: "fruit",
          year: 1999,
          factLines: [
            "Official state fruit",
            "is the apple.",
            "The official state pie",
            "is the apple pie.",
            "(1999)",
          ],
        },
        wv: {
          designation: "fruit",
          year: 1995,
          fruitName: "Golden Delicious apple",
          factLines: [
            "Official state fruit is the",
            "Golden Delicious apple.",
            "(1995)",
          ],
        },
        mn: { designation: "fruit", year: 2006, fruitName: "Honeycrisp apple" },
        il: { designation: "fruit", year: 2007, fruitName: "GoldRush apple" },
        ri: {
          designation: "fruit",
          year: 1991,
          fruitName: "Greening apple",
          factLines: [
            "Official state fruit is the",
            "Greening apple.",
            "(1991)",
          ],
        },
      },
    },
  ];

  const produceByState = Object.create(null);
  for (const produce of STATE_PRODUCE) {
    for (const [code, info] of Object.entries(produce.states)) {
      produceByState[code] = { produce, ...info };
    }
  }

  function designationPhrase(designation) {
    return designation === "berry" ? "state berry" : "state fruit";
  }

  function buildLegend(listEl) {
    listEl.replaceChildren();
    for (const produce of STATE_PRODUCE) {
      const li = document.createElement("li");
      li.className = "pies-map-legend-item";
      li.setAttribute("aria-label", produce.label);

      const swatch = document.createElement("span");
      swatch.className = `pies-map-swatch ${produce.className}`;
      swatch.setAttribute("aria-hidden", "true");

      const text = document.createElement("span");
      text.className = "pies-map-legend-label";
      text.textContent = produce.label;

      const emoji = document.createElement("span");
      emoji.className = "pies-map-legend-emoji";
      emoji.setAttribute("aria-hidden", "true");
      emoji.textContent = produce.emoji || produce.label;

      li.append(swatch, text, emoji);
      listEl.append(li);
    }
  }

  function isCoarsePointerUi() {
    return (
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    );
  }

  function isTouchUi() {
    return isCoarsePointerUi() || window.matchMedia("(width <= 768px)").matches;
  }

  /** Desktop focus artboard + desktop FOCUS_TUNING (even in a narrow browser window). */
  function useDesktopFocusLayout() {
    return !isCoarsePointerUi();
  }

  function clearStatus(statusEl) {
    statusEl.replaceChildren();
  }

  function hideStatePie(pieBtn) {
    pieBtn.hidden = true;
    pieBtn.classList.remove("is-visible");
    pieBtn.removeAttribute("aria-label");
    pieBtn.setAttribute("aria-hidden", "true");
    pieBtn.onclick = null;
  }

  /**
   * Cleaner focus-only silhouettes when the US map path is too crude zoomed in.
   * Paths are north-up local coords (not the overview map projection).
   */
  const FOCUS_OUTLINES = {
    wa: {
      viewBox: "0 0 325.48 200",
      // Mainland + Puget Sound / San Juan islands (us-atlas / Census),
      // horizontally tightened so focus view isn't a golden-rectangle slab.
      d: "M320.70,0.20L320.55,14.61L320.55,36.51L320.26,50.72L320.26,85.59L320.40,88.18L320.40,150.12L319.36,152.51L322.34,156.28L323.54,158.97L323.54,162.10L325.33,164.08L322.79,168.70L323.84,169.25L325.48,173.87L300.97,173.72L263.61,173.57L239.26,173.62L237.61,175.41L233.42,177.50L230.59,177.79L228.05,177.10L218.48,179.04L214.90,177.94L212.80,179.09L210.86,181.92L205.33,182.41L198.46,183.76L194.13,186.04L189.94,187.38L188.29,189.47L185.31,189.72L180.22,191.01L176.94,191.31L173.80,188.77L170.66,188.33L168.42,190.06L161.40,192.60L159.75,194.29L157.81,193.49L152.73,193.69L149.89,196.17L147.79,196.37L146.46,192.65L141.37,190.66L138.68,191.36L136.14,190.91L133.30,189.42L129.12,190.71L124.78,191.31L121.64,190.56L119.40,191.36L117.61,193.59L109.54,197.71L106.11,198.06L102.66,200.00L99.98,199.75L98.04,198.16L95.49,198.86L93.85,197.91L86.98,196.17L82.04,193.49L81.60,191.01L82.20,188.97L80.70,184.60L81.14,181.27L80.10,178.69L79.95,175.86L77.26,171.83L76.21,168.80L67.40,162.89L65.30,162.69L60.52,165.23L56.79,165.18L54.24,163.09L54.40,160.36L52.45,158.12L49.31,158.62L44.24,158.17L43.78,156.48L41.99,156.18L40.50,157.72L38.56,157.23L35.72,159.76L34.37,159.41L31.23,155.74L29.74,155.34L28.69,157.68L27.20,158.17L28.09,151.27L28.25,145.11L27.65,136.91L29.59,139.94L29.29,144.91L29.89,151.71L32.43,151.71L32.58,149.88L31.08,147.89L31.08,144.86L32.88,146.70L34.97,142.57L32.13,136.81L33.78,134.72L37.51,132.09L34.97,130.25L34.07,131.59L31.38,131.69L31.98,132.84L29.59,132.64L26.60,130.45L26.45,127.72L24.80,121.26L26.00,120.86L26.90,123.45L28.54,121.91L36.32,118.78L34.82,117.44L29.74,116.29L29.44,114.06L25.40,113.36L24.21,114.56L25.40,119.03L23.01,120.07L23.46,118.18L22.87,107.95L20.77,99.21L17.19,95.23L15.84,84.95L15.09,81.12L12.85,73.08L10.76,71.29L10.16,68.55L8.07,67.41L7.32,65.87L4.49,64.43L2.69,58.97L1.50,53.95L1.64,51.32L0.00,48.53L1.79,45.65L3.14,38.80L0.30,36.51L0.75,35.42L3.29,35.37L9.27,38.10L14.05,41.28L15.54,41.33L19.27,43.27L20.17,42.67L26.30,45.40L26.15,46.40L31.38,48.44L39.75,48.98L42.89,48.34L47.52,50.17L48.87,49.23L50.36,50.12L53.95,49.78L55.74,51.37L61.87,51.27L66.65,47.74L66.20,48.93L69.49,51.02L70.54,53.25L73.08,52.41L75.61,52.66L75.17,54.25L77.26,55.24L77.41,58.17L78.90,57.87L79.35,55.24L77.26,53.55L77.26,51.56L79.06,50.17L82.20,49.68L82.64,51.22L80.40,52.91L81.89,55.39L82.94,55.09L83.24,52.71L84.74,52.01L85.93,56.98L83.69,57.48L85.33,59.56L86.53,63.44L88.47,64.48L87.27,65.72L84.88,65.62L85.18,67.71L82.64,69.50L81.30,75.11L79.21,75.56L80.85,69.95L79.95,69.10L77.11,74.12L76.51,76.75L73.38,80.23L67.69,89.32L65.76,95.23L67.55,94.83L70.98,95.48L72.78,94.14L75.92,93.29L76.36,91.41L69.79,94.49L67.25,93.14L73.53,81.92L78.16,78.24L82.49,76.85L82.94,73.22L85.33,69.60L89.96,66.22L88.62,61.40L91.91,63.39L94.00,72.68L90.71,72.68L91.16,74.66L92.80,75.36L92.20,78.14L93.25,79.09L93.25,81.72L91.16,83.61L91.01,85.49L93.25,86.29L91.76,88.67L90.86,93.00L91.46,94.04L89.96,96.87L91.01,99.30L88.77,103.23L84.74,99.35L85.93,94.59L83.53,96.67L82.64,99.80L87.13,103.92L85.63,104.72L85.78,107.10L84.13,108.40L81.74,106.11L78.75,100.89L80.55,99.06L80.70,96.03L79.65,94.78L79.65,97.32L77.86,100.15L78.90,103.73L78.00,106.11L79.95,105.41L81.60,108.69L85.63,109.79L87.27,107.95L87.27,106.31L89.22,105.51L90.41,101.59L91.91,98.96L91.61,97.47L95.34,100.35L96.84,99.11L96.24,97.32L100.27,95.63L100.27,93.14L99.08,90.26L97.88,89.72L98.78,87.98L97.29,85.99L96.24,82.46L99.53,80.58L95.94,77.69L98.33,73.62L97.44,69.10L99.68,66.82L101.02,60.90L104.31,59.66L104.16,56.23L102.07,55.09L98.63,50.82L98.78,47.14L97.29,44.71L95.05,44.51L95.49,45.70L93.85,47.09L95.34,50.42L98.04,52.91L98.19,54.64L94.30,50.42L92.51,50.22L91.46,47.34L91.76,43.52L94.45,42.32L96.84,43.42L98.33,41.33L96.84,39.10L92.66,36.86L90.71,34.48L90.86,32.54L86.53,34.18L85.48,32.54L86.08,30.30L84.13,31.15L84.59,29.21L88.17,27.82L90.12,28.56L91.46,31.00L94.30,30.65L92.80,25.29L95.34,24.99L96.09,23.30L92.95,20.02L92.20,16.74L93.40,14.56L91.46,13.07L88.92,13.36L87.27,15.40L88.62,17.59L85.78,15.60L86.98,12.77L85.48,11.53L84.13,12.22L83.99,8.99L80.85,6.31L82.49,5.27L81.74,3.48L79.80,2.68L82.20,0.00L109.69,0.00L124.19,0.30L145.86,0.05L167.23,0.15L195.62,0.15L220.87,0.15L245.53,0.10L272.13,0.10L320.70,0.20ZM63.66,23.50L64.71,22.01L67.69,21.96L68.00,23.40L70.24,25.04L72.78,25.48L70.08,22.06L75.61,16.69L77.41,16.79L82.94,19.67L80.10,22.16L81.74,25.43L81.45,28.51L79.80,29.76L80.40,33.18L77.41,33.78L75.17,31.30L73.82,31.89L70.54,31.35L65.90,28.27L65.01,24.49L63.66,23.50ZM81.74,44.81L83.69,40.39L85.78,37.46L86.08,34.72L88.47,34.18L89.52,35.12L89.52,37.56L92.35,39.44L92.80,40.74L90.56,41.68L88.02,40.93L87.87,42.37L85.93,44.06L83.84,44.41L84.28,45.60L87.72,45.11L89.37,47.19L90.56,51.37L89.96,52.06L91.46,57.03L92.66,55.69L91.91,52.36L93.40,52.51L95.79,55.34L98.19,55.99L99.23,60.66L98.04,63.54L95.94,62.89L94.15,58.62L91.01,59.86L91.31,58.37L88.47,56.18L88.92,51.56L88.17,48.78L85.48,48.98L85.03,47.49L81.74,44.81ZM91.91,95.03L92.51,89.82L94.00,86.24L95.79,88.82L95.49,91.70L98.33,93.29L95.64,94.63L94.90,95.93L92.20,96.52L91.91,95.03ZM73.08,12.07L74.72,12.27L79.80,14.90L78.61,15.30L75.32,14.31L73.08,12.07ZM82.94,24.19L84.13,22.75L85.93,25.09L83.69,26.73L82.94,24.19ZM83.69,15.65L84.59,14.95L88.47,20.67L85.78,18.58L83.69,15.65Z",
    },
    ri: {
      viewBox: "0 0 170.44 165",
      // Mainland + Aquidneck + Conanicut/Prudence + Block Island (us-atlas / Census).
      // Block Island: small mark just south of the mainland (no overlap).
      d: "M0.00,161.19L6.62,155.45L4.14,140.40L14.07,138.81L16.55,97.43L16.55,67.72L14.07,23.76L14.07,2.57L110.04,0.00L110.04,29.11L119.97,27.92L118.31,43.96L122.45,55.05L138.17,61.58L146.44,71.09L143.96,80.00L132.38,88.12L127.41,79.80L130.72,72.87L115.00,62.18L108.38,54.26L112.52,79.80L94.32,76.44L104.25,84.16L105.07,99.01L95.15,101.19L101.77,111.68L101.77,125.94L93.49,134.85L86.87,149.31L76.94,148.12L54.61,151.68L32.27,158.42L0.83,164.36L0.00,161.19Z M153.06,79.21L167.95,82.77L170.44,120.20L153.89,129.31L148.92,109.11L150.58,96.44L142.31,92.08L143.96,123.56L129.90,123.17L128.24,130.10L119.97,131.49L119.14,120.59L132.38,101.78L139.00,88.32L153.06,79.21Z M59.80,158.80L65.40,153.40L67.60,154.60L66.40,160.20L59.80,158.80Z M105.90,128.71L110.87,118.61L107.56,114.06L111.69,102.77L115.00,106.73L115.00,123.56L105.90,128.71Z M114.18,82.57L118.31,81.19L127.41,91.49L123.28,92.87L114.18,82.57Z",
    },
  };

  function buildFocusStateClone(stateEl, code) {
    const outline = FOCUS_OUTLINES[code];
    if (!outline) {
      const clone = stateEl.cloneNode(true);
      clone.removeAttribute("tabindex");
      clone.removeAttribute("role");
      clone.removeAttribute("aria-label");
      clone.classList.remove("is-selected");
      return { clone, bbox: stateEl.getBBox() };
    }

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", outline.d);
    for (const cls of stateEl.classList) {
      if (cls === "is-selected") continue;
      path.classList.add(cls);
    }
    return { clone: path, bbox: null, viewBox: outline.viewBox };
  }

  /**
   * Per-state mobile focus tweaks. Once a state looks right, leave it alone.
   * zoom/pad = size, offsetX/offsetY = nudge (px), cue* = "Slice me!" placement.
   */
  const FOCUS_TUNING = {
    // Locked
    me: {
      pad: 0.12,
      zoom: 1.28,
      offsetX: 18,
      offsetY: -28,
      // Three-line berry fact — stack on mobile + desktop
      factDetailDirection: "column",
      factDetailGap: "0.15rem",
      factDetailMaxWidth: "none",
      factLineWidth: "max-content",
      factLineWhiteSpace: "nowrap",
      // Desktop-only display type
      desktopOffsetX: 120,
      desktopOffsetY: -44,
      desktopFactNameSize: "4.6rem",
      desktopFactNameMaxWidth: "24rem",
      desktopFactDetailSize: "1.55rem",
      desktopFactDetailMaxWidth: "none",
      desktopFactDetailDirection: "column",
      desktopFactDetailGap: "0.15rem",
      desktopFactLineWidth: "max-content",
      desktopFactLineWhiteSpace: "nowrap",
      // Size pie from the state box so it covers Maine’s jagged coast like mobile.
      desktopPieScale: 0.88,
      desktopCueSize: "0.2em",
      desktopKnifePieX: 1.02,
      desktopKnifePieY: -0.02,
      desktopKnifeSize: "clamp(8.5rem, 15vw, 12rem)",
    },
    ms: {
      pad: 0.14,
      zoom: 1.1,
      offsetX: 0,
      offsetY: 80,
      knifePieX: 1.02,
      knifePieY: -0.02,
      // Three-line fruit fact — stack on mobile + desktop
      factDetailDirection: "column",
      factDetailGap: "0.15rem",
      factDetailMaxWidth: "none",
      factLineWidth: "max-content",
      factLineWhiteSpace: "nowrap",
      // Match Maine desktop type
      desktopOffsetY: 58,
      desktopFactNameSize: "4.6rem",
      desktopFactNameMaxWidth: "24rem",
      desktopFactDetailSize: "1.55rem",
      desktopFactDetailMaxWidth: "none",
      desktopFactDetailDirection: "column",
      desktopFactDetailGap: "0.15rem",
      desktopFactLineWidth: "max-content",
      desktopFactLineWhiteSpace: "nowrap",
      // Size pie from the state box so coverage matches mobile.
      desktopPieScale: 0.88,
      desktopCueSize: "0.2em",
      desktopKnifeSize: "clamp(8.5rem, 15vw, 12rem)",
      desktopKnifePieX: 0.9,
      desktopKnifePieY: 0.1,
    },
    nj: {
      pad: 0.06,
      zoom: 1.4,
      offsetX: 28,
      // Real phones sit lower than desktop emulators; keep this modest.
      offsetY: 70,
      cueX: "56%",
      cueY: "58%",
      cueRotate: "-4deg",
      knifePieX: 1.02,
      knifePieY: -0.02,
      // Three-line fruit fact — stack on mobile + desktop
      factDetailDirection: "column",
      factDetailGap: "0.15rem",
      factDetailMaxWidth: "none",
      factLineWidth: "max-content",
      factLineWhiteSpace: "nowrap",
      // Match Maine / Mississippi desktop type
      desktopOffsetX: 168,
      desktopOffsetY: 84,
      desktopZoom: 0.92,
      desktopFactNameSize: "4.6rem",
      desktopFactNameMaxWidth: "none",
      desktopFactNameWhiteSpace: "nowrap",
      desktopFactDetailSize: "1.55rem",
      desktopFactDetailMaxWidth: "none",
      desktopFactDetailDirection: "column",
      desktopFactDetailGap: "0.15rem",
      desktopFactLineWidth: "max-content",
      desktopFactLineWhiteSpace: "nowrap",
      // Size pie from the state box so coverage matches mobile.
      desktopPieScale: 0.85,
      desktopCueSize: "0.2em",
      desktopKnifeSize: "clamp(8.5rem, 15vw, 12rem)",
      desktopKnifePieX: 1.05,
      desktopKnifePieY: -0.06,
    },
    nc: {
      pad: 0.02,
      zoom: 1.6,
      offsetX: 0,
      // Nudge state + pie down a touch; knifeOffsetY holds the knife in place.
      offsetY: 120,
      cueX: "50%",
      cueY: "52%",
      cueRotate: "-6deg",
      // Park knife on the pie's upper-right so a cut reads across NC.
      knifePieX: 1.02,
      knifePieY: -0.02,
      knifeOffsetY: 12,
      // Three-line berry fact — stack on mobile + desktop
      factDetailDirection: "column",
      factDetailGap: "0.15rem",
      factDetailMaxWidth: "none",
      factLineWidth: "max-content",
      factLineWhiteSpace: "nowrap",
      // Match other states’ desktop type; keep name on one line.
      desktopZoom: 1.25,
      desktopOffsetY: 96,
      desktopFactNameSize: "4.6rem",
      desktopFactNameMaxWidth: "none",
      desktopFactNameWhiteSpace: "nowrap",
      desktopFactDetailSize: "1.55rem",
      desktopFactDetailMaxWidth: "none",
      desktopFactDetailDirection: "column",
      desktopFactDetailGap: "0.15rem",
      desktopFactLineWidth: "max-content",
      desktopFactLineWhiteSpace: "nowrap",
      // Size pie from the state box so coverage matches mobile.
      desktopPieScale: 0.64,
      desktopCueSize: "0.2em",
      desktopKnifeSize: "clamp(8.5rem, 15vw, 12rem)",
      desktopKnifePieX: 0.9,
      desktopKnifePieY: 0.1,
    },
    // Locked (desktop)
    ny: {
      pad: 0.1,
      zoom: 1.2,
      offsetX: 0,
      offsetY: 24,
      knifePieX: 1.02,
      knifePieY: -0.02,
      // Three-line fruit fact — stack on mobile + desktop
      factDetailDirection: "column",
      factDetailGap: "0.15rem",
      factDetailMaxWidth: "none",
      factLineWidth: "max-content",
      factLineWhiteSpace: "nowrap",
      desktopFactNameSize: "4.6rem",
      desktopFactNameMaxWidth: "24rem",
      desktopFactDetailSize: "1.55rem",
      desktopFactDetailMaxWidth: "none",
      desktopFactDetailDirection: "column",
      desktopFactDetailGap: "0.15rem",
      desktopFactLineWidth: "max-content",
      desktopFactLineWhiteSpace: "nowrap",
      desktopPieScale: 0.55,
      desktopCueSize: "0.2em",
      desktopKnifeSize: "clamp(8.5rem, 15vw, 12rem)",
      desktopKnifePieX: 0.9,
      desktopKnifePieY: 0.1,
    },
    // Apple stubs — tune with live QA, then lock
    wa: {
      pad: 0.1,
      zoom: 1.15,
      offsetX: 40,
      offsetY: 68,
      knifePieX: 1.02,
      knifePieY: -0.02,
      factDetailDirection: "column",
      factDetailGap: "0.15rem",
      factDetailMaxWidth: "none",
      factLineWidth: "max-content",
      factLineWhiteSpace: "nowrap",
      desktopOffsetX: 148,
      desktopOffsetY: 116,
      desktopZoom: 0.85,
      desktopFactNameSize: "4.6rem",
      desktopFactNameMaxWidth: "24rem",
      desktopFactDetailSize: "1.55rem",
      desktopFactDetailMaxWidth: "none",
      desktopFactDetailDirection: "column",
      desktopFactDetailGap: "0.15rem",
      desktopFactLineWidth: "max-content",
      desktopFactLineWhiteSpace: "nowrap",
      desktopPieScale: 0.6,
      desktopCueSize: "0.2em",
      desktopKnifeSize: "clamp(9.25rem, 16vw, 13rem)",
      desktopKnifePieX: 0.9,
      desktopKnifePieY: 0.1,
    },
    vt: {
      pad: 0.08,
      zoom: 1.45,
      offsetX: 0,
      offsetY: 20,
      knifePieX: 1.02,
      knifePieY: -0.02,
      factDetailDirection: "column",
      factDetailGap: "0.15rem",
      factDetailMaxWidth: "none",
      factLineWidth: "max-content",
      factLineWhiteSpace: "nowrap",
      desktopOffsetX: 100,
      desktopZoom: 1.12,
      desktopFactNameSize: "4.6rem",
      desktopFactNameMaxWidth: "24rem",
      desktopFactDetailSize: "1.55rem",
      desktopFactDetailMaxWidth: "none",
      desktopFactDetailDirection: "column",
      desktopFactDetailGap: "0.15rem",
      desktopFactLineWidth: "max-content",
      desktopFactLineWhiteSpace: "nowrap",
      desktopPieScale: 0.72,
      desktopCueSize: "0.2em",
      desktopKnifeSize: "clamp(7.5rem, 13vw, 10.5rem)",
      desktopKnifePieX: 0.9,
      desktopKnifePieY: 0.1,
    },
    wv: {
      pad: 0.1,
      zoom: 1.12,
      offsetX: 0,
      offsetY: 28,
      knifePieX: 1.02,
      knifePieY: -0.02,
      factDetailDirection: "column",
      factDetailGap: "0.15rem",
      factDetailMaxWidth: "none",
      factLineWidth: "max-content",
      factLineWhiteSpace: "nowrap",
      desktopOffsetX: 90,
      desktopOffsetY: 56,
      desktopZoom: 0.92,
      desktopFactNameSize: "4.6rem",
      desktopFactNameMaxWidth: "none",
      desktopFactNameWhiteSpace: "nowrap",
      desktopFactDetailSize: "1.55rem",
      desktopFactDetailMaxWidth: "none",
      desktopFactDetailDirection: "column",
      desktopFactDetailGap: "0.15rem",
      desktopFactLineWidth: "max-content",
      desktopFactLineWhiteSpace: "nowrap",
      desktopPieScale: 0.46,
      desktopCueSize: "0.2em",
      desktopKnifeSize: "clamp(8.5rem, 15vw, 12rem)",
      desktopKnifePieX: 1.05,
      desktopKnifePieY: -0.06,
    },
    mn: {
      pad: 0.12,
      zoom: 1.02,
      offsetX: 24,
      offsetY: 48,
      knifePieX: 1.02,
      knifePieY: -0.02,
      // Keep variety fact as 3 unwrapped lines on mobile + desktop.
      factDetailDirection: "column",
      factDetailGap: "0.15rem",
      factDetailMaxWidth: "none",
      factLineWidth: "max-content",
      factLineWhiteSpace: "nowrap",
      desktopOffsetX: 145,
      desktopOffsetY: 48,
      desktopZoom: 0.92,
      desktopFactNameSize: "4.6rem",
      desktopFactNameMaxWidth: "24rem",
      desktopFactDetailSize: "1.55rem",
      desktopFactDetailMaxWidth: "none",
      desktopFactDetailDirection: "column",
      desktopFactDetailGap: "0.15rem",
      desktopFactLineWidth: "max-content",
      desktopFactLineWhiteSpace: "nowrap",
      desktopPieScale: 0.58,
      desktopCueSize: "0.2em",
      desktopKnifeSize: "clamp(8.5rem, 15vw, 12rem)",
      desktopKnifePieX: 0.9,
      desktopKnifePieY: 0.1,
    },
    // Locked (desktop)
    il: {
      pad: 0.1,
      zoom: 1.25,
      offsetX: 0,
      offsetY: -8,
      knifePieX: 1.02,
      knifePieY: -0.02,
      // Keep variety fact as 3 unwrapped lines on mobile + desktop.
      factDetailDirection: "column",
      factDetailGap: "0.15rem",
      factDetailMaxWidth: "none",
      factLineWidth: "max-content",
      factLineWhiteSpace: "nowrap",
      desktopOffsetY: -34,
      desktopFactNameSize: "4.6rem",
      desktopFactNameMaxWidth: "24rem",
      desktopFactDetailSize: "1.55rem",
      desktopFactDetailMaxWidth: "none",
      desktopFactDetailDirection: "column",
      desktopFactDetailGap: "0.15rem",
      desktopFactLineWidth: "max-content",
      desktopFactLineWhiteSpace: "nowrap",
      desktopPieScale: 0.88,
      desktopCueSize: "0.2em",
      desktopKnifeSize: "clamp(8.5rem, 15vw, 12rem)",
      desktopKnifePieX: 0.9,
      desktopKnifePieY: 0.1,
    },
    ri: {
      pad: 0.08,
      zoom: 0.85,
      offsetX: 0,
      offsetY: 12,
      cueX: "56%",
      cueY: "58%",
      cueRotate: "-4deg",
      knifePieX: 1.02,
      knifePieY: -0.02,
      factDetailDirection: "column",
      factDetailGap: "0.15rem",
      factDetailMaxWidth: "none",
      factLineWidth: "max-content",
      factLineWhiteSpace: "nowrap",
      desktopOffsetX: 170,
      desktopOffsetY: 88,
      desktopZoom: 0.68,
      desktopFactNameSize: "4.6rem",
      desktopFactNameMaxWidth: "none",
      desktopFactNameWhiteSpace: "nowrap",
      desktopFactDetailSize: "1.55rem",
      desktopFactDetailMaxWidth: "none",
      desktopFactDetailDirection: "column",
      desktopFactDetailGap: "0.15rem",
      desktopFactLineWidth: "max-content",
      desktopFactLineWhiteSpace: "nowrap",
      desktopPieScale: 0.48,
      desktopCueSize: "0.2em",
      desktopKnifeSize: "clamp(6.75rem, 11vw, 9rem)",
      desktopKnifePieX: 1.08,
      desktopKnifePieY: -0.08,
    },
  };

  /** Desktop focus is laid out at this artboard size, then scaled to fit. */
  const FOCUS_DESIGN = { width: 1080, height: 620 };

  function getFocusStage(focus) {
    return focus?.querySelector?.("[data-map-focus-stage]") || null;
  }

  function clearFocusArtboardStyles(stage, focus) {
    if (stage) {
      stage.style.position = "";
      stage.style.left = "";
      stage.style.top = "";
      stage.style.width = "";
      stage.style.height = "";
      stage.style.marginLeft = "";
      stage.style.marginTop = "";
      stage.style.transform = "";
      stage.style.transformOrigin = "";
    }
    focus?.classList?.remove("pies-map-focus-artboard");
  }

  function prepareFocusArtboard(focus, canvas) {
    const stage = getFocusStage(focus);
    if (!stage) return canvas;

    if (!useDesktopFocusLayout()) {
      clearFocusArtboardStyles(stage, focus);
      focus._stageScale = 1;
      return stage;
    }

    // Mark artboard mode so narrow-viewport mobile CSS doesn’t shrink
    // type/pie/knife relative to the design-sized state.
    focus.classList.add("pies-map-focus-artboard");

    // Pin artboard size and center it in the canvas (margins, not transform),
    // so scale-from-center later doesn’t shove the stage off-screen.
    stage.style.position = "absolute";
    stage.style.left = "50%";
    stage.style.top = "50%";
    stage.style.width = `${FOCUS_DESIGN.width}px`;
    stage.style.height = `${FOCUS_DESIGN.height}px`;
    stage.style.marginLeft = `${-FOCUS_DESIGN.width / 2}px`;
    stage.style.marginTop = `${-FOCUS_DESIGN.height / 2}px`;
    stage.style.transformOrigin = "center center";
    stage.style.transform = "none";
    focus._stageScale = 1;
    return stage;
  }

  function applyFocusArtboardScale(focus, canvas) {
    const stage = getFocusStage(focus);
    if (!stage || !canvas || !useDesktopFocusLayout()) {
      if (focus) focus._stageScale = 1;
      return 1;
    }

    const scale = Math.min(
      1,
      canvas.clientWidth / FOCUS_DESIGN.width,
      canvas.clientHeight / FOCUS_DESIGN.height
    );
    focus._stageScale = scale;
    stage.style.transform = scale >= 0.999 ? "none" : `scale(${scale})`;
    return scale;
  }

  /**
   * When the artboard is heavily scaled down, grow pie/knife/type a bit so
   * they stay readable and feel as prominent as on a large desktop — pure
   * uniform scale makes them look like dust even when ratios match.
   */
  function boostOverlayForSmallArtboard(focus, pieWrap, knife, factEl, tuning, scale) {
    const COMFORT = 0.72;
    const boost =
      scale > 0 && scale < COMFORT ? Math.min(1.35, COMFORT / scale) : 1;
    focus._overlayBoost = boost;
    if (boost <= 1.001) return;

    const pieSize = pieWrap?.style?.getPropertyValue("--pie-size");
    if (pieSize?.endsWith("px")) {
      pieWrap.style.setProperty(
        "--pie-size",
        `${Math.round(parseFloat(pieSize) * boost)}px`
      );
    }

    if (factEl && tuning) {
      const factBoosts = [
        ["--fact-name-size", tuning.factNameSize],
        ["--fact-detail-size", tuning.factDetailSize],
        ["--fact-name-max-width", tuning.factNameMaxWidth],
        ["--fact-detail-max-width", tuning.factDetailMaxWidth],
      ];
      for (const [prop, base] of factBoosts) {
        if (base && base !== "none") {
          factEl.style.setProperty(prop, `calc(${base} * ${boost})`);
        }
      }
    }

    if (knife) {
      const knifePx = parseFloat(getComputedStyle(knife).fontSize);
      if (knifePx) {
        knife.style.setProperty("--knife-size", `${Math.round(knifePx * boost)}px`);
      }
    }
  }

  function positionFocusPie(pieWrap, layoutBox, stateClone, tuning = {}) {
    const boxRect = layoutBox.getBoundingClientRect();
    const stateRect = stateClone.getBoundingClientRect();
    if (!boxRect.width || !stateRect.width) return;

    if (tuning.pieScale) {
      const size = Math.min(stateRect.width, stateRect.height) * tuning.pieScale;
      pieWrap.style.setProperty("--pie-size", `${Math.round(size)}px`);
    }

    const ox = tuning.pieOffsetX || 0;
    const oy = tuning.pieOffsetY || 0;
    pieWrap.style.left = `${stateRect.left + stateRect.width / 2 - boxRect.left + ox}px`;
    pieWrap.style.top = `${stateRect.top + stateRect.height / 2 - boxRect.top + oy}px`;
  }

  function fitFocusSvg(focusSvg, layoutBox, bbox, tuning) {
    const padRatio = tuning.pad ?? 0.16;
    const zoom = tuning.zoom ?? 1;
    let vbW;
    let vbH;
    let vbX;
    let vbY;

    if (focusSvg.dataset.fixedViewBox) {
      const parts = (focusSvg.getAttribute("viewBox") || "0 0 1 1").split(/[\s,]+/).map(Number);
      vbX = parts[0] || 0;
      vbY = parts[1] || 0;
      vbW = parts[2] || 1;
      vbH = parts[3] || 1;
    } else {
      const pad = Math.max(bbox.width, bbox.height, 8) * padRatio;
      vbX = bbox.x - pad;
      vbY = bbox.y - pad;
      vbW = bbox.width + pad * 2;
      vbH = bbox.height + pad * 2;
      focusSvg.setAttribute("viewBox", `${vbX} ${vbY} ${vbW} ${vbH}`);
    }

    const aspect = vbW / Math.max(vbH, 0.001);
    const maxW = layoutBox.clientWidth * 0.98 * zoom;
    const maxH = layoutBox.clientHeight * 0.92 * zoom;
    let width = maxW;
    let height = width / aspect;
    if (height > maxH) {
      height = maxH;
      width = height * aspect;
    }

    focusSvg.style.width = `${width}px`;
    focusSvg.style.height = `${height}px`;
  }

  function layoutFocusStage(focusSvg, layoutBox, _factEl, stateClone, pieWrap, knife, bbox, tuning) {
    fitFocusSvg(focusSvg, layoutBox, bbox, tuning);
    focusSvg.style.marginTop = `${tuning.offsetY || 0}px`;
    focusSvg.style.marginLeft = `${tuning.offsetX || 0}px`;
    positionFocusPie(pieWrap, layoutBox, stateClone, tuning);
    positionFocusKnife(knife, layoutBox, pieWrap, tuning);
  }

  /** Map vw units to the design artboard width so clamps stay proportional. */
  function resolveArtboardCssSize(value) {
    if (!value || typeof value !== "string") return value;
    return value.replace(
      /([\d.]+)vw/g,
      (_, n) => `${(parseFloat(n) * FOCUS_DESIGN.width) / 100}px`
    );
  }

  function positionFocusKnife(knife, layoutBox, pieWrap, tuning = {}) {
    if (!knife) return;

    if (tuning.knifeSize) {
      const size = useDesktopFocusLayout()
        ? resolveArtboardCssSize(tuning.knifeSize)
        : tuning.knifeSize;
      knife.style.setProperty("--knife-size", size);
    } else knife.style.removeProperty("--knife-size");

    if (tuning.knifePieX == null && tuning.knifePieY == null) {
      knife.dataset.parkMode = "css";
      knife.dataset.parkRight = tuning.knifeRight || "";
      delete knife.dataset.parkLeft;
      delete knife.dataset.parkTop;
      knife.style.left = "";
      knife.style.top = "";
      knife.style.bottom = "";
      knife.style.transform = "";
      knife.style.right = knife.dataset.parkRight || "";
      return;
    }

    const boxRect = layoutBox.getBoundingClientRect();
    const pieRect = pieWrap.getBoundingClientRect();
    if (!boxRect.width || !pieRect.width) return;

    const knifeRect = knife.getBoundingClientRect();
    const knifeW = knifeRect.width || knife.offsetWidth || 0;
    const knifeH = knifeRect.height || knife.offsetHeight || 0;
    const ax =
      pieRect.left + pieRect.width * (tuning.knifePieX ?? 1) - boxRect.left;
    const ay =
      pieRect.top + pieRect.height * (tuning.knifePieY ?? 0) - boxRect.top;
    const left = ax - knifeW * 0.35 + (tuning.knifeOffsetX || 0);
    const top = ay - knifeH * 0.35 + (tuning.knifeOffsetY || 0);

    knife.dataset.parkMode = "pie";
    knife.dataset.parkLeft = String(left);
    knife.dataset.parkTop = String(top);
    delete knife.dataset.parkRight;
    knife.style.right = "auto";
    knife.style.bottom = "auto";
    knife.style.left = `${left}px`;
    knife.style.top = `${top}px`;
    knife.style.transform = "";
  }

  function applyCueTuning(pieWrap, tuning = {}) {
    const pieSize =
      tuning.pieSize && useDesktopFocusLayout()
        ? resolveArtboardCssSize(tuning.pieSize)
        : tuning.pieSize;
    const vars = {
      "--cue-x": tuning.cueX,
      "--cue-y": tuning.cueY,
      "--cue-rotate": tuning.cueRotate,
      "--pie-size": pieSize,
      "--cue-size": tuning.cueSize,
    };
    for (const [name, value] of Object.entries(vars)) {
      if (value) pieWrap.style.setProperty(name, value);
      else pieWrap.style.removeProperty(name);
    }
  }

  function applyFactTuning(factEl, tuning = {}) {
    const vars = {
      "--fact-name-size": tuning.factNameSize,
      "--fact-name-max-width": tuning.factNameMaxWidth,
      "--fact-name-white-space": tuning.factNameWhiteSpace,
      "--fact-detail-size": tuning.factDetailSize,
      "--fact-detail-max-width": tuning.factDetailMaxWidth,
      "--fact-detail-direction": tuning.factDetailDirection,
      "--fact-detail-gap": tuning.factDetailGap,
      "--fact-line-width": tuning.factLineWidth,
      "--fact-line-white-space": tuning.factLineWhiteSpace,
    };
    for (const [name, value] of Object.entries(vars)) {
      if (value) factEl.style.setProperty(name, value);
      else factEl.style.removeProperty(name);
    }
  }

  function rectsOverlap(a, b, pad = 12) {
    return !(
      a.right < b.left + pad ||
      a.left > b.right - pad ||
      a.bottom < b.top + pad ||
      a.top > b.bottom - pad
    );
  }

  function resetFocusKnife(knife) {
    knife.classList.remove("is-dragging", "is-over-pie");
    knife.style.bottom = "";
    knife.style.transform = "";
    if (knife.dataset.parkMode === "pie" && knife.dataset.parkLeft != null) {
      knife.style.right = "auto";
      knife.style.left = `${knife.dataset.parkLeft}px`;
      knife.style.top = `${knife.dataset.parkTop}px`;
      return;
    }
    knife.style.left = "";
    knife.style.top = "";
    knife.style.right = knife.dataset.parkRight || "";
  }

  function wireFocusKnife(focus, getHref) {
    const knife = focus.querySelector("[data-map-focus-knife]");
    const pieWrap = focus.querySelector("[data-map-focus-pie-wrap]");
    const canvas = focus.querySelector(".pies-map-focus-canvas");
    const stage = getFocusStage(focus) || canvas;
    if (!knife || !pieWrap || !canvas || knife.dataset.wired === "true") return;
    knife.dataset.wired = "true";

    let dragging = false;
    let sliced = false;
    let startX = 0;
    let startY = 0;
    let originLeft = 0;
    let originTop = 0;
    let moved = false;

    const stageScale = () => focus._stageScale || 1;

    const finishSlice = () => {
      if (sliced) return;
      sliced = true;
      pieWrap.classList.add("is-sliced");
      knife.classList.add("is-over-pie");
      window.setTimeout(() => {
        window.location.href = getHref();
      }, 380);
    };

    knife.addEventListener("pointerdown", (event) => {
      if (event.button != null && event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      sliced = false;
      moved = false;
      dragging = true;

      const scale = stageScale();
      const stageRect = stage.getBoundingClientRect();
      const knifeRect = knife.getBoundingClientRect();
      // Convert screen coords → stage-local CSS px (undo artboard scale).
      originLeft = (knifeRect.left - stageRect.left) / scale;
      originTop = (knifeRect.top - stageRect.top) / scale;
      startX = event.clientX;
      startY = event.clientY;

      knife.classList.add("is-dragging");
      knife.style.right = "auto";
      knife.style.bottom = "auto";
      knife.style.left = `${originLeft}px`;
      knife.style.top = `${originTop}px`;
      knife.style.transform = "none";
      knife.setPointerCapture(event.pointerId);
    });

    knife.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      event.preventDefault();

      const scale = stageScale();
      const dx = (event.clientX - startX) / scale;
      const dy = (event.clientY - startY) / scale;
      if (Math.abs(dx) + Math.abs(dy) > 6 / scale) moved = true;

      knife.style.left = `${originLeft + dx}px`;
      knife.style.top = `${originTop + dy}px`;

      const over = rectsOverlap(knife.getBoundingClientRect(), pieWrap.getBoundingClientRect());
      knife.classList.toggle("is-over-pie", over);
    });

    const endDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      knife.releasePointerCapture?.(event.pointerId);

      const over = rectsOverlap(knife.getBoundingClientRect(), pieWrap.getBoundingClientRect());
      if (over && moved) {
        finishSlice();
        return;
      }

      // Tap without a drag: still open, for accessibility / impatient thumbs
      if (!moved) {
        finishSlice();
        return;
      }

      resetFocusKnife(knife);
    };

    knife.addEventListener("pointerup", endDrag);
    knife.addEventListener("pointercancel", endDrag);

    knife.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        finishSlice();
      }
    });
  }

  function setFocusFact(factEl, name, detailLines, fullDetail) {
    factEl.replaceChildren();
    const nameEl = document.createElement("span");
    nameEl.className = "pies-map-focus-fact-name";
    nameEl.textContent = name;

    const detailEl = document.createElement("span");
    detailEl.className = "pies-map-focus-fact-detail";
    for (const line of detailLines) {
      const row = document.createElement("span");
      row.className = "pies-map-focus-fact-line";
      row.textContent = line;
      detailEl.append(row);
    }

    factEl.append(nameEl, detailEl);
    factEl.setAttribute("aria-label", fullDetail);
  }

  function getFocusTuning(code) {
    const base = FOCUS_TUNING[code] || {};
    if (!useDesktopFocusLayout()) return base;
    // Mobile offsets were tuned in px for short phones; soften on desktop.
    return {
      ...base,
      zoom: base.desktopZoom ?? base.zoom,
      offsetX: base.desktopOffsetX ?? base.offsetX ?? 0,
      offsetY:
        base.desktopOffsetY != null
          ? base.desktopOffsetY
          : Math.round((base.offsetY || 0) * 0.4),
      knifeOffsetY:
        base.knifeOffsetY == null
          ? base.knifeOffsetY
          : Math.round(base.knifeOffsetY * 0.4),
      factNameSize: base.desktopFactNameSize,
      factNameMaxWidth: base.desktopFactNameMaxWidth,
      factNameWhiteSpace: base.desktopFactNameWhiteSpace,
      factDetailSize: base.desktopFactDetailSize,
      factDetailMaxWidth: base.desktopFactDetailMaxWidth,
      factDetailDirection: base.desktopFactDetailDirection,
      factDetailGap: base.desktopFactDetailGap,
      factLineWidth: base.desktopFactLineWidth,
      factLineWhiteSpace: base.desktopFactLineWhiteSpace,
      pieSize: base.desktopPieSize,
      pieScale: base.desktopPieScale,
      pieOffsetX: base.desktopPieOffsetX,
      pieOffsetY: base.desktopPieOffsetY,
      cueSize: base.desktopCueSize,
      knifePieX: base.desktopKnifePieX ?? base.knifePieX,
      knifePieY: base.desktopKnifePieY ?? base.knifePieY,
      knifeSize: base.desktopKnifeSize,
    };
  }

  function runFocusLayout(focus, focusSvg, canvas, factEl, clone, pieWrap, knife, bbox, tuning) {
    const layoutBox = prepareFocusArtboard(focus, canvas);
    applyFactTuning(factEl, tuning);
    layoutFocusStage(focusSvg, layoutBox, factEl, clone, pieWrap, knife, bbox, tuning);
    const scale = applyFocusArtboardScale(focus, canvas);
    boostOverlayForSmallArtboard(focus, pieWrap, knife, factEl, tuning, scale);
  }

  function openStateFocus(focus, frame, stateEl, fact, href, label, code, picker) {
    const focusSvg = focus.querySelector("[data-map-focus-svg]");
    const factEl = focus.querySelector("[data-map-focus-fact]");
    const pieWrap = focus.querySelector("[data-map-focus-pie-wrap]");
    const knife = focus.querySelector("[data-map-focus-knife]");
    const canvas = focus.querySelector(".pies-map-focus-canvas");
    if (!focusSvg || !factEl || !pieWrap || !knife || !canvas) return;

    const tuning = getFocusTuning(code);
    const built = buildFocusStateClone(stateEl, code);
    const clone = built.clone;

    focusSvg.replaceChildren(clone);
    if (built.viewBox) {
      focusSvg.setAttribute("viewBox", built.viewBox);
      focusSvg.dataset.fixedViewBox = "1";
    } else {
      delete focusSvg.dataset.fixedViewBox;
    }
    const bbox = built.bbox || clone.getBBox();
    focusSvg.setAttribute("aria-label", fact.full);

    setFocusFact(factEl, fact.name, fact.lines, fact.full);
    pieWrap.classList.remove("is-sliced");
    applyCueTuning(pieWrap, tuning);
    applyFactTuning(factEl, tuning);
    knife.classList.remove("is-dragging", "is-over-pie");
    knife.setAttribute(
      "aria-label",
      `Drag the knife across the pie to open the ${label} recipe`
    );

    focus._recipeHref = href;
    focus._focusCode = code;
    wireFocusKnife(focus, () => focus._recipeHref || href);

    if (picker && code) {
      picker.value = code;
      setPickerResetLabel(picker, true);
    }

    focus.hidden = false;
    focus.classList.add("is-open");
    frame.classList.add("is-focused");

    requestAnimationFrame(() => {
      runFocusLayout(focus, focusSvg, canvas, factEl, clone, pieWrap, knife, bbox, tuning);
      requestAnimationFrame(() => {
        runFocusLayout(focus, focusSvg, canvas, factEl, clone, pieWrap, knife, bbox, tuning);
      });
    });
  }

  function closeStateFocus(focus, frame, picker) {
    const focusSvg = focus.querySelector("[data-map-focus-svg]");
    const factEl = focus.querySelector("[data-map-focus-fact]");
    const pieWrap = focus.querySelector("[data-map-focus-pie-wrap]");
    const knife = focus.querySelector("[data-map-focus-knife]");
    const stage = getFocusStage(focus);
    if (focusSvg) {
      focusSvg.replaceChildren();
      focusSvg.style.width = "";
      focusSvg.style.height = "";
      focusSvg.style.marginTop = "";
      focusSvg.style.marginLeft = "";
      delete focusSvg.dataset.fixedViewBox;
    }
    clearFocusArtboardStyles(stage, focus);
    if (factEl) {
      factEl.replaceChildren();
      factEl.removeAttribute("aria-label");
      applyFactTuning(factEl, {});
    }
    if (pieWrap) {
      pieWrap.classList.remove("is-sliced");
      pieWrap.style.left = "";
      pieWrap.style.top = "";
      applyCueTuning(pieWrap, {});
    }
    if (knife) {
      delete knife.dataset.parkMode;
      delete knife.dataset.parkRight;
      delete knife.dataset.parkLeft;
      delete knife.dataset.parkTop;
      knife.style.left = "";
      knife.style.top = "";
      knife.style.right = "";
      knife.style.bottom = "";
      knife.style.transform = "";
      knife.style.removeProperty("--knife-size");
      knife.classList.remove("is-dragging", "is-over-pie");
    }
    if (picker) {
      picker.value = "";
      setPickerResetLabel(picker, false);
    }
    focus._recipeHref = "";
    focus._focusCode = "";
    focus._stageScale = 1;
    focus.classList.remove("is-open");
    focus.hidden = true;
    frame.classList.remove("is-focused");
  }

  function buildStatePicker(picker) {
    const options = [];
    for (const produce of STATE_PRODUCE) {
      for (const code of Object.keys(produce.states)) {
        options.push({
          code,
          label: STATE_NAMES[code] || code.toUpperCase(),
        });
      }
    }
    options.sort((a, b) => a.label.localeCompare(b.label));

    for (const option of options) {
      const el = document.createElement("option");
      el.value = option.code;
      el.textContent = option.label;
      picker.append(el);
    }
  }

  function setPickerResetLabel(picker, selected) {
    const reset = picker.querySelector('option[value=""]');
    if (!reset) return;
    reset.textContent = selected ? "USA" : "Choose a state…";
  }

  function wireState(el, code, entry, frame, statusEl, pieBtn, focus, picker, selection, openers) {
    const { produce, designation, year, fruitName, factLines: customFactLines } = entry;
    const name = STATE_NAMES[code] || code.toUpperCase();
    const kind = designationPhrase(designation);
    const fruitLabel = fruitName || produce.label.toLowerCase();
    const yearSuffix = year ? ` (${year})` : "";
    const detail = `${name}: official ${kind} is the ${fruitLabel}${yearSuffix}`;
    const roleWord = designation === "berry" ? "berry" : "fruit";
    const factLines = customFactLines
      ? customFactLines
      : fruitName
        ? [
            `Official state ${roleWord} is the`,
            `${fruitLabel}.`,
            year ? `(${year})` : "",
          ]
        : [
            "Official state",
            `${roleWord} is the`,
            `${fruitLabel}.`,
            year ? `(${year})` : "",
          ];

    el.classList.add(produce.className);
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "link");
    el.setAttribute(
      "aria-label",
      `${detail}. Open the pie view, then slice for the ${produce.label} recipe.`
    );

    const showFocus = () => {
      if (selection.el) selection.el.classList.remove("is-selected");
      selection.el = el;
      el.classList.add("is-selected");
      clearStatus(statusEl);
      hideStatePie(pieBtn);
      openStateFocus(
        focus,
        frame,
        el,
        {
          name,
          lines: factLines.filter(Boolean),
          full: detail,
        },
        produce.href,
        produce.label,
        code,
        picker
      );
    };

    openers[code] = showFocus;

    el.addEventListener("focus", () => {
      if (isTouchUi()) showFocus();
    });

    el.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      showFocus();
    });

    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showFocus();
      }
    });
  }

  async function init() {
    const root = document.getElementById("state-fruit-map");
    if (!root) return;

    const frame = root.querySelector("[data-map-frame]");
    const legendList = root.querySelector("[data-map-legend]");
    const statusEl = root.querySelector("[data-map-status]");
    const pieBtn = root.querySelector("[data-map-state-pie]");
    const focus = root.querySelector("[data-map-focus]");
    const focusClose = root.querySelector("[data-map-focus-close]");
    const picker = root.querySelector("[data-map-state-picker]");
    if (!frame || !legendList || !statusEl || !pieBtn || !focus || !focusClose || !picker) return;

    buildLegend(legendList);
    buildStatePicker(picker);

    let svgText;
    try {
      const response = await fetch(MAP_URL);
      if (!response.ok) throw new Error(`Map failed to load (${response.status})`);
      svgText = await response.text();
    } catch (error) {
      statusEl.textContent = "Sorry — the map couldn’t load.";
      console.error(error);
      return;
    }

    frame.insertAdjacentHTML("afterbegin", svgText);
    const svg = frame.querySelector("svg.pies-us-map, svg");
    if (!svg) {
      statusEl.textContent = "Sorry — the map couldn’t load.";
      return;
    }

    svg.classList.add("pies-us-map");
    svg.removeAttribute("width");
    svg.removeAttribute("height");

    const selection = {
      el: null,
      clear() {
        if (this.el) this.el.classList.remove("is-selected");
        this.el = null;
        clearStatus(statusEl);
        hideStatePie(pieBtn);
        closeStateFocus(focus, frame, picker);
      },
    };

    const openers = Object.create(null);

    focusClose.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      selection.clear();
    });

    picker.addEventListener("change", () => {
      const code = picker.value;
      if (!code) {
        selection.clear();
        return;
      }
      if (typeof openers[code] === "function") openers[code]();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && focus.classList.contains("is-open")) {
        selection.clear();
      }
    });

    for (const [code, entry] of Object.entries(produceByState)) {
      const nodes = svg.querySelectorAll(`g.state path.${code}, g.state circle.${code}, circle.${code}`);
      nodes.forEach((el) =>
        wireState(el, code, entry, frame, statusEl, pieBtn, focus, picker, selection, openers)
      );
    }

    window.addEventListener("resize", () => {
      if (!selection.el || !focus.classList.contains("is-open")) return;
      const focusSvg = focus.querySelector("[data-map-focus-svg]");
      const clone = focus.querySelector("[data-map-focus-svg] > *");
      const pieWrap = focus.querySelector("[data-map-focus-pie-wrap]");
      const factEl = focus.querySelector("[data-map-focus-fact]");
      const canvas = focus.querySelector(".pies-map-focus-canvas");
      const knife = focus.querySelector("[data-map-focus-knife]");
      if (!focusSvg || !clone || !pieWrap || !factEl || !canvas) return;
      runFocusLayout(
        focus,
        focusSvg,
        canvas,
        factEl,
        clone,
        pieWrap,
        knife,
        clone.getBBox(),
        getFocusTuning(focus._focusCode)
      );
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
