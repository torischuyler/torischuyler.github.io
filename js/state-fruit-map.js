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

  function setStatusText(statusEl, message) {
    statusEl.replaceChildren();
    const main = document.createElement("span");
    main.className = "pies-map-status-main";
    main.textContent = message;
    statusEl.append(main);
  }

  function placeStatePie(pieBtn, frame, stateEl) {
    const frameRect = frame.getBoundingClientRect();
    const stateRect = stateEl.getBoundingClientRect();
    const touch = isTouchUi();
    const minSize = touch ? 28 : 42;
    const scale = touch ? 0.55 : 0.9;
    const size = Math.max(minSize, Math.min(stateRect.width, stateRect.height) * scale);

    pieBtn.style.left = `${stateRect.left + stateRect.width / 2 - frameRect.left}px`;
    pieBtn.style.top = `${stateRect.top + stateRect.height / 2 - frameRect.top}px`;
    pieBtn.style.fontSize = `${size}px`;
  }

  function hideStatePie(pieBtn) {
    pieBtn.hidden = true;
    pieBtn.classList.remove("is-visible");
    pieBtn.removeAttribute("aria-label");
    pieBtn.setAttribute("aria-hidden", "true");
    pieBtn.onclick = null;
  }

  function showStatePie(pieBtn, frame, stateEl, href, label) {
    placeStatePie(pieBtn, frame, stateEl);
    pieBtn.hidden = false;
    pieBtn.classList.add("is-visible");
    pieBtn.setAttribute("aria-hidden", "false");
    pieBtn.setAttribute("aria-label", `Open ${label} pie recipe`);
    pieBtn.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      window.location.href = href;
    };
  }

  function wireState(el, code, entry, frame, statusEl, pieBtn, selection) {
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
      `${detail}. Show details, then activate the pie for the ${produce.label} recipe.`
    );

    const go = () => {
      window.location.href = produce.href;
    };

    const showDetails = () => {
      selection.cancelHide();
      if (selection.el) selection.el.classList.remove("is-selected");
      selection.el = el;
      el.classList.add("is-selected");
      setStatusText(statusEl, detail);
      showStatePie(pieBtn, frame, el, produce.href, produce.label);
    };

    el.addEventListener("mouseenter", () => {
      if (!isTouchUi()) showDetails();
    });
    el.addEventListener("mouseleave", () => {
      if (!isTouchUi()) selection.scheduleHide();
    });

    el.addEventListener("focus", showDetails);

    el.addEventListener("blur", () => {
      if (!isTouchUi()) selection.scheduleHide();
    });

    el.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      // Mobile: first tap only reveals text + pie. Desktop: click still opens recipe.
      if (isTouchUi()) {
        showDetails();
        return;
      }
      go();
    });

    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (isTouchUi()) showDetails();
        else go();
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
    if (!frame || !legendList || !statusEl || !pieBtn) return;

    buildLegend(legendList);

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
    const svg = frame.querySelector("svg");
    if (!svg) {
      statusEl.textContent = "Sorry — the map couldn’t load.";
      return;
    }

    svg.classList.add("pies-us-map");
    svg.removeAttribute("width");
    svg.removeAttribute("height");

    let hideTimer = null;
    const selection = {
      el: null,
      cancelHide() {
        if (hideTimer) {
          clearTimeout(hideTimer);
          hideTimer = null;
        }
      },
      scheduleHide() {
        this.cancelHide();
        hideTimer = setTimeout(() => this.clear(), 160);
      },
      clear() {
        this.cancelHide();
        if (this.el) this.el.classList.remove("is-selected");
        this.el = null;
        clearStatus(statusEl);
        hideStatePie(pieBtn);
      },
    };

    pieBtn.addEventListener("mouseenter", () => selection.cancelHide());
    pieBtn.addEventListener("mouseleave", () => selection.scheduleHide());

    for (const [code, entry] of Object.entries(produceByState)) {
      const nodes = svg.querySelectorAll(`g.state path.${code}, g.state circle.${code}, circle.${code}`);
      nodes.forEach((el) => wireState(el, code, entry, frame, statusEl, pieBtn, selection));
    }

    window.addEventListener("resize", () => {
      if (!selection.el || pieBtn.hidden) return;
      placeStatePie(pieBtn, frame, selection.el);
    });

    document.addEventListener("click", (event) => {
      if (!selection.el || !isTouchUi()) return;
      if (selection.el === event.target || selection.el.contains(event.target)) return;
      if (pieBtn === event.target || pieBtn.contains(event.target)) return;
      if (statusEl.contains(event.target)) return;
      selection.clear();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
