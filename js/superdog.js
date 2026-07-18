/*
  Superdog page interactions:
  Periodic-table "element superpower" from age (Superman = 36, Krypton).
  Sea Dog biscuit dodge is stashed in js/superdog-game.stash.js for later.
*/

document.addEventListener('DOMContentLoaded', () => {
  initElementYear();
});

/* =========================================================================
   Part 1 — Element year
   ========================================================================= */

/** Compact periodic table data. Ages map 1:1 to atomic number Z. */
const ELEMENTS = [
  { z: 1, symbol: 'H', name: 'Hydrogen', mass: '1.008', cat: 'Reactive Nonmetal' },
  { z: 2, symbol: 'He', name: 'Helium', mass: '4.003', cat: 'Noble Gas' },
  { z: 3, symbol: 'Li', name: 'Lithium', mass: '6.941', cat: 'Alkali Metal' },
  { z: 4, symbol: 'Be', name: 'Beryllium', mass: '9.012', cat: 'Alkaline Earth Metal' },
  { z: 5, symbol: 'B', name: 'Boron', mass: '10.811', cat: 'Metalloid' },
  { z: 6, symbol: 'C', name: 'Carbon', mass: '12.011', cat: 'Reactive Nonmetal' },
  { z: 7, symbol: 'N', name: 'Nitrogen', mass: '14.007', cat: 'Reactive Nonmetal' },
  { z: 8, symbol: 'O', name: 'Oxygen', mass: '15.999', cat: 'Reactive Nonmetal' },
  { z: 9, symbol: 'F', name: 'Fluorine', mass: '18.998', cat: 'Reactive Nonmetal' },
  { z: 10, symbol: 'Ne', name: 'Neon', mass: '20.180', cat: 'Noble Gas' },
  { z: 11, symbol: 'Na', name: 'Sodium', mass: '22.990', cat: 'Alkali Metal' },
  { z: 12, symbol: 'Mg', name: 'Magnesium', mass: '24.305', cat: 'Alkaline Earth Metal' },
  { z: 13, symbol: 'Al', name: 'Aluminum', mass: '26.982', cat: 'Post-transition Metal' },
  { z: 14, symbol: 'Si', name: 'Silicon', mass: '28.085', cat: 'Metalloid' },
  { z: 15, symbol: 'P', name: 'Phosphorus', mass: '30.974', cat: 'Reactive Nonmetal' },
  { z: 16, symbol: 'S', name: 'Sulfur', mass: '32.06', cat: 'Reactive Nonmetal' },
  { z: 17, symbol: 'Cl', name: 'Chlorine', mass: '35.45', cat: 'Reactive Nonmetal' },
  { z: 18, symbol: 'Ar', name: 'Argon', mass: '39.948', cat: 'Noble Gas' },
  { z: 19, symbol: 'K', name: 'Potassium', mass: '39.098', cat: 'Alkali Metal' },
  { z: 20, symbol: 'Ca', name: 'Calcium', mass: '40.078', cat: 'Alkaline Earth Metal' },
  { z: 21, symbol: 'Sc', name: 'Scandium', mass: '44.956', cat: 'Transition Metal' },
  { z: 22, symbol: 'Ti', name: 'Titanium', mass: '47.867', cat: 'Transition Metal' },
  { z: 23, symbol: 'V', name: 'Vanadium', mass: '50.942', cat: 'Transition Metal' },
  { z: 24, symbol: 'Cr', name: 'Chromium', mass: '51.996', cat: 'Transition Metal' },
  { z: 25, symbol: 'Mn', name: 'Manganese', mass: '54.938', cat: 'Transition Metal' },
  { z: 26, symbol: 'Fe', name: 'Iron', mass: '55.845', cat: 'Transition Metal' },
  { z: 27, symbol: 'Co', name: 'Cobalt', mass: '58.933', cat: 'Transition Metal' },
  { z: 28, symbol: 'Ni', name: 'Nickel', mass: '58.693', cat: 'Transition Metal' },
  { z: 29, symbol: 'Cu', name: 'Copper', mass: '63.546', cat: 'Transition Metal' },
  { z: 30, symbol: 'Zn', name: 'Zinc', mass: '65.38', cat: 'Transition Metal' },
  { z: 31, symbol: 'Ga', name: 'Gallium', mass: '69.723', cat: 'Post-transition Metal' },
  { z: 32, symbol: 'Ge', name: 'Germanium', mass: '72.630', cat: 'Metalloid' },
  { z: 33, symbol: 'As', name: 'Arsenic', mass: '74.922', cat: 'Metalloid' },
  { z: 34, symbol: 'Se', name: 'Selenium', mass: '78.971', cat: 'Reactive Nonmetal' },
  { z: 35, symbol: 'Br', name: 'Bromine', mass: '79.904', cat: 'Reactive Nonmetal' },
  { z: 36, symbol: 'Kr', name: 'Krypton', mass: '83.798', cat: 'Noble Gas' },
  { z: 37, symbol: 'Rb', name: 'Rubidium', mass: '85.468', cat: 'Alkali Metal' },
  { z: 38, symbol: 'Sr', name: 'Strontium', mass: '87.62', cat: 'Alkaline Earth Metal' },
  { z: 39, symbol: 'Y', name: 'Yttrium', mass: '88.906', cat: 'Transition Metal' },
  { z: 40, symbol: 'Zr', name: 'Zirconium', mass: '91.224', cat: 'Transition Metal' },
  { z: 41, symbol: 'Nb', name: 'Niobium', mass: '92.906', cat: 'Transition Metal' },
  { z: 42, symbol: 'Mo', name: 'Molybdenum', mass: '95.960', cat: 'Transition Metal' },
  { z: 43, symbol: 'Tc', name: 'Technetium', mass: '98.000', cat: 'Transition Metal' },
  { z: 44, symbol: 'Ru', name: 'Ruthenium', mass: '101.070', cat: 'Transition Metal' },
  { z: 45, symbol: 'Rh', name: 'Rhodium', mass: '102.906', cat: 'Transition Metal' },
  { z: 46, symbol: 'Pd', name: 'Palladium', mass: '106.420', cat: 'Transition Metal' },
  { z: 47, symbol: 'Ag', name: 'Silver', mass: '107.868', cat: 'Transition Metal' },
  { z: 48, symbol: 'Cd', name: 'Cadmium', mass: '112.411', cat: 'Transition Metal' },
  { z: 49, symbol: 'In', name: 'Indium', mass: '114.818', cat: 'Post-transition Metal' },
  { z: 50, symbol: 'Sn', name: 'Tin', mass: '118.710', cat: 'Post-transition Metal' },
  { z: 51, symbol: 'Sb', name: 'Antimony', mass: '121.760', cat: 'Metalloid' },
  { z: 52, symbol: 'Te', name: 'Tellurium', mass: '127.600', cat: 'Metalloid' },
  { z: 53, symbol: 'I', name: 'Iodine', mass: '126.904', cat: 'Reactive Nonmetal' },
  { z: 54, symbol: 'Xe', name: 'Xenon', mass: '131.293', cat: 'Noble Gas' },
  { z: 55, symbol: 'Cs', name: 'Cesium', mass: '132.905', cat: 'Alkali Metal' },
  { z: 56, symbol: 'Ba', name: 'Barium', mass: '137.327', cat: 'Alkaline Earth Metal' },
  { z: 57, symbol: 'La', name: 'Lanthanum', mass: '138.905', cat: 'Lanthanide' },
  { z: 58, symbol: 'Ce', name: 'Cerium', mass: '140.116', cat: 'Lanthanide' },
  { z: 59, symbol: 'Pr', name: 'Praseodymium', mass: '140.908', cat: 'Lanthanide' },
  { z: 60, symbol: 'Nd', name: 'Neodymium', mass: '144.242', cat: 'Lanthanide' },
  { z: 61, symbol: 'Pm', name: 'Promethium', mass: '145.000', cat: 'Lanthanide' },
  { z: 62, symbol: 'Sm', name: 'Samarium', mass: '150.360', cat: 'Lanthanide' },
  { z: 63, symbol: 'Eu', name: 'Europium', mass: '151.964', cat: 'Lanthanide' },
  { z: 64, symbol: 'Gd', name: 'Gadolinium', mass: '157.250', cat: 'Lanthanide' },
  { z: 65, symbol: 'Tb', name: 'Terbium', mass: '158.925', cat: 'Lanthanide' },
  { z: 66, symbol: 'Dy', name: 'Dysprosium', mass: '162.500', cat: 'Lanthanide' },
  { z: 67, symbol: 'Ho', name: 'Holmium', mass: '164.930', cat: 'Lanthanide' },
  { z: 68, symbol: 'Er', name: 'Erbium', mass: '167.259', cat: 'Lanthanide' },
  { z: 69, symbol: 'Tm', name: 'Thulium', mass: '168.934', cat: 'Lanthanide' },
  { z: 70, symbol: 'Yb', name: 'Ytterbium', mass: '173.045', cat: 'Lanthanide' },
  { z: 71, symbol: 'Lu', name: 'Lutetium', mass: '174.967', cat: 'Lanthanide' },
  { z: 72, symbol: 'Hf', name: 'Hafnium', mass: '178.490', cat: 'Transition Metal' },
  { z: 73, symbol: 'Ta', name: 'Tantalum', mass: '180.948', cat: 'Transition Metal' },
  { z: 74, symbol: 'W', name: 'Tungsten', mass: '183.840', cat: 'Transition Metal' },
  { z: 75, symbol: 'Re', name: 'Rhenium', mass: '186.207', cat: 'Transition Metal' },
  { z: 76, symbol: 'Os', name: 'Osmium', mass: '190.230', cat: 'Transition Metal' },
  { z: 77, symbol: 'Ir', name: 'Iridium', mass: '192.217', cat: 'Transition Metal' },
  { z: 78, symbol: 'Pt', name: 'Platinum', mass: '195.084', cat: 'Transition Metal' },
  { z: 79, symbol: 'Au', name: 'Gold', mass: '196.967', cat: 'Transition Metal' },
  { z: 80, symbol: 'Hg', name: 'Mercury', mass: '200.590', cat: 'Transition Metal' },
  { z: 81, symbol: 'Tl', name: 'Thallium', mass: '204.383', cat: 'Post-transition Metal' },
  { z: 82, symbol: 'Pb', name: 'Lead', mass: '207.200', cat: 'Post-transition Metal' },
  { z: 83, symbol: 'Bi', name: 'Bismuth', mass: '208.980', cat: 'Post-transition Metal' },
  { z: 84, symbol: 'Po', name: 'Polonium', mass: '209.000', cat: 'Metalloid' },
  { z: 85, symbol: 'At', name: 'Astatine', mass: '210.000', cat: 'Reactive Nonmetal' },
  { z: 86, symbol: 'Rn', name: 'Radon', mass: '222.000', cat: 'Noble Gas' },
  { z: 87, symbol: 'Fr', name: 'Francium', mass: '223.000', cat: 'Alkali Metal' },
  { z: 88, symbol: 'Ra', name: 'Radium', mass: '226.000', cat: 'Alkaline Earth Metal' },
  { z: 89, symbol: 'Ac', name: 'Actinium', mass: '227.000', cat: 'Actinide' },
  { z: 90, symbol: 'Th', name: 'Thorium', mass: '232.038', cat: 'Actinide' },
  { z: 91, symbol: 'Pa', name: 'Protactinium', mass: '231.036', cat: 'Actinide' },
  { z: 92, symbol: 'U', name: 'Uranium', mass: '238.029', cat: 'Actinide' },
  { z: 93, symbol: 'Np', name: 'Neptunium', mass: '237.000', cat: 'Actinide' },
  { z: 94, symbol: 'Pu', name: 'Plutonium', mass: '244.000', cat: 'Actinide' },
  { z: 95, symbol: 'Am', name: 'Americium', mass: '243.000', cat: 'Actinide' },
  { z: 96, symbol: 'Cm', name: 'Curium', mass: '247.000', cat: 'Actinide' },
  { z: 97, symbol: 'Bk', name: 'Berkelium', mass: '247.000', cat: 'Actinide' },
  { z: 98, symbol: 'Cf', name: 'Californium', mass: '251.000', cat: 'Actinide' },
  { z: 99, symbol: 'Es', name: 'Einsteinium', mass: '252.000', cat: 'Actinide' },
  { z: 100, symbol: 'Fm', name: 'Fermium', mass: '257.000', cat: 'Actinide' },
  { z: 101, symbol: 'Md', name: 'Mendelevium', mass: '258.000', cat: 'Actinide' },
  { z: 102, symbol: 'No', name: 'Nobelium', mass: '259.000', cat: 'Actinide' },
  { z: 103, symbol: 'Lr', name: 'Lawrencium', mass: '266.000', cat: 'Actinide' },
  { z: 104, symbol: 'Rf', name: 'Rutherfordium', mass: '267.000', cat: 'Transition Metal' },
  { z: 105, symbol: 'Db', name: 'Dubnium', mass: '268.000', cat: 'Transition Metal' },
  { z: 106, symbol: 'Sg', name: 'Seaborgium', mass: '269.000', cat: 'Transition Metal' },
  { z: 107, symbol: 'Bh', name: 'Bohrium', mass: '270.000', cat: 'Transition Metal' },
  { z: 108, symbol: 'Hs', name: 'Hassium', mass: '269.000', cat: 'Transition Metal' },
  { z: 109, symbol: 'Mt', name: 'Meitnerium', mass: '278.000', cat: 'Unknown' },
  { z: 110, symbol: 'Ds', name: 'Darmstadtium', mass: '281.000', cat: 'Unknown' },
  { z: 111, symbol: 'Rg', name: 'Roentgenium', mass: '282.000', cat: 'Unknown' },
  { z: 112, symbol: 'Cn', name: 'Copernicium', mass: '285.000', cat: 'Transition Metal' },
  { z: 113, symbol: 'Nh', name: 'Nihonium', mass: '286.000', cat: 'Unknown' },
  { z: 114, symbol: 'Fl', name: 'Flerovium', mass: '289.000', cat: 'Unknown' },
  { z: 115, symbol: 'Mc', name: 'Moscovium', mass: '290.000', cat: 'Unknown' },
  { z: 116, symbol: 'Lv', name: 'Livermorium', mass: '293.000', cat: 'Unknown' },
  { z: 117, symbol: 'Ts', name: 'Tennessine', mass: '294.000', cat: 'Unknown' },
  { z: 118, symbol: 'Og', name: 'Oganesson', mass: '294.000', cat: 'Unknown' },
];

/*
  “What this element feels like” icons — hand-drawn SVG in the right-hand tile.
  Batch by tens and spot-check. Missing Z → atom fallback.
*/
const ELEMENT_VIZ = {
  // ----- 1–10 -----
  1: {
    caption: 'Sun',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="12" fill="#FACAA1"/>
        <g stroke="#FACAA1" stroke-width="3" stroke-linecap="round">
          <path d="M32 6v8M32 50v8M6 32h8M50 32h8M14 14l5.5 5.5M44.5 44.5L50 50M50 14l-5.5 5.5M14 50l5.5-5.5"/>
        </g>
      </svg>`,
  },
  2: {
    caption: 'Hot air balloon',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M32 8c-11 0-18 9-18 18 0 8 5 14 12 18h12c7-4 12-10 12-18 0-9-7-18-18-18z" fill="#c45c4a" stroke="#C9C2BA" stroke-width="1.5"/>
        <path d="M20 22c4 2 8 2 12 0s8-2 12 0" stroke="#FACAA1" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
        <path d="M22 32c3 1 7 1 10 0s7-1 10 0" stroke="#FACAA1" stroke-width="1.5" stroke-linecap="round" opacity="0.65"/>
        <path d="M26 44l-2 6h16l-2-6H26z" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.2"/>
        <path d="M26 44l2-4M38 44l-2-4" stroke="#C9C2BA" stroke-width="1.2" stroke-linecap="round"/>
        <rect x="27" y="50" width="10" height="7" rx="1.5" fill="#FACAA1" stroke="#C9C2BA" stroke-width="1.2"/>
      </svg>`,
  },
  3: {
    caption: 'Battery',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect x="14" y="18" width="32" height="28" rx="4" fill="#2A3F54" stroke="#C9C2BA" stroke-width="2"/>
        <rect x="40" y="26" width="6" height="12" rx="1.5" fill="#C9C2BA"/>
        <rect x="18" y="23" width="8" height="18" rx="1.5" fill="#9CBB80"/>
        <rect x="28" y="23" width="8" height="18" rx="1.5" fill="#9CBB80"/>
      </svg>`,
  },
  4: {
    caption: 'Emerald',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M32 10l14 12v20L32 54 18 42V22L32 10z" fill="#2f6b45" stroke="#9CBB80" stroke-width="1.5"/>
        <path d="M32 10v44M18 22h28M18 42h28M22 18l20 28M42 18L22 46" stroke="#9CBB80" stroke-width="1" opacity="0.45"/>
        <path d="M26 20l6-4 6 4v6l-6 3-6-3v-6z" fill="#6fbf7a" opacity="0.55"/>
      </svg>`,
  },
  5: {
    caption: 'Sports gear',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- tennis racket -->
        <ellipse cx="26" cy="24" rx="12" ry="14" fill="none" stroke="#9CBB80" stroke-width="2.5"/>
        <path d="M20 18h12M18 24h16M20 30h12M23 14v20M29 14v20" stroke="#9CBB80" stroke-width="1" opacity="0.45"/>
        <path d="M26 38v14" stroke="#C9C2BA" stroke-width="3" stroke-linecap="round"/>
        <path d="M22 44h8" stroke="#FACAA1" stroke-width="2" stroke-linecap="round"/>
        <!-- ball -->
        <circle cx="46" cy="42" r="7" fill="#FACAA1" stroke="#C9C2BA" stroke-width="1.5"/>
        <path d="M42 38c3 2 5 6 2 10M50 38c-3 2-5 6-2 10" stroke="#C9C2BA" stroke-width="1.2" stroke-linecap="round"/>
      </svg>`,
  },
  6: {
    caption: 'Life',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M30 50V22" stroke="#8a6a3e" stroke-width="3" stroke-linecap="round"/>
        <path d="M30 36c-8-2-12-8-12-14 6 0 10 4 12 10z" fill="#9CBB80"/>
        <path d="M30 28c8-2 14-8 14-14-6 1-11 5-14 12z" fill="#7aa060"/>
        <path d="M30 44c-7 0-11-5-12-10 5 1 9 4 12 8z" fill="#9CBB80" opacity="0.9"/>
        <circle cx="42" cy="18" r="2" fill="#FACAA1"/>
      </svg>`,
  },
  7: {
    caption: 'Protein',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- steak -->
        <ellipse cx="32" cy="34" rx="20" ry="14" fill="#8b3a32" stroke="#C9C2BA" stroke-width="1.5"/>
        <ellipse cx="30" cy="32" rx="12" ry="8" fill="#c45c4a"/>
        <ellipse cx="28" cy="31" rx="6" ry="4" fill="#e8a090" opacity="0.85"/>
        <path d="M18 28c2-6 8-10 14-8" stroke="#FACAA1" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
        <!-- grill lines -->
        <path d="M22 30l20 4M20 36l22 3M24 42l18 2" stroke="#2A3F54" stroke-width="1.2" stroke-linecap="round" opacity="0.55"/>
      </svg>`,
  },
  8: {
    caption: 'Air',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <ellipse cx="22" cy="36" rx="12" ry="8" fill="#c5d8e8"/>
        <ellipse cx="32" cy="32" rx="14" ry="10" fill="#dce8f2"/>
        <ellipse cx="44" cy="36" rx="11" ry="8" fill="#c5d8e8"/>
        <ellipse cx="40" cy="22" rx="10" ry="7" fill="#e8f0f6"/>
        <ellipse cx="28" cy="24" rx="9" ry="6" fill="#d0e0ee"/>
      </svg>`,
  },
  9: {
    caption: 'Toothpaste',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect x="18" y="14" width="28" height="10" rx="2" fill="#C9C2BA"/>
        <rect x="20" y="24" width="24" height="26" rx="3" fill="#2A3F54" stroke="#8eb4d4" stroke-width="2"/>
        <path d="M26 32h12M26 38h12M26 44h8" stroke="#9CBB80" stroke-width="2" stroke-linecap="round"/>
        <circle cx="42" cy="48" r="3" fill="#FACAA1" opacity="0.8"/>
      </svg>`,
  },
  10: {
    caption: 'Advertising sign',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect x="8" y="20" width="48" height="24" rx="4" fill="#1a1520" stroke="#ff6b6b" stroke-width="2"/>
        <rect x="11" y="23" width="42" height="18" rx="2" fill="#2a1020" stroke="#ff8a8a" stroke-width="1" opacity="0.95"/>
        <text x="32" y="36" text-anchor="middle" fill="#ff6b6b" font-size="11" font-family="Righteous, sans-serif" font-weight="700" letter-spacing="1.5">OPEN</text>
        <path d="M14 16v4M50 16v4M32 14v6" stroke="#ff6b6b" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
      </svg>`,
  },
  // ----- 11+ (more batches next) -----
  11: {
    caption: 'Salt',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M24 16h16l4 12H20l4-12z" fill="#C9C2BA" stroke="#FACAA1" stroke-width="1.5"/>
        <rect x="20" y="28" width="24" height="22" rx="3" fill="#2A3F54" stroke="#C9C2BA" stroke-width="2"/>
        <circle cx="28" cy="38" r="1.6" fill="#FFF"/>
        <circle cx="36" cy="36" r="1.6" fill="#FFF"/>
        <circle cx="32" cy="44" r="1.6" fill="#FFF"/>
        <circle cx="38" cy="42" r="1.2" fill="#FFF"/>
      </svg>`,
  },
  12: {
    caption: 'Chlorophyll',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- stem -->
        <path d="M30 50V28" stroke="#6a8f4e" stroke-width="2.5" stroke-linecap="round"/>
        <!-- left leaf -->
        <path d="M30 38c-10-2-16-10-16-18 8 0 14 5 16 14z" fill="#7aa060"/>
        <path d="M22 26c3 4 6 8 8 12" stroke="#9CBB80" stroke-width="1" stroke-linecap="round" opacity="0.55"/>
        <!-- right leaf -->
        <path d="M30 32c10-2 16-9 16-16-8 1-13 6-16 14z" fill="#9CBB80"/>
        <path d="M38 22c-3 4-6 7-8 10" stroke="#6a8f4e" stroke-width="1" stroke-linecap="round" opacity="0.45"/>
        <!-- small lower leaf -->
        <path d="M30 44c-8 0-12-5-13-10 6 1 10 4 13 8z" fill="#9CBB80" opacity="0.9"/>
      </svg>`,
  },
  13: {
    caption: 'Airplane',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- fuselage -->
        <path d="M10 34c8-2 20-3 28-3h8c4 0 6 1.5 6 3s-2 3-6 3h-8c-8 0-20-1-28-3z" fill="#C9C2BA"/>
        <!-- nose -->
        <path d="M52 31c4 1 6 2 6 3s-2 2-6 3v-6z" fill="#FACAA1"/>
        <!-- main wings -->
        <path d="M28 32L12 18h6l14 12H28z" fill="#9CBB80"/>
        <path d="M28 36L12 50h6l14-12H28z" fill="#7aa060"/>
        <!-- tail fin -->
        <path d="M14 34l-6-10h4l6 10H14z" fill="#2A3F54"/>
        <path d="M14 34l-6 8h4l6-8H14z" fill="#2A3F54" opacity="0.85"/>
        <!-- window dots -->
        <circle cx="36" cy="34" r="1.3" fill="#2A3F54"/>
        <circle cx="42" cy="34" r="1.3" fill="#2A3F54"/>
        <circle cx="48" cy="34" r="1.3" fill="#2A3F54"/>
      </svg>`,
  },
  14: {
    caption: 'Chip',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect x="20" y="20" width="24" height="24" rx="3" fill="#1a334d" stroke="#9CBB80" stroke-width="2"/>
        <rect x="26" y="26" width="12" height="12" rx="1.5" fill="#9CBB80" opacity="0.85"/>
        <g stroke="#C9C2BA" stroke-width="2" stroke-linecap="round">
          <path d="M26 16v4M32 16v4M38 16v4M26 44v4M32 44v4M38 44v4M16 26h4M16 32h4M16 38h4M44 26h4M44 32h4M44 38h4"/>
        </g>
      </svg>`,
  },
  15: {
    caption: 'Bone',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <g transform="rotate(-35 32 32)">
          <rect x="18" y="28" width="28" height="8" rx="3" fill="#E8E0D4"/>
          <circle cx="16" cy="26" r="6" fill="#E8E0D4"/>
          <circle cx="16" cy="38" r="6" fill="#E8E0D4"/>
          <circle cx="48" cy="26" r="6" fill="#E8E0D4"/>
          <circle cx="48" cy="38" r="6" fill="#E8E0D4"/>
          <path d="M24 31h16" stroke="#C9C2BA" stroke-width="1.2" stroke-linecap="round" opacity="0.55"/>
        </g>
      </svg>`,
  },
  16: {
    caption: 'Eggs',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- skillet -->
        <ellipse cx="30" cy="36" rx="22" ry="16" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <ellipse cx="30" cy="36" rx="18" ry="12" fill="#1a2a3a"/>
        <path d="M50 32c6 1 10 3 11 6-1 2-5 4-11 5" fill="#C9C2BA"/>
        <path d="M50 34c5 1 8 2 9 4" stroke="#2A3F54" stroke-width="1.2" stroke-linecap="round"/>
        <!-- left over-easy egg -->
        <ellipse cx="22" cy="36" rx="9" ry="7" fill="#FFF8EE"/>
        <circle cx="22" cy="36" r="4" fill="#F0C24A"/>
        <circle cx="21" cy="35" r="1.2" fill="#FACAA1" opacity="0.7"/>
        <!-- right over-easy egg -->
        <ellipse cx="36" cy="38" rx="8" ry="6.5" fill="#F5EDE0"/>
        <circle cx="36" cy="38" r="3.6" fill="#E8B84A"/>
        <circle cx="35" cy="37" r="1" fill="#FACAA1" opacity="0.7"/>
      </svg>`,
  },
  17: {
    caption: 'Pools',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- pool deck -->
        <rect x="8" y="18" width="48" height="32" rx="4" fill="#C9C2BA"/>
        <!-- water -->
        <rect x="12" y="22" width="40" height="24" rx="3" fill="#5a9ec4"/>
        <path d="M16 30c3-2 6-2 9 0s6 2 9 0 6-2 9 0" stroke="#8eb4d4" stroke-width="1.5" stroke-linecap="round" opacity="0.85"/>
        <path d="M16 38c3-2 6-2 9 0s6 2 9 0 6-2 9 0" stroke="#8eb4d4" stroke-width="1.5" stroke-linecap="round" opacity="0.65"/>
        <!-- ladder -->
        <path d="M44 18v14M50 18v14M44 22h6M44 27h6" stroke="#2A3F54" stroke-width="1.6" stroke-linecap="round"/>
      </svg>`,
  },
  18: {
    caption: 'Light bulb',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- glow -->
        <ellipse cx="32" cy="26" rx="16" ry="18" fill="#FACAA1" opacity="0.25"/>
        <!-- glass bulb -->
        <path d="M22 28c0-8 4.5-16 10-16s10 8 10 16c0 5-2 8-4 10h-12c-2-2-4-5-4-10z" fill="#FACAA1" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- filament -->
        <path d="M28 30c2-3 6-3 8 0M29 34c1.5-2 4.5-2 6 0" stroke="#c45c4a" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M30 38v-6M34 38v-6" stroke="#C9C2BA" stroke-width="1.2" stroke-linecap="round"/>
        <!-- screw base -->
        <rect x="26" y="38" width="12" height="5" rx="1" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.2"/>
        <rect x="27" y="43" width="10" height="3" rx="0.5" fill="#C9C2BA"/>
        <rect x="28" y="46" width="8" height="3" rx="1" fill="#2A3F54"/>
      </svg>`,
  },
  19: {
    caption: 'Bananas',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- back banana -->
        <path d="M38 14c2 0 4 2 4 5 0 12-4 22-10 28-3 3-7 5-10 5-2 0-3-2-2-4 5-3 10-12 12-24 1-4 3-8 6-10z" fill="#E8C84A"/>
        <path d="M40 16c1 8-1 18-6 26" stroke="#d4a83a" stroke-width="1.2" stroke-linecap="round" opacity="0.55"/>
        <!-- front banana -->
        <path d="M28 16c2 0 4 2 4 5 0 13-5 24-12 30-3 3-7 5-10 4-2 0-3-2-2-4 6-3 11-13 14-26 1-4 3-7 6-9z" fill="#F0C24A"/>
        <path d="M30 18c1 9-2 20-8 28" stroke="#d4a83a" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
        <!-- stems -->
        <path d="M28 16c2-3 6-4 10-2" stroke="#6a8f4e" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="32" cy="13" r="2" fill="#6a8f4e"/>
      </svg>`,
  },
  20: {
    caption: 'Milk',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- glass -->
        <path d="M20 18h24l-3 36H23L20 18z" fill="#c5d8e8" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- milk fill -->
        <path d="M22 28h20l-2.2 24H24.2L22 28z" fill="#FFF8EE"/>
        <!-- milk surface -->
        <ellipse cx="32" cy="28" rx="10" ry="3" fill="#FFF"/>
        <!-- glass highlight -->
        <path d="M24 22v26" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
        <!-- splash drop -->
        <circle cx="40" cy="14" r="2.5" fill="#FFF8EE"/>
      </svg>`,
  },
  21: {
    caption: 'Bicycle',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- wheels -->
        <circle cx="18" cy="40" r="10" stroke="#C9C2BA" stroke-width="2.5" fill="none"/>
        <circle cx="18" cy="40" r="3" fill="#2A3F54"/>
        <circle cx="46" cy="40" r="10" stroke="#C9C2BA" stroke-width="2.5" fill="none"/>
        <circle cx="46" cy="40" r="3" fill="#2A3F54"/>
        <!-- frame -->
        <path d="M18 40L30 22h12L46 40M30 22L24 40M42 22l-12 18" stroke="#9CBB80" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- seat -->
        <path d="M26 22h8" stroke="#FACAA1" stroke-width="2.5" stroke-linecap="round"/>
        <!-- handlebars -->
        <path d="M42 22v-4M38 18h8" stroke="#FACAA1" stroke-width="2.2" stroke-linecap="round"/>
        <!-- pedals -->
        <circle cx="30" cy="40" r="2.5" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.2"/>
        <path d="M30 40l4 4M30 40l-4-4" stroke="#C9C2BA" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
  },
  22: {
    caption: 'Rocket',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- body -->
        <path d="M32 8c6 8 8 18 8 28H24c0-10 2-20 8-28z" fill="#C9C2BA" stroke="#9CBB80" stroke-width="1.5"/>
        <!-- nose -->
        <path d="M32 8c-3 4-5 8-6 12h12c-1-4-3-8-6-12z" fill="#FACAA1"/>
        <!-- window -->
        <circle cx="32" cy="26" r="4" fill="#2A3F54" stroke="#8eb4d4" stroke-width="1.5"/>
        <circle cx="31" cy="25" r="1.2" fill="#8eb4d4" opacity="0.7"/>
        <!-- fins -->
        <path d="M24 36l-8 12h8V36z" fill="#9CBB80"/>
        <path d="M40 36l8 12h-8V36z" fill="#7aa060"/>
        <!-- flame -->
        <path d="M28 44c0 6 2 10 4 12 2-2 4-6 4-12H28z" fill="#c45c4a"/>
        <path d="M30 44c0 4 1 7 2 9 1-2 2-5 2-9h-4z" fill="#FACAA1"/>
      </svg>`,
  },
  23: {
    caption: 'Wrench',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <g transform="rotate(-40 32 32)">
          <!-- handle -->
          <rect x="28" y="22" width="8" height="30" rx="3" fill="#C9C2BA" stroke="#9CBB80" stroke-width="1.5"/>
          <!-- open jaw head -->
          <path d="M20 14h24v14c0 2-1 4-3 5l-5 3v-8h-8v8l-5-3c-2-1-3-3-3-5V14z" fill="#FACAA1" stroke="#C9C2BA" stroke-width="1.5"/>
          <!-- jaw opening -->
          <path d="M26 14v10h12V14" stroke="#2A3F54" stroke-width="2.5" stroke-linecap="round"/>
          <!-- grip lines -->
          <path d="M30 36h4M30 42h4M30 48h4" stroke="#2A3F54" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
        </g>
      </svg>`,
  },
  24: {
    caption: 'Stainless steel',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- fork -->
        <rect x="11" y="30" width="4" height="22" rx="1.5" fill="#A8B0B8"/>
        <path d="M8 10v16M13 10v16M18 10v16" stroke="#A8B0B8" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M8 26h10v4H8z" fill="#A8B0B8"/>
        <!-- spoon -->
        <rect x="30" y="30" width="4" height="22" rx="1.5" fill="#A8B0B8"/>
        <ellipse cx="32" cy="18" rx="7" ry="10" fill="#A8B0B8"/>
        <ellipse cx="30" cy="16" rx="2.5" ry="4" fill="#D6DCE2" opacity="0.7"/>
        <!-- knife -->
        <rect x="49" y="30" width="4" height="22" rx="1.5" fill="#A8B0B8"/>
        <path d="M47 30V14c0-3 2.5-6 4-6s4 3 4 6v16H47z" fill="#B8C0C8"/>
        <path d="M51 12v16" stroke="#D6DCE2" stroke-width="1" opacity="0.7"/>
      </svg>`,
  },
  25: {
    caption: 'Earthmover',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- tracks -->
        <rect x="22" y="44" width="28" height="8" rx="3" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.2"/>
        <circle cx="26" cy="48" r="2" fill="#C9C2BA"/>
        <circle cx="36" cy="48" r="2" fill="#C9C2BA"/>
        <circle cx="46" cy="48" r="2" fill="#C9C2BA"/>
        <!-- body / cab -->
        <path d="M28 28h20v16H28V28z" fill="#F0C24A" stroke="#d4a83a" stroke-width="1.5"/>
        <rect x="34" y="31" width="10" height="7" rx="1" fill="#2A3F54"/>
        <path d="M35 32h4" stroke="#8eb4d4" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>
        <!-- boom -->
        <path d="M30 30L16 16" stroke="#F0C24A" stroke-width="4" stroke-linecap="round"/>
        <path d="M16 16L8 28" stroke="#E8B84A" stroke-width="3.5" stroke-linecap="round"/>
        <!-- bucket -->
        <path d="M4 26h10v8H6l-2-4v-4z" fill="#F0C24A" stroke="#d4a83a" stroke-width="1.3"/>
        <path d="M6 34v3M10 34v3M14 34v3" stroke="#2A3F54" stroke-width="1.5" stroke-linecap="round"/>
        <!-- joint pins -->
        <circle cx="30" cy="30" r="2" fill="#2A3F54"/>
        <circle cx="16" cy="16" r="2" fill="#2A3F54"/>
      </svg>`,
  },
  26: {
    caption: 'Steel',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- water -->
        <path d="M6 48c4-2 8-2 12 0s8 2 12 0 8-2 12 0 8 2 12 0" stroke="#5a9ec4" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <!-- deck -->
        <path d="M6 40h52" stroke="#c45c4a" stroke-width="3" stroke-linecap="round"/>
        <!-- towers -->
        <rect x="16" y="14" width="5" height="26" fill="#c45c4a"/>
        <rect x="43" y="14" width="5" height="26" fill="#c45c4a"/>
        <path d="M14 14h9M41 14h9" stroke="#a84838" stroke-width="2.5" stroke-linecap="round"/>
        <!-- suspension cables -->
        <path d="M6 40c6-16 10-22 12.5-26" stroke="#FACAA1" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M21 14c4 8 8 18 11 26" stroke="#FACAA1" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M32 40c3-8 7-18 11-26" stroke="#FACAA1" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M45.5 14c2.5 4 6.5 10 12.5 26" stroke="#FACAA1" stroke-width="1.5" stroke-linecap="round"/>
        <!-- vertical suspenders -->
        <path d="M10 34v6M14 28v12M26 22v18M30 28v12M34 28v12M38 22v18M50 28v12M54 34v6" stroke="#a84838" stroke-width="1" opacity="0.75"/>
        <!-- piers -->
        <path d="M15 40v8h7v-8M42 40v8h7v-8" fill="#8b3a32"/>
      </svg>`,
  },
  27: {
    caption: 'Magnet',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- red U body -->
        <path d="M18 18v20c0 8 6 14 14 14s14-6 14-14V18h-8v20c0 3.5-2.5 6-6 6s-6-2.5-6-6V18H18z" fill="#c45c4a"/>
        <!-- gray square pole tips -->
        <rect x="18" y="12" width="8" height="10" fill="#A8B0B8"/>
        <rect x="38" y="12" width="8" height="10" fill="#A8B0B8"/>
      </svg>`,
  },
  28: {
    caption: 'Coins',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- back coin -->
        <circle cx="38" cy="28" r="14" fill="#B8C0C8" stroke="#8A929A" stroke-width="1.5"/>
        <circle cx="38" cy="28" r="10" fill="none" stroke="#D6DCE2" stroke-width="1.2"/>
        <path d="M38 20v16M32 24h12M32 32h12" stroke="#8A929A" stroke-width="1.2" stroke-linecap="round" opacity="0.55"/>
        <!-- front coin -->
        <circle cx="26" cy="36" r="14" fill="#C5CDD4" stroke="#8A929A" stroke-width="1.5"/>
        <circle cx="26" cy="36" r="10" fill="none" stroke="#E8EEF2" stroke-width="1.2"/>
        <path d="M26 28v16M20 32h12M20 40h12" stroke="#8A929A" stroke-width="1.2" stroke-linecap="round" opacity="0.55"/>
        <!-- highlight -->
        <path d="M20 30c2-4 6-6 10-5" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
      </svg>`,
  },
  29: {
    caption: 'Statue of Liberty',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- pedestal -->
        <path d="M18 52h28l-4-8H22l-4 8z" fill="#C9C2BA"/>
        <rect x="24" y="40" width="16" height="6" fill="#A8B0B8"/>
        <!-- robe / body -->
        <path d="M26 40c0-10 2-18 6-22 4 4 6 12 6 22H26z" fill="#5a8f6e"/>
        <path d="M28 28c2 4 4 8 4 12M36 28c-2 4-4 8-4 12" stroke="#3f6b52" stroke-width="1.2" opacity="0.7"/>
        <!-- raised arm + torch -->
        <path d="M38 24l8-10" stroke="#5a8f6e" stroke-width="3" stroke-linecap="round"/>
        <path d="M44 10h6l-2 5h-4l-2-5z" fill="#F0C24A"/>
        <path d="M47 6v4" stroke="#F0C24A" stroke-width="2" stroke-linecap="round"/>
        <!-- head + crown -->
        <circle cx="32" cy="16" r="4" fill="#5a8f6e"/>
        <path d="M27 14l2-4M30 13l2-5M34 13l2-5M37 14l2-4" stroke="#5a8f6e" stroke-width="1.8" stroke-linecap="round"/>
        <!-- tablet arm -->
        <path d="M26 26l-6 4" stroke="#5a8f6e" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="14" y="28" width="8" height="10" rx="1" fill="#7aa060" stroke="#3f6b52" stroke-width="1"/>
      </svg>`,
  },
  30: {
    caption: 'Brass instruments',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- main leadpipe -->
        <path d="M8 30h22" stroke="#e0b44e" stroke-width="3.5" stroke-linecap="round"/>
        <!-- mouthpiece -->
        <path d="M4 27c0-2 2-3 4-3v12c-2 0-4-1-4-3v-6z" fill="#c9962e"/>
        <ellipse cx="8" cy="30" rx="2" ry="4" fill="#e0b44e"/>
        <!-- valve casing -->
        <rect x="18" y="26" width="22" height="10" rx="3" fill="#c9962e"/>
        <!-- three valves -->
        <rect x="22" y="16" width="4" height="12" rx="1.5" fill="#A8B0B8"/>
        <rect x="29" y="16" width="4" height="12" rx="1.5" fill="#A8B0B8"/>
        <rect x="36" y="16" width="4" height="12" rx="1.5" fill="#A8B0B8"/>
        <circle cx="24" cy="16" r="2.2" fill="#C9C2BA"/>
        <circle cx="31" cy="16" r="2.2" fill="#C9C2BA"/>
        <circle cx="38" cy="16" r="2.2" fill="#C9C2BA"/>
        <!-- tubing loop under valves -->
        <path d="M20 36c0 8 6 12 12 12s12-4 12-12" stroke="#e0b44e" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- neck into bell -->
        <path d="M40 30h6" stroke="#e0b44e" stroke-width="3.5" stroke-linecap="round"/>
        <!-- flared bell -->
        <path d="M46 24c6 2 12 6 14 12-2 6-8 10-14 12V24z" fill="#e0b44e"/>
        <path d="M46 26c5 2 10 5 12 10" stroke="#FACAA1" stroke-width="1.5" stroke-linecap="round" opacity="0.75"/>
        <path d="M48 28c3 1 6 4 8 8" stroke="#c9962e" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>
        <!-- bell rim -->
        <path d="M46 24c0 8 0 16 0 24" stroke="#c9962e" stroke-width="1.5"/>
      </svg>`,
  },
  31: {
    caption: 'LEDs',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- clock body -->
        <rect x="6" y="14" width="52" height="38" rx="2" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- LED display -->
        <rect x="10" y="20" width="44" height="26" rx="1" fill="#1a1520"/>
        <text x="32" y="41" text-anchor="middle" fill="#ff6b6b" font-size="22" font-family="Righteous, monospace" font-weight="700" letter-spacing="1">6:18</text>
        <!-- alarm bells -->
        <circle cx="16" cy="14" r="4" fill="#C9C2BA"/>
        <circle cx="48" cy="14" r="4" fill="#C9C2BA"/>
      </svg>`,
  },
  32: {
    caption: 'Semiconductor electronics',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- metal can body -->
        <circle cx="32" cy="28" r="16" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.5"/>
        <circle cx="32" cy="28" r="12" fill="#C5CDD4"/>
        <!-- highlight -->
        <path d="M24 20c3-3 8-4 12-2" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
        <!-- flat orientation mark -->
        <path d="M20 36h24" stroke="#8A929A" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
        <!-- three leads -->
        <path d="M22 42v14M32 44v12M42 42v14" stroke="#C9C2BA" stroke-width="2.5" stroke-linecap="round"/>
        <!-- lead tips -->
        <circle cx="22" cy="56" r="1.5" fill="#A8B0B8"/>
        <circle cx="32" cy="56" r="1.5" fill="#A8B0B8"/>
        <circle cx="42" cy="56" r="1.5" fill="#A8B0B8"/>
      </svg>`,
  },
  33: {
    caption: 'Poison',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- bottle -->
        <path d="M24 20h16v4l4 4v28c0 2-2 4-4 4H24c-2 0-4-2-4-4V28l4-4v-4z" fill="#2A3F54" stroke="#9CBB80" stroke-width="1.5"/>
        <!-- neck + cork -->
        <rect x="27" y="12" width="10" height="8" rx="1" fill="#C9C2BA"/>
        <rect x="28" y="8" width="8" height="5" rx="1.5" fill="#8a6a3e"/>
        <!-- skull -->
        <circle cx="32" cy="36" r="8" fill="#E8E0D4"/>
        <circle cx="29" cy="35" r="1.8" fill="#2A3F54"/>
        <circle cx="35" cy="35" r="1.8" fill="#2A3F54"/>
        <path d="M30 40h4v3h-4z" fill="#2A3F54"/>
        <!-- crossbones -->
        <path d="M22 48l8-4M42 48l-8-4M22 44l8 4M42 44l-8 4" stroke="#E8E0D4" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
  },
  34: {
    caption: 'Copiers',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- main body -->
        <rect x="8" y="24" width="48" height="26" rx="3" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- top lid / glass -->
        <path d="M12 24V16c0-2 2-4 4-4h32c2 0 4 2 4 4v8H12z" fill="#A8B0B8"/>
        <rect x="16" y="14" width="28" height="8" rx="1" fill="#5a9ec4" opacity="0.85"/>
        <!-- paper output -->
        <path d="M14 40h24l4 8H18l-4-8z" fill="#FFF8EE" stroke="#C9C2BA" stroke-width="1.2"/>
        <path d="M18 44h18" stroke="#C9C2BA" stroke-width="1" opacity="0.5"/>
        <!-- control panel -->
        <rect x="42" y="30" width="10" height="12" rx="1.5" fill="#1a2a3a"/>
        <circle cx="47" cy="34" r="1.5" fill="#9CBB80"/>
        <circle cx="47" cy="39" r="1.5" fill="#FACAA1"/>
      </svg>`,
  },
  35: {
    caption: 'Film',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- 35mm cartridge body -->
        <rect x="8" y="18" width="28" height="28" rx="4" fill="#5a3220" stroke="#8a4a32" stroke-width="1.5"/>
        <!-- spool window -->
        <circle cx="22" cy="32" r="9" fill="#2A1520" stroke="#8a4a32" stroke-width="1.5"/>
        <circle cx="22" cy="32" r="4" fill="#3a2418"/>
        <!-- top/bottom lips -->
        <rect x="10" y="16" width="24" height="4" rx="1" fill="#6b3a28"/>
        <rect x="10" y="44" width="24" height="4" rx="1" fill="#6b3a28"/>
        <!-- film tongue unrolling -->
        <path d="M36 26h8c2 0 4 2 4 4v12c0 2 2 4 4 4h4" stroke="#6b3a28" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M36 26h8c2 0 4 2 4 4v12c0 2 2 4 4 4h4" stroke="#8a5540" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- sprocket holes -->
        <g fill="#1a1520">
          <rect x="40" y="24" width="2" height="3" rx="0.5"/>
          <rect x="40" y="30" width="2" height="3" rx="0.5"/>
          <rect x="40" y="36" width="2" height="3" rx="0.5"/>
          <rect x="46" y="38" width="2" height="3" rx="0.5"/>
          <rect x="52" y="42" width="2" height="3" rx="0.5"/>
        </g>
      </svg>`,
  },
  36: {
    caption: 'Lasers',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- soft glows -->
        <path d="M4 56L40 4" stroke="#ff6b6b" stroke-width="5" stroke-linecap="round" opacity="0.2"/>
        <path d="M12 60L60 12" stroke="#F0C24A" stroke-width="5" stroke-linecap="round" opacity="0.2"/>
        <path d="M32 60V4" stroke="#9CBB80" stroke-width="5" stroke-linecap="round" opacity="0.2"/>
        <path d="M60 56L20 4" stroke="#5a9ec4" stroke-width="5" stroke-linecap="round" opacity="0.2"/>
        <path d="M4 20L60 44" stroke="#b07ad4" stroke-width="5" stroke-linecap="round" opacity="0.2"/>
        <path d="M4 40L56 8" stroke="#ff8a4a" stroke-width="5" stroke-linecap="round" opacity="0.2"/>
        <!-- rainbow lasers crossing every which way -->
        <path d="M4 56L40 4" stroke="#ff6b6b" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M12 60L60 12" stroke="#F0C24A" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M32 60V4" stroke="#9CBB80" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M60 56L20 4" stroke="#5a9ec4" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M4 20L60 44" stroke="#b07ad4" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M4 40L56 8" stroke="#ff8a4a" stroke-width="2.5" stroke-linecap="round"/>
      </svg>`,
  },
  37: {
    caption: 'Global navigation',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- Earth -->
        <circle cx="28" cy="38" r="18" fill="#5a9ec4"/>
        <!-- landmasses -->
        <path d="M12 30c6-4 12-2 16 2 3 3 8 4 14 1l2 6c-6 4-14 5-20 2-5-2-10-4-14-8l2-3z" fill="#9CBB80"/>
        <path d="M16 42c5 0 9 3 14 2 4-1 9 0 12 3-2 4-8 6-14 5-6-1-11-4-14-8l2-2z" fill="#7aa060"/>
        <path d="M22 22c4-2 10-1 14 3 2 2 1 5-1 6-4 1-8-1-11-3-3-2-4-4-2-6z" fill="#9CBB80"/>
        <path d="M34 48c3 1 6 2 8 0 1 3-1 5-4 6-3 0-6-2-6-4l2-2z" fill="#7aa060"/>
        <ellipse cx="18" cy="36" rx="4" ry="3" fill="#9CBB80"/>
        <!-- latitude lines -->
        <ellipse cx="28" cy="38" rx="18" ry="7" stroke="#8eb4d4" stroke-width="1" opacity="0.35"/>
        <path d="M28 20v36" stroke="#8eb4d4" stroke-width="1" opacity="0.3"/>
        <!-- satellite -->
        <rect x="44" y="12" width="10" height="6" rx="1" fill="#C9C2BA" stroke="#A8B0B8" stroke-width="1"/>
        <rect x="38" y="13" width="6" height="4" fill="#5a9ec4"/>
        <rect x="54" y="13" width="6" height="4" fill="#5a9ec4"/>
        <circle cx="49" cy="15" r="1.2" fill="#FACAA1"/>
        <!-- signal beam -->
        <path d="M44 20L36 28" stroke="#FACAA1" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2 2" opacity="0.8"/>
      </svg>`,
  },
  38: {
    caption: 'Fireworks',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- big burst -->
        <g stroke="#c45c4a" stroke-width="2" stroke-linecap="round">
          <path d="M32 18v-10M32 46v10M18 32H8M46 32h10"/>
          <path d="M22 22L14 14M42 22l8-8M22 42l-8 8M42 42l8 8"/>
        </g>
        <g stroke="#ff6b6b" stroke-width="1.8" stroke-linecap="round" opacity="0.85">
          <path d="M32 22v-6M32 42v6M22 32h-6M42 32h6"/>
          <path d="M25 25l-4-4M39 25l4-4M25 39l-4 4M39 39l4 4"/>
        </g>
        <!-- sparks -->
        <circle cx="32" cy="32" r="3" fill="#FACAA1"/>
        <circle cx="18" cy="20" r="1.5" fill="#F0C24A"/>
        <circle cx="46" cy="18" r="1.5" fill="#F0C24A"/>
        <circle cx="16" cy="44" r="1.5" fill="#ff6b6b"/>
        <circle cx="48" cy="46" r="1.5" fill="#ff6b6b"/>
        <circle cx="32" cy="12" r="1.2" fill="#FACAA1"/>
        <circle cx="10" cy="32" r="1.2" fill="#c45c4a"/>
        <circle cx="54" cy="32" r="1.2" fill="#c45c4a"/>
        <!-- second smaller burst -->
        <g stroke="#F0C24A" stroke-width="1.5" stroke-linecap="round" opacity="0.9">
          <path d="M48 14v-5M48 22v5M43 18h-5M53 18h5"/>
          <path d="M44 14l-3-3M52 14l3-3M44 22l-3 3M52 22l3 3"/>
        </g>
        <circle cx="48" cy="18" r="2" fill="#FACAA1"/>
      </svg>`,
  },
  39: {
    caption: 'Color displays',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- TV body -->
        <rect x="8" y="12" width="48" height="36" rx="3" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- screen -->
        <rect x="12" y="16" width="40" height="28" rx="2" fill="#1a1520"/>
        <!-- color bars -->
        <rect x="14" y="18" width="6" height="24" fill="#ff6b6b"/>
        <rect x="20" y="18" width="6" height="24" fill="#F0C24A"/>
        <rect x="26" y="18" width="6" height="24" fill="#9CBB80"/>
        <rect x="32" y="18" width="6" height="24" fill="#5a9ec4"/>
        <rect x="38" y="18" width="6" height="24" fill="#b07ad4"/>
        <rect x="44" y="18" width="6" height="24" fill="#c45c4a"/>
        <!-- stand -->
        <path d="M26 48h12l4 6H22l4-6z" fill="#A8B0B8"/>
        <!-- power light -->
        <circle cx="50" cy="42" r="1.5" fill="#9CBB80"/>
      </svg>`,
  },
  40: {
    caption: 'Chemical pipelines',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- horizontal pipe -->
        <rect x="4" y="28" width="40" height="12" rx="6" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.5"/>
        <path d="M10 32h28M10 36h28" stroke="#C9C2BA" stroke-width="1" opacity="0.55"/>
        <!-- elbow joint -->
        <path d="M38 28h10a6 6 0 016 6v16" stroke="#8A929A" stroke-width="12" fill="none" stroke-linecap="butt"/>
        <path d="M38 28h10a6 6 0 016 6v16" stroke="#A8B0B8" stroke-width="9" fill="none"/>
        <!-- vertical pipe -->
        <rect x="48" y="40" width="12" height="18" rx="6" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.5"/>
        <!-- flanges -->
        <rect x="2" y="26" width="5" height="16" rx="1" fill="#8A929A"/>
        <rect x="46" y="54" width="16" height="5" rx="1" fill="#8A929A"/>
        <!-- valve wheel -->
        <circle cx="24" cy="22" r="6" fill="none" stroke="#C9C2BA" stroke-width="2"/>
        <circle cx="24" cy="22" r="2" fill="#8A929A"/>
        <path d="M24 16v12M18 22h12" stroke="#C9C2BA" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M24 28v6" stroke="#8A929A" stroke-width="2"/>
      </svg>`,
  },
  47: {
    caption: 'Mirror',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <ellipse cx="32" cy="30" rx="16" ry="18" fill="#c5ced8" stroke="#C9C2BA" stroke-width="2"/>
        <ellipse cx="32" cy="30" rx="11" ry="13" fill="#e8eef4"/>
        <path d="M24 24c4-6 12-6 14-2" stroke="#FFF" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
        <rect x="29" y="48" width="6" height="6" rx="1" fill="#2A3F54"/>
      </svg>`,
  },
  79: {
    caption: 'Gold',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M16 38l8-16h16l8 16H16z" fill="#e0b44e" stroke="#FACAA1" stroke-width="1.5"/>
        <path d="M16 38h32v8H16z" fill="#c9962e" stroke="#FACAA1" stroke-width="1.5"/>
        <path d="M24 22l4 16M40 22l-4 16" stroke="#8a6a1e" stroke-width="1" opacity="0.45"/>
      </svg>`,
  },
};

function atomFallbackSvg() {
  return `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <ellipse cx="32" cy="32" rx="20" ry="8" stroke="#9CBB80" stroke-width="1.5" transform="rotate(0 32 32)"/>
      <ellipse cx="32" cy="32" rx="20" ry="8" stroke="#FACAA1" stroke-width="1.5" transform="rotate(60 32 32)"/>
      <ellipse cx="32" cy="32" rx="20" ry="8" stroke="#C9C2BA" stroke-width="1.5" transform="rotate(120 32 32)"/>
      <circle cx="32" cy="32" r="5" fill="#9CBB80"/>
    </svg>`;
}

function renderElementViz(el) {
  const art = document.getElementById('sd-el-viz-art');
  const caption = document.getElementById('sd-el-viz-caption');
  if (!art || !caption) return;

  const viz = ELEMENT_VIZ[el.z];
  if (viz) {
    art.innerHTML = viz.svg.trim();
    caption.textContent = viz.caption;
    return;
  }

  art.innerHTML = atomFallbackSvg().trim();
  caption.textContent = 'Atom';
}

/** Real year, or override with ?year=2027 to time-travel / QA the heading. */
function currentDisplayYear() {
  const raw = new URLSearchParams(window.location.search).get('year');
  const parsed = Number.parseInt(raw, 10);
  if (Number.isInteger(parsed) && parsed >= 2026 && parsed <= 2100) {
    return parsed;
  }
  return new Date().getFullYear();
}

function updateHeadingYear() {
  const yearEl = document.getElementById('sd-heading-year');
  if (!yearEl) return;
  yearEl.textContent = String(currentDisplayYear());
}

function initElementYear() {
  const form = document.getElementById('sd-age-form');
  const input = document.getElementById('sd-age');
  const error = document.getElementById('sd-age-error');
  const card = document.getElementById('sd-element-card');
  if (!form || !input || !error || !card) return;

  updateHeadingYear();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const age = Number.parseInt(input.value, 10);
    if (!Number.isInteger(age) || age < 1 || age > 118) {
      error.hidden = false;
      error.textContent = 'Pick a whole number from 1 to 118 (that’s how many elements we have).';
      card.hidden = true;
      return;
    }

    const el = ELEMENTS[age - 1];
    error.hidden = true;
    card.hidden = false;
    card.classList.toggle('sd-is-krypton', age === 36);

    document.getElementById('sd-el-number').textContent = String(el.z);
    document.getElementById('sd-el-symbol').textContent = el.symbol;
    document.getElementById('sd-el-name').textContent = el.name;
    document.getElementById('sd-el-mass').textContent = el.mass;

    let headline = `Age ${age}: ${el.name} is Your Superpower`;
    if (age === 36) {
      headline = `Age ${age}: ${el.name} is Your Superpower (Superdog’s!)`;
    }

    document.getElementById('sd-el-headline').textContent = headline;
    document.getElementById('sd-el-category').textContent = el.cat;

    const aside = document.getElementById('sd-el-aside');
    if (aside) {
      if (age === 15) {
        aside.hidden = false;
        aside.textContent = 'Slugger really liked this age 😎';
      } else {
        aside.hidden = true;
        aside.textContent = '';
      }
    }

    const learn = document.getElementById('sd-el-learn');
    // Simple English Wikipedia — easier read for kids, covers all 118 elements
    learn.href = `https://simple.wikipedia.org/wiki/${encodeURIComponent(el.name)}`;
    learn.textContent = `Learn more about ${el.name}`;

    renderElementViz(el);
  });
}
