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
   * `states` maps postal code → { designation, year }.
   */
  const STATE_PRODUCE = [
    {
      id: "blueberry",
      label: "Blueberry",
      emoji: "🫐",
      className: "fruit-blueberry",
      href: "/til/pies/recipes/fourth-of-july-pie.html",
      states: {
        me: { designation: "berry", year: 1991 },
        nj: { designation: "fruit", year: 2003 },
        nc: { designation: "berry", year: 2001 },
        ms: { designation: "fruit", year: 2023 },
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

  function isTouchUi() {
    return (
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(width <= 768px)").matches
    );
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
   * Per-state mobile focus tweaks. Once a state looks right, leave it alone.
   * zoom/pad = size, offsetX/offsetY = nudge (px), cue* = "Slice me!" placement.
   */
  const FOCUS_TUNING = {
    // Locked
    me: {
      pad: 0.12,
      zoom: 1.28,
      offsetX: 18,
      offsetY: 0,
      // Desktop-only display type
      desktopOffsetX: 120,
      desktopFactNameSize: "4.6rem",
      desktopFactNameMaxWidth: "24rem",
      desktopFactDetailSize: "1.55rem",
      desktopFactDetailMaxWidth: "calc(100% - 2.5rem)",
      desktopFactDetailDirection: "row",
      desktopFactDetailGap: "0.4rem",
      desktopFactLineWidth: "auto",
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
      offsetY: 56,
      knifePieX: 1.02,
      knifePieY: -0.02,
      // Match Maine desktop type
      desktopFactNameSize: "4.6rem",
      desktopFactNameMaxWidth: "24rem",
      desktopFactDetailSize: "1.55rem",
      desktopFactDetailMaxWidth: "calc(100% - 2.5rem)",
      desktopFactDetailDirection: "row",
      desktopFactDetailGap: "0.4rem",
      desktopFactLineWidth: "auto",
      // Size pie from the state box so coverage matches mobile.
      desktopPieScale: 0.88,
      desktopCueSize: "0.2em",
      desktopKnifeSize: "clamp(8.5rem, 15vw, 12rem)",
      desktopKnifePieX: 0.9,
      desktopKnifePieY: 0.1,
    },
    nj: {
      pad: 0.06,
      zoom: 1.55,
      offsetX: 0,
      // Real phones sit lower than desktop emulators; keep this modest.
      offsetY: 18,
      cueX: "56%",
      cueY: "58%",
      cueRotate: "-4deg",
      knifePieX: 1.02,
      knifePieY: -0.02,
      // Match Maine / Mississippi desktop type
      desktopOffsetX: 120,
      desktopZoom: 1.05,
      desktopFactNameSize: "4.6rem",
      desktopFactNameMaxWidth: "none",
      desktopFactNameWhiteSpace: "nowrap",
      desktopFactDetailSize: "1.55rem",
      desktopFactDetailMaxWidth: "calc(100% - 2.5rem)",
      desktopFactDetailDirection: "row",
      desktopFactDetailGap: "0.4rem",
      desktopFactLineWidth: "auto",
      // Size pie from the state box so coverage matches mobile.
      desktopPieScale: 0.95,
      desktopCueSize: "0.2em",
      desktopKnifeSize: "clamp(8.5rem, 15vw, 12rem)",
      desktopKnifePieX: 0.9,
      desktopKnifePieY: 0.1,
    },
    nc: {
      pad: 0.02,
      zoom: 1.95,
      offsetX: 0,
      // Nudge state + pie up a touch; knifeOffsetY holds the knife in place.
      offsetY: 44,
      cueX: "50%",
      cueY: "52%",
      cueRotate: "-6deg",
      // Park knife on the pie's upper-right so a cut reads across NC.
      knifePieX: 1.02,
      knifePieY: -0.02,
      knifeOffsetY: 12,
      // Match other states’ desktop type; keep name on one line.
      desktopZoom: 1.55,
      desktopOffsetY: -12,
      desktopFactNameSize: "4.6rem",
      desktopFactNameMaxWidth: "none",
      desktopFactNameWhiteSpace: "nowrap",
      desktopFactDetailSize: "1.55rem",
      desktopFactDetailMaxWidth: "calc(100% - 2.5rem)",
      desktopFactDetailDirection: "row",
      desktopFactDetailGap: "0.4rem",
      desktopFactLineWidth: "auto",
      // Size pie from the state box so coverage matches mobile.
      desktopPieScale: 0.78,
      desktopCueSize: "0.2em",
      desktopKnifeSize: "clamp(8.5rem, 15vw, 12rem)",
      desktopKnifePieX: 0.9,
      desktopKnifePieY: 0.1,
    },
  };

  function positionFocusPie(pieWrap, canvas, stateClone, tuning = {}) {
    const canvasRect = canvas.getBoundingClientRect();
    const stateRect = stateClone.getBoundingClientRect();
    if (!canvasRect.width || !stateRect.width) return;

    if (tuning.pieScale) {
      const size = Math.min(stateRect.width, stateRect.height) * tuning.pieScale;
      pieWrap.style.setProperty("--pie-size", `${Math.round(size)}px`);
    }

    const ox = tuning.pieOffsetX || 0;
    const oy = tuning.pieOffsetY || 0;
    pieWrap.style.left = `${stateRect.left + stateRect.width / 2 - canvasRect.left + ox}px`;
    pieWrap.style.top = `${stateRect.top + stateRect.height / 2 - canvasRect.top + oy}px`;
  }

  function fitFocusSvg(focusSvg, canvas, bbox, tuning) {
    const padRatio = tuning.pad ?? 0.16;
    const zoom = tuning.zoom ?? 1;
    const pad = Math.max(bbox.width, bbox.height, 8) * padRatio;
    const vbW = bbox.width + pad * 2;
    const vbH = bbox.height + pad * 2;

    focusSvg.setAttribute(
      "viewBox",
      `${bbox.x - pad} ${bbox.y - pad} ${vbW} ${vbH}`
    );

    const aspect = vbW / Math.max(vbH, 0.001);
    const maxW = canvas.clientWidth * 0.98 * zoom;
    const maxH = canvas.clientHeight * 0.92 * zoom;
    let width = maxW;
    let height = width / aspect;
    if (height > maxH) {
      height = maxH;
      width = height * aspect;
    }

    focusSvg.style.width = `${width}px`;
    focusSvg.style.height = `${height}px`;
  }

  function layoutFocusStage(focusSvg, canvas, _factEl, stateClone, pieWrap, knife, bbox, tuning) {
    fitFocusSvg(focusSvg, canvas, bbox, tuning);
    focusSvg.style.marginTop = `${tuning.offsetY || 0}px`;
    focusSvg.style.marginLeft = `${tuning.offsetX || 0}px`;
    positionFocusPie(pieWrap, canvas, stateClone, tuning);
    positionFocusKnife(knife, canvas, pieWrap, tuning);
  }

  function positionFocusKnife(knife, canvas, pieWrap, tuning = {}) {
    if (!knife) return;

    if (tuning.knifeSize) knife.style.setProperty("--knife-size", tuning.knifeSize);
    else knife.style.removeProperty("--knife-size");

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

    const canvasRect = canvas.getBoundingClientRect();
    const pieRect = pieWrap.getBoundingClientRect();
    if (!canvasRect.width || !pieRect.width) return;

    const knifeRect = knife.getBoundingClientRect();
    const knifeW = knifeRect.width || knife.offsetWidth || 0;
    const knifeH = knifeRect.height || knife.offsetHeight || 0;
    const ax =
      pieRect.left + pieRect.width * (tuning.knifePieX ?? 1) - canvasRect.left;
    const ay =
      pieRect.top + pieRect.height * (tuning.knifePieY ?? 0) - canvasRect.top;
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
    const vars = {
      "--cue-x": tuning.cueX,
      "--cue-y": tuning.cueY,
      "--cue-rotate": tuning.cueRotate,
      "--pie-size": tuning.pieSize,
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
    if (!knife || !pieWrap || !canvas || knife.dataset.wired === "true") return;
    knife.dataset.wired = "true";

    let dragging = false;
    let sliced = false;
    let startX = 0;
    let startY = 0;
    let originLeft = 0;
    let originTop = 0;
    let moved = false;

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

      const canvasRect = canvas.getBoundingClientRect();
      const knifeRect = knife.getBoundingClientRect();
      originLeft = knifeRect.left - canvasRect.left;
      originTop = knifeRect.top - canvasRect.top;
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

      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;

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
    if (isTouchUi()) return base;
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

  function openStateFocus(focus, frame, stateEl, fact, href, label, code, picker) {
    const focusSvg = focus.querySelector("[data-map-focus-svg]");
    const factEl = focus.querySelector("[data-map-focus-fact]");
    const pieWrap = focus.querySelector("[data-map-focus-pie-wrap]");
    const knife = focus.querySelector("[data-map-focus-knife]");
    const canvas = focus.querySelector(".pies-map-focus-canvas");
    if (!focusSvg || !factEl || !pieWrap || !knife || !canvas) return;

    const tuning = getFocusTuning(code);
    const bbox = stateEl.getBBox();
    const clone = stateEl.cloneNode(true);
    clone.removeAttribute("tabindex");
    clone.removeAttribute("role");
    clone.removeAttribute("aria-label");
    clone.classList.remove("is-selected");

    focusSvg.replaceChildren(clone);
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
      layoutFocusStage(focusSvg, canvas, factEl, clone, pieWrap, knife, bbox, tuning);
      requestAnimationFrame(() => {
        layoutFocusStage(focusSvg, canvas, factEl, clone, pieWrap, knife, bbox, tuning);
      });
    });
  }

  function closeStateFocus(focus, frame, picker) {
    const focusSvg = focus.querySelector("[data-map-focus-svg]");
    const factEl = focus.querySelector("[data-map-focus-fact]");
    const pieWrap = focus.querySelector("[data-map-focus-pie-wrap]");
    const knife = focus.querySelector("[data-map-focus-knife]");
    if (focusSvg) {
      focusSvg.replaceChildren();
      focusSvg.style.width = "";
      focusSvg.style.height = "";
      focusSvg.style.marginTop = "";
      focusSvg.style.marginLeft = "";
    }
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
    const { produce, designation, year } = entry;
    const name = STATE_NAMES[code] || code.toUpperCase();
    const kind = designationPhrase(designation);
    const yearSuffix = year ? ` (${year})` : "";
    const detail = `${name}: official ${kind} is ${produce.label}${yearSuffix}`;

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
          lines: [
            "Official state",
            `${designation === "berry" ? "berry" : "fruit"} is the`,
            `${produce.label.toLowerCase()}.`,
            year ? `(${year})` : "",
          ].filter(Boolean),
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
      layoutFocusStage(
        focusSvg,
        canvas,
        factEl,
        clone,
        pieWrap,
        knife,
        selection.el.getBBox(),
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
