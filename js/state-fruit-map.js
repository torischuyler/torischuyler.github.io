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

  function clampTooltip(tooltip, frame, x, y) {
    const rect = frame.getBoundingClientRect();
    const pad = 8;
    const tipWidth = tooltip.offsetWidth || 140;
    const tipHeight = tooltip.offsetHeight || 32;
    const minX = tipWidth / 2 + pad;
    const maxX = Math.max(minX, rect.width - tipWidth / 2 - pad);
    const minY = tipHeight + pad;
    const maxY = Math.max(minY, rect.height - pad);

    tooltip.style.left = `${Math.min(Math.max(x, minX), maxX)}px`;
    tooltip.style.top = `${Math.min(Math.max(y, minY), maxY)}px`;
  }

  function positionTooltip(tooltip, frame, event) {
    const rect = frame.getBoundingClientRect();
    clampTooltip(tooltip, frame, event.clientX - rect.left, event.clientY - rect.top);
  }

  function positionTooltipOnElement(tooltip, frame, el) {
    const frameRect = frame.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    clampTooltip(
      tooltip,
      frame,
      elRect.left + elRect.width / 2 - frameRect.left,
      elRect.top - frameRect.top
    );
  }

  function wireState(el, code, entry, tooltip, frame, statusEl) {
    const { produce, designation, year } = entry;
    const name = STATE_NAMES[code] || code.toUpperCase();
    const kind = designationPhrase(designation);
    const yearSuffix = year ? ` (${year})` : "";

    el.classList.add(produce.className);
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "link");
    el.setAttribute(
      "aria-label",
      `${name}: ${produce.label} became the official ${kind} in ${year}. Open ${produce.label} pie recipe.`
    );

    const show = (event) => {
      tooltip.textContent = `${name} · ${produce.label}${yearSuffix}`;
      tooltip.classList.add("is-visible");
      if (event) {
        positionTooltip(tooltip, frame, event);
      } else {
        positionTooltipOnElement(tooltip, frame, el);
      }
      statusEl.textContent = `${name}: official ${kind} is ${produce.label}${yearSuffix}`;
    };

    const hide = () => {
      tooltip.classList.remove("is-visible");
      statusEl.textContent = "";
    };

    const go = () => {
      window.location.href = produce.href;
    };

    el.addEventListener("mouseenter", show);
    el.addEventListener("mousemove", (event) => positionTooltip(tooltip, frame, event));
    el.addEventListener("mouseleave", hide);
    el.addEventListener("focus", () => show());
    el.addEventListener("blur", hide);
    el.addEventListener("click", go);
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        go();
      }
    });
  }

  async function init() {
    const root = document.getElementById("state-fruit-map");
    if (!root) return;

    const frame = root.querySelector("[data-map-frame]");
    const legendList = root.querySelector("[data-map-legend]");
    const tooltip = root.querySelector("[data-map-tooltip]");
    const statusEl = root.querySelector("[data-map-status]");
    if (!frame || !legendList || !tooltip || !statusEl) return;

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

    for (const [code, entry] of Object.entries(produceByState)) {
      const nodes = svg.querySelectorAll(`g.state path.${code}, g.state circle.${code}, circle.${code}`);
      nodes.forEach((el) => wireState(el, code, entry, tooltip, frame, statusEl));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
