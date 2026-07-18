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
  { z: 42, symbol: 'Mo', name: 'Molybdenum', mass: '95.95', cat: 'Transition Metal' },
  { z: 43, symbol: 'Tc', name: 'Technetium', mass: '98', cat: 'Transition Metal' },
  { z: 44, symbol: 'Ru', name: 'Ruthenium', mass: '101.07', cat: 'Transition Metal' },
  { z: 45, symbol: 'Rh', name: 'Rhodium', mass: '102.91', cat: 'Transition Metal' },
  { z: 46, symbol: 'Pd', name: 'Palladium', mass: '106.42', cat: 'Transition Metal' },
  { z: 47, symbol: 'Ag', name: 'Silver', mass: '107.87', cat: 'Transition Metal' },
  { z: 48, symbol: 'Cd', name: 'Cadmium', mass: '112.41', cat: 'Transition Metal' },
  { z: 49, symbol: 'In', name: 'Indium', mass: '114.818', cat: 'Post-transition Metal' },
  { z: 50, symbol: 'Sn', name: 'Tin', mass: '118.71', cat: 'Post-transition Metal' },
  { z: 51, symbol: 'Sb', name: 'Antimony', mass: '121.76', cat: 'Metalloid' },
  { z: 52, symbol: 'Te', name: 'Tellurium', mass: '127.60', cat: 'Metalloid' },
  { z: 53, symbol: 'I', name: 'Iodine', mass: '126.904', cat: 'Reactive Nonmetal' },
  { z: 54, symbol: 'Xe', name: 'Xenon', mass: '131.293', cat: 'Noble Gas' },
  { z: 55, symbol: 'Cs', name: 'Cesium', mass: '132.91', cat: 'Alkali Metal' },
  { z: 56, symbol: 'Ba', name: 'Barium', mass: '137.33', cat: 'Alkaline Earth Metal' },
  { z: 57, symbol: 'La', name: 'Lanthanum', mass: '138.91', cat: 'Lanthanide' },
  { z: 58, symbol: 'Ce', name: 'Cerium', mass: '140.12', cat: 'Lanthanide' },
  { z: 59, symbol: 'Pr', name: 'Praseodymium', mass: '140.91', cat: 'Lanthanide' },
  { z: 60, symbol: 'Nd', name: 'Neodymium', mass: '144.242', cat: 'Lanthanide' },
  { z: 61, symbol: 'Pm', name: 'Promethium', mass: '145', cat: 'Lanthanide' },
  { z: 62, symbol: 'Sm', name: 'Samarium', mass: '150.360', cat: 'Lanthanide' },
  { z: 63, symbol: 'Eu', name: 'Europium', mass: '151.96', cat: 'Lanthanide' },
  { z: 64, symbol: 'Gd', name: 'Gadolinium', mass: '157.25', cat: 'Lanthanide' },
  { z: 65, symbol: 'Tb', name: 'Terbium', mass: '158.93', cat: 'Lanthanide' },
  { z: 66, symbol: 'Dy', name: 'Dysprosium', mass: '162.50', cat: 'Lanthanide' },
  { z: 67, symbol: 'Ho', name: 'Holmium', mass: '164.93', cat: 'Lanthanide' },
  { z: 68, symbol: 'Er', name: 'Erbium', mass: '167.26', cat: 'Lanthanide' },
  { z: 69, symbol: 'Tm', name: 'Thulium', mass: '168.93', cat: 'Lanthanide' },
  { z: 70, symbol: 'Yb', name: 'Ytterbium', mass: '173.05', cat: 'Lanthanide' },
  { z: 71, symbol: 'Lu', name: 'Lutetium', mass: '174.967', cat: 'Lanthanide' },
  { z: 72, symbol: 'Hf', name: 'Hafnium', mass: '178.49', cat: 'Transition Metal' },
  { z: 73, symbol: 'Ta', name: 'Tantalum', mass: '180.948', cat: 'Transition Metal' },
  { z: 74, symbol: 'W', name: 'Tungsten', mass: '183.84', cat: 'Transition Metal' },
  { z: 75, symbol: 'Re', name: 'Rhenium', mass: '186.207', cat: 'Transition Metal' },
  { z: 76, symbol: 'Os', name: 'Osmium', mass: '190.23', cat: 'Transition Metal' },
  { z: 77, symbol: 'Ir', name: 'Iridium', mass: '192.22', cat: 'Transition Metal' },
  { z: 78, symbol: 'Pt', name: 'Platinum', mass: '195.084', cat: 'Transition Metal' },
  { z: 79, symbol: 'Au', name: 'Gold', mass: '196.967', cat: 'Transition Metal' },
  { z: 80, symbol: 'Hg', name: 'Mercury', mass: '200.59', cat: 'Transition Metal' },
  { z: 81, symbol: 'Tl', name: 'Thallium', mass: '204.38', cat: 'Post-transition Metal' },
  { z: 82, symbol: 'Pb', name: 'Lead', mass: '207.2', cat: 'Post-transition Metal' },
  { z: 83, symbol: 'Bi', name: 'Bismuth', mass: '208.98', cat: 'Post-transition Metal' },
  { z: 84, symbol: 'Po', name: 'Polonium', mass: '209', cat: 'Metalloid' },
  { z: 85, symbol: 'At', name: 'Astatine', mass: '210', cat: 'Reactive Nonmetal' },
  { z: 86, symbol: 'Rn', name: 'Radon', mass: '222', cat: 'Noble Gas' },
  { z: 87, symbol: 'Fr', name: 'Francium', mass: '223', cat: 'Alkali Metal' },
  { z: 88, symbol: 'Ra', name: 'Radium', mass: '226', cat: 'Alkaline Earth Metal' },
  { z: 89, symbol: 'Ac', name: 'Actinium', mass: '227', cat: 'Actinide' },
  { z: 90, symbol: 'Th', name: 'Thorium', mass: '232.04', cat: 'Actinide' },
  { z: 91, symbol: 'Pa', name: 'Protactinium', mass: '231.04', cat: 'Actinide' },
  { z: 92, symbol: 'U', name: 'Uranium', mass: '238.03', cat: 'Actinide' },
  { z: 93, symbol: 'Np', name: 'Neptunium', mass: '237', cat: 'Actinide' },
  { z: 94, symbol: 'Pu', name: 'Plutonium', mass: '244', cat: 'Actinide' },
  { z: 95, symbol: 'Am', name: 'Americium', mass: '243', cat: 'Actinide' },
  { z: 96, symbol: 'Cm', name: 'Curium', mass: '247', cat: 'Actinide' },
  { z: 97, symbol: 'Bk', name: 'Berkelium', mass: '247', cat: 'Actinide' },
  { z: 98, symbol: 'Cf', name: 'Californium', mass: '251', cat: 'Actinide' },
  { z: 99, symbol: 'Es', name: 'Einsteinium', mass: '252', cat: 'Actinide' },
  { z: 100, symbol: 'Fm', name: 'Fermium', mass: '257', cat: 'Actinide' },
  { z: 101, symbol: 'Md', name: 'Mendelevium', mass: '258', cat: 'Actinide' },
  { z: 102, symbol: 'No', name: 'Nobelium', mass: '259', cat: 'Actinide' },
  { z: 103, symbol: 'Lr', name: 'Lawrencium', mass: '266', cat: 'Actinide' },
  { z: 104, symbol: 'Rf', name: 'Rutherfordium', mass: '267', cat: 'Transition Metal' },
  { z: 105, symbol: 'Db', name: 'Dubnium', mass: '268', cat: 'Transition Metal' },
  { z: 106, symbol: 'Sg', name: 'Seaborgium', mass: '269', cat: 'Transition Metal' },
  { z: 107, symbol: 'Bh', name: 'Bohrium', mass: '270', cat: 'Transition Metal' },
  { z: 108, symbol: 'Hs', name: 'Hassium', mass: '269', cat: 'Transition Metal' },
  { z: 109, symbol: 'Mt', name: 'Meitnerium', mass: '278', cat: 'Superheavy Element' },
  { z: 110, symbol: 'Ds', name: 'Darmstadtium', mass: '281', cat: 'Superheavy Element' },
  { z: 111, symbol: 'Rg', name: 'Roentgenium', mass: '282', cat: 'Superheavy Element' },
  { z: 112, symbol: 'Cn', name: 'Copernicium', mass: '285', cat: 'Superheavy Element' },
  { z: 113, symbol: 'Nh', name: 'Nihonium', mass: '286', cat: 'Superheavy Element' },
  { z: 114, symbol: 'Fl', name: 'Flerovium', mass: '289', cat: 'Superheavy Element' },
  { z: 115, symbol: 'Mc', name: 'Moscovium', mass: '290', cat: 'Superheavy Element' },
  { z: 116, symbol: 'Lv', name: 'Livermorium', mass: '293', cat: 'Superheavy Element' },
  { z: 117, symbol: 'Ts', name: 'Tennessine', mass: '294', cat: 'Superheavy Element' },
  { z: 118, symbol: 'Og', name: 'Oganesson', mass: '294', cat: 'Superheavy Element' },
];

/*
  “What this element feels like” icons — hand-drawn SVG in the right-hand tile.
  Covered through Z=98. Z≥99 hides the tile (no scenes). Missing Z under 99 → atom fallback.
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
    caption: 'Welding torch',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- handle -->
        <rect x="10" y="40" width="14" height="16" rx="3" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5" transform="rotate(-35 17 48)"/>
        <!-- shaft -->
        <path d="M22 42L42 18" stroke="#A8B0B8" stroke-width="6" stroke-linecap="round"/>
        <path d="M22 42L42 18" stroke="#C9C2BA" stroke-width="3" stroke-linecap="round"/>
        <!-- nozzle tip -->
        <circle cx="42" cy="18" r="4" fill="#8A929A" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- bright spark / arc -->
        <circle cx="50" cy="12" r="7" fill="#FACAA1" opacity="0.35"/>
        <circle cx="50" cy="12" r="3.5" fill="#F0C24A"/>
        <circle cx="50" cy="12" r="1.8" fill="#fff6d5"/>
        <g stroke="#F0C24A" stroke-width="2" stroke-linecap="round">
          <path d="M50 2v5M50 17v5M40 12h5M55 12h5"/>
          <path d="M43 5l3.5 3.5M53.5 15.5L57 19M57 5l-3.5 3.5M43 19l3.5-3.5"/>
        </g>
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
    caption: 'Thermometer',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- tube -->
        <rect x="28" y="6" width="8" height="38" rx="4" fill="#C9C2BA" stroke="#A8B0B8" stroke-width="1.5"/>
        <!-- glass highlight -->
        <path d="M30 10v28" stroke="#e8eef4" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
        <!-- scale ticks -->
        <g stroke="#8A929A" stroke-width="1.2" stroke-linecap="round">
          <path d="M36 14h5M36 20h4M36 26h5M36 32h4"/>
        </g>
        <!-- liquid column -->
        <rect x="30" y="22" width="4" height="22" rx="2" fill="#c45c4a"/>
        <!-- bulb -->
        <circle cx="32" cy="50" r="10" fill="#C9C2BA" stroke="#A8B0B8" stroke-width="1.5"/>
        <circle cx="32" cy="50" r="6.5" fill="#c45c4a"/>
        <circle cx="32" cy="50" r="3.5" fill="#ff6b6b" opacity="0.7"/>
        <!-- soft sheen -->
        <path d="M28 46c1.5-2 4-3 6-2" stroke="#FACAA1" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
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
    caption: 'Jet engine',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- pylon (wing mount) -->
        <path d="M30 8v14" stroke="#8A929A" stroke-width="3" stroke-linecap="round"/>
        <path d="M24 8h14" stroke="#A8B0B8" stroke-width="3" stroke-linecap="round"/>
        <!-- nacelle body -->
        <path d="M6 28c0-8 8-14 20-14h18c8 0 14 4 14 12v8c0 8-6 12-14 12H26c-12 0-20-6-20-14v-4z" fill="#C9C2BA" stroke="#8A929A" stroke-width="1.5"/>
        <!-- intake lip -->
        <ellipse cx="10" cy="32" rx="6" ry="12" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.2"/>
        <ellipse cx="10" cy="32" rx="3.5" ry="8" fill="#1a3040"/>
        <!-- fan disc -->
        <ellipse cx="14" cy="32" rx="2" ry="6" fill="#2A3F54"/>
        <path d="M13 27l2 5-2 5" stroke="#5a9ec4" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>
        <!-- cowling seams -->
        <path d="M22 16v32M36 18v28" stroke="#A8B0B8" stroke-width="1" opacity="0.7"/>
        <!-- core / turbine section -->
        <path d="M40 22h10c3 0 5 2 5 5v10c0 3-2 5-5 5H40V22z" fill="#8A929A"/>
        <!-- exhaust nozzle -->
        <path d="M50 24h6c2 0 4 2 4 4v8c0 2-2 4-4 4h-6V24z" fill="#2A3F54"/>
        <ellipse cx="58" cy="32" rx="2.5" ry="7" fill="#1a2430"/>
        <!-- exhaust flame -->
        <path d="M60 28c4 1 6 3 6 4s-2 3-6 4c1-2 1-6 0-8z" fill="#F0C24A"/>
        <path d="M60 30c3 0.5 4 1.5 4 2s-1 1.5-4 2c0.5-1 0.5-3 0-4z" fill="#FACAA1"/>
        <!-- heat-shield stripe (yttria coating hint) -->
        <path d="M42 24h6v16h-6" fill="#FACAA1" opacity="0.35"/>
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
  41: {
    caption: 'Maglev train',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- elevated guideway -->
        <rect x="6" y="46" width="52" height="6" rx="2" fill="#8A929A"/>
        <path d="M10 52v6M32 52v6M54 52v6" stroke="#A8B0B8" stroke-width="3" stroke-linecap="round"/>
        <!-- magnetic glow in the float gap -->
        <path d="M12 42h40" stroke="#5a9ec4" stroke-width="4" stroke-linecap="round" opacity="0.35"/>
        <path d="M14 42h36" stroke="#8eb4d4" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
        <!-- train body (sleek airport / monorail shape) -->
        <path d="M8 28c0-6 4-10 10-10h28c8 0 12 4 14 10l-2 12H10l-2-12z" fill="#C9C2BA" stroke="#A8B0B8" stroke-width="1.5"/>
        <!-- blue stripe -->
        <path d="M12 36h42" stroke="#5a9ec4" stroke-width="2.5" stroke-linecap="round"/>
        <!-- cockpit / nose window -->
        <path d="M48 20c4 1 8 4 10 8H48V20z" fill="#2A3F54"/>
        <path d="M50 22c2.5 1 5 3 6.5 5" stroke="#8eb4d4" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
        <!-- passenger windows -->
        <rect x="14" y="22" width="7" height="8" rx="1" fill="#2A3F54"/>
        <rect x="24" y="22" width="7" height="8" rx="1" fill="#2A3F54"/>
        <rect x="34" y="22" width="7" height="8" rx="1" fill="#2A3F54"/>
        <!-- window highlights -->
        <path d="M15 24h3M25 24h3M35 24h3" stroke="#8eb4d4" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
        <!-- speed lines -->
        <path d="M4 24h6M2 30h5M4 36h6" stroke="#FACAA1" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
      </svg>`,
  },
  42: {
    caption: 'Drill',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- body -->
        <path d="M18 18h22c4 0 6 2 6 6v10c0 4-2 6-6 6H18V18z" fill="#F0C24A" stroke="#d4a83a" stroke-width="1.5"/>
        <!-- handle / grip -->
        <path d="M22 40h10v14c0 2-2 4-5 4s-5-2-5-4V40z" fill="#F0C24A" stroke="#d4a83a" stroke-width="1.5"/>
        <path d="M24 44h6M24 48h6M24 52h6" stroke="#2A3F54" stroke-width="1.3" stroke-linecap="round" opacity="0.45"/>
        <!-- trigger -->
        <path d="M32 40v6c2 0 4-2 4-4v-2H32z" fill="#2A3F54"/>
        <!-- chuck -->
        <rect x="40" y="24" width="8" height="12" rx="1.5" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.2"/>
        <path d="M42 26v8M44 26v8M46 26v8" stroke="#8A929A" stroke-width="1" opacity="0.7"/>
        <!-- bit -->
        <path d="M48 28h12l-2 2 2 2H48V28z" fill="#C9C2BA" stroke="#8A929A" stroke-width="1"/>
        <path d="M52 29l2 1-2 1M56 29l2 1-2 1" stroke="#8A929A" stroke-width="1" stroke-linecap="round"/>
        <!-- battery pack -->
        <rect x="20" y="14" width="14" height="6" rx="1.5" fill="#2A3F54"/>
        <rect x="23" y="16" width="4" height="2" rx="0.5" fill="#9CBB80"/>
        <!-- side vent lines -->
        <path d="M22 24h10M22 28h10M22 32h8" stroke="#d4a83a" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
      </svg>`,
  },
  43: {
    caption: 'Medical tracer',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- plunger rod -->
        <rect x="10" y="28" width="14" height="6" rx="1" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.2"/>
        <!-- plunger thumb rest -->
        <rect x="4" y="24" width="8" height="14" rx="2" fill="#C9C2BA" stroke="#A8B0B8" stroke-width="1.2"/>
        <!-- barrel -->
        <rect x="22" y="22" width="26" height="18" rx="3" fill="#e8eef4" stroke="#A8B0B8" stroke-width="1.5"/>
        <!-- measurement marks -->
        <path d="M28 26v10M34 26v10M40 26v10" stroke="#8A929A" stroke-width="1" opacity="0.55"/>
        <!-- tracer liquid -->
        <rect x="36" y="25" width="10" height="12" rx="1.5" fill="#9CBB80" opacity="0.75"/>
        <!-- hub -->
        <rect x="46" y="27" width="6" height="8" rx="1" fill="#A8B0B8"/>
        <!-- needle -->
        <path d="M52 31h10" stroke="#C9C2BA" stroke-width="2" stroke-linecap="round"/>
        <path d="M60 29l4 2-4 2" fill="#C9C2BA"/>
        <!-- finger grips -->
        <path d="M22 20h6v4H22zM22 40h6v4H22z" fill="#8A929A"/>
        <!-- soft glow (radiotracer) -->
        <circle cx="41" cy="31" r="8" fill="#9CBB80" opacity="0.15"/>
      </svg>`,
  },
  44: {
    caption: 'Hard drive',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- enclosure -->
        <rect x="8" y="10" width="48" height="44" rx="3" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.5"/>
        <!-- inner cavity -->
        <rect x="12" y="14" width="40" height="36" rx="2" fill="#2A3F54"/>
        <!-- platter -->
        <circle cx="30" cy="32" r="14" fill="#C9C2BA" stroke="#8A929A" stroke-width="1.2"/>
        <circle cx="30" cy="32" r="10" fill="none" stroke="#A8B0B8" stroke-width="1" opacity="0.7"/>
        <circle cx="30" cy="32" r="5" fill="none" stroke="#A8B0B8" stroke-width="1" opacity="0.55"/>
        <circle cx="30" cy="32" r="2.2" fill="#8A929A"/>
        <!-- actuator arm -->
        <path d="M48 46L34 28" stroke="#C9C2BA" stroke-width="3" stroke-linecap="round"/>
        <circle cx="48" cy="46" r="3.5" fill="#8A929A"/>
        <!-- read/write head -->
        <path d="M34 28l-4-1.5 1 4z" fill="#F0C24A"/>
        <!-- connector pins -->
        <path d="M16 50v4M22 50v4M28 50v4M34 50v4" stroke="#8A929A" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
  },
  45: {
    caption: 'Catalytic converter',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- inlet pipe -->
        <rect x="4" y="26" width="10" height="12" rx="2" fill="#8A929A"/>
        <!-- converter body -->
        <rect x="12" y="18" width="36" height="28" rx="4" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.5"/>
        <!-- heat shield ridges -->
        <path d="M18 22v20M26 22v20M34 22v20M42 22v20" stroke="#C9C2BA" stroke-width="1.5" opacity="0.7"/>
        <!-- honeycomb hint (cutaway) -->
        <rect x="20" y="28" width="20" height="10" rx="1" fill="#2A3F54"/>
        <path d="M22 30h4M28 30h4M34 30h4M22 34h4M28 34h4M34 34h4" stroke="#9CBB80" stroke-width="1.3" stroke-linecap="round"/>
        <!-- outlet pipe -->
        <rect x="48" y="26" width="12" height="12" rx="2" fill="#8A929A"/>
        <!-- mounting bracket -->
        <path d="M16 46h8M40 46h8" stroke="#8A929A" stroke-width="2" stroke-linecap="round"/>
        <!-- clean exhaust puff -->
        <path d="M58 24c2-2 4-2 6 0M58 32c2-2 4-2 6 0M58 40c2-2 4-2 6 0" stroke="#8eb4d4" stroke-width="1.5" stroke-linecap="round" opacity="0.75"/>
      </svg>`,
  },
  46: {
    caption: 'Wedding ring',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- plain band -->
        <ellipse cx="32" cy="32" rx="18" ry="14" fill="none" stroke="#A8B0B8" stroke-width="7"/>
        <ellipse cx="32" cy="32" rx="18" ry="14" fill="none" stroke="#C9C2BA" stroke-width="3.5"/>
        <!-- metal highlight -->
        <path d="M18 24c4-6 12-9 20-8" stroke="#e8eef4" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <path d="M40 42c-4 4-12 6-20 4" stroke="#8A929A" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
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
  48: {
    caption: 'Paint',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- paint tube body -->
        <path d="M22 18h20v28c0 2-2 4-4 4H26c-2 0-4-2-4-4V18z" fill="#F0C24A" stroke="#d4a83a" stroke-width="1.5"/>
        <!-- crimped end -->
        <rect x="20" y="12" width="24" height="8" rx="1" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.2"/>
        <path d="M24 14h16M24 17h16" stroke="#8A929A" stroke-width="1" opacity="0.6"/>
        <!-- nozzle -->
        <rect x="28" y="46" width="8" height="6" rx="1" fill="#C9C2BA"/>
        <!-- cadmium yellow / orange / red blobs -->
        <circle cx="18" cy="40" r="6" fill="#F0C24A"/>
        <circle cx="32" cy="52" r="5.5" fill="#e07a3a"/>
        <circle cx="48" cy="42" r="6" fill="#e22222"/>
        <!-- tube label stripe -->
        <path d="M26 28h12" stroke="#2A3F54" stroke-width="2" stroke-linecap="round" opacity="0.35"/>
      </svg>`,
  },
  49: {
    caption: 'LCDs',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- monitor bezel -->
        <rect x="8" y="10" width="48" height="34" rx="2" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- screen -->
        <rect x="12" y="14" width="40" height="26" rx="1" fill="#1a3040"/>
        <!-- soft LCD glow + UI blocks -->
        <rect x="16" y="18" width="18" height="10" rx="1" fill="#5a9ec4" opacity="0.85"/>
        <rect x="36" y="18" width="12" height="4" rx="0.5" fill="#9CBB80" opacity="0.8"/>
        <rect x="36" y="24" width="12" height="4" rx="0.5" fill="#F0C24A" opacity="0.75"/>
        <rect x="16" y="30" width="32" height="6" rx="1" fill="#8eb4d4" opacity="0.55"/>
        <!-- stand -->
        <path d="M28 44h8l4 8H24l4-8z" fill="#A8B0B8"/>
        <rect x="20" y="52" width="24" height="4" rx="1" fill="#8A929A"/>
      </svg>`,
  },
  50: {
    caption: 'Tin can',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- can body -->
        <rect x="16" y="14" width="32" height="40" rx="3" fill="#C9C2BA" stroke="#A8B0B8" stroke-width="1.5"/>
        <!-- top rim -->
        <ellipse cx="32" cy="14" rx="16" ry="5" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.2"/>
        <ellipse cx="32" cy="14" rx="10" ry="3" fill="#D6DCE2" opacity="0.7"/>
        <!-- bottom rim -->
        <ellipse cx="32" cy="54" rx="16" ry="4" fill="#A8B0B8"/>
        <!-- label -->
        <rect x="20" y="24" width="24" height="20" rx="1" fill="#c45c4a"/>
        <path d="M24 30h16M24 36h12" stroke="#FACAA1" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
        <!-- side seam highlight -->
        <path d="M18 20v28" stroke="#e8eef4" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
      </svg>`,
  },
  51: {
    caption: 'Car battery',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- case -->
        <rect x="8" y="20" width="48" height="34" rx="3" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- cell ridges -->
        <path d="M20 24v26M32 24v26M44 24v26" stroke="#1a3040" stroke-width="2" opacity="0.7"/>
        <!-- top ledge -->
        <rect x="10" y="16" width="44" height="8" rx="2" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.2"/>
        <!-- negative post -->
        <rect x="16" y="10" width="10" height="8" rx="1.5" fill="#C9C2BA" stroke="#8A929A" stroke-width="1.2"/>
        <path d="M18.5 14h5" stroke="#2A3F54" stroke-width="2" stroke-linecap="round"/>
        <!-- positive post -->
        <rect x="38" y="10" width="10" height="8" rx="1.5" fill="#c45c4a" stroke="#a04838" stroke-width="1.2"/>
        <path d="M40.5 14h5M43 11.5v5" stroke="#FACAA1" stroke-width="2" stroke-linecap="round"/>
        <!-- charge indicator window -->
        <rect x="26" y="30" width="12" height="8" rx="1" fill="#1a3040"/>
        <rect x="28" y="32" width="8" height="4" rx="0.5" fill="#9CBB80"/>
        <!-- carry handle -->
        <path d="M24 16c0-6 4-10 8-10s8 4 8 10" stroke="#8A929A" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>`,
  },
  52: {
    caption: 'Solar panel',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- panel frame (tilted) -->
        <path d="M8 22l40-10 8 34-40 10z" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- cells -->
        <path d="M14 24l14-3.5 2.5 10.5-14 3.5z" fill="#1a3040"/>
        <path d="M30 20l14-3.5 2.5 10.5-14 3.5z" fill="#243848"/>
        <path d="M16.5 34.5l14-3.5 2.5 10.5-14 3.5z" fill="#243848"/>
        <path d="M32.5 30.5l14-3.5 2.5 10.5-14 3.5z" fill="#1a3040"/>
        <!-- cell grid lines -->
        <path d="M22 22l5 21M38 18l5 21M12 30h36M14.5 40h36" stroke="#5a9ec4" stroke-width="0.8" opacity="0.55"/>
        <!-- sun -->
        <circle cx="50" cy="14" r="5" fill="#F0C24A"/>
        <g stroke="#F0C24A" stroke-width="1.5" stroke-linecap="round">
          <path d="M50 5v3M50 20v3M41 14h3M56 14h3M44 8l2 2M54 18l2 2M54 8l-2 2M44 18l-2 2"/>
        </g>
        <!-- ground mount -->
        <path d="M20 54l8-8M36 50l6 6" stroke="#8A929A" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M14 56h40" stroke="#A8B0B8" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
  },
  53: {
    caption: 'Disinfectant',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- bottle body -->
        <path d="M22 22h20v30c0 3-2 5-5 5H27c-3 0-5-2-5-5V22z" fill="#5c3a1e" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- amber liquid -->
        <path d="M24 30h16v20c0 2-1.5 3.5-3.5 3.5h-9c-2 0-3.5-1.5-3.5-3.5V30z" fill="#c45c4a"/>
        <path d="M26 34h12" stroke="#FACAA1" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
        <!-- shoulder / neck -->
        <path d="M26 22h12v-4H26v4z" fill="#4a2e18"/>
        <rect x="28" y="12" width="8" height="8" rx="1" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.2"/>
        <!-- cap -->
        <rect x="27" y="6" width="10" height="8" rx="2" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- cross mark -->
        <path d="M32 36v10M27 41h10" stroke="#FACAA1" stroke-width="2.2" stroke-linecap="round"/>
        <!-- droplet -->
        <path d="M48 28c0 4-3 7-6 7s-6-3-6-7c0-3 3-8 6-10 3 2 6 7 6 10z" fill="#c45c4a" stroke="#a04838" stroke-width="1"/>
        <path d="M44 30c1-1 2-0.5 2.5 0.5" stroke="#FACAA1" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
      </svg>`,
  },
  54: {
    caption: 'Lighthouse',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- sea -->
        <path d="M4 52c6-3 12-3 18 0s12 3 18 0 12-3 18 0v8H4v-8z" fill="#5a9ec4" opacity="0.55"/>
        <!-- rock base -->
        <path d="M18 50l6-6h16l6 6H18z" fill="#8A929A"/>
        <!-- tower -->
        <path d="M24 50L28 22h8l4 28H24z" fill="#C9C2BA" stroke="#A8B0B8" stroke-width="1.2"/>
        <!-- red stripe -->
        <path d="M26.5 38h11l0.7 6h-12.4l0.7-6z" fill="#c45c4a"/>
        <!-- gallery / lantern room -->
        <rect x="26" y="14" width="12" height="10" rx="1" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.2"/>
        <rect x="28" y="16" width="8" height="6" rx="0.5" fill="#F0C24A" opacity="0.9"/>
        <!-- roof -->
        <path d="M24 14l8-8 8 8H24z" fill="#c45c4a"/>
        <circle cx="32" cy="8" r="1.5" fill="#FACAA1"/>
        <!-- light beams -->
        <path d="M38 19l18-6M38 22l18 2M38 25l16 8" stroke="#F0C24A" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
        <path d="M26 19L8 13M26 22L8 24" stroke="#F0C24A" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
      </svg>`,
  },
  55: {
    caption: 'Atomic clock',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- clock body -->
        <circle cx="32" cy="34" r="22" fill="#2A3F54" stroke="#C9C2BA" stroke-width="2"/>
        <circle cx="32" cy="34" r="17" fill="#1a3040"/>
        <!-- tick marks -->
        <g stroke="#A8B0B8" stroke-width="1.5" stroke-linecap="round">
          <path d="M32 20v3M32 45v3M18 34h3M43 34h3"/>
          <path d="M22 24l2 2M40 44l2 2M22 44l2-2M40 24l2-2" opacity="0.7"/>
        </g>
        <!-- electron orbits -->
        <ellipse cx="32" cy="34" rx="12" ry="5" stroke="#9CBB80" stroke-width="1.2" transform="rotate(-30 32 34)" opacity="0.55"/>
        <ellipse cx="32" cy="34" rx="12" ry="5" stroke="#FACAA1" stroke-width="1.2" transform="rotate(50 32 34)" opacity="0.55"/>
        <!-- digital readout -->
        <rect x="18" y="28" width="28" height="12" rx="2" fill="#0d1a22"/>
        <text x="32" y="38" text-anchor="middle" fill="#9CBB80" font-size="10" font-family="Righteous, monospace" font-weight="700" letter-spacing="1">6:18</text>
        <!-- top lugs -->
        <rect x="24" y="8" width="6" height="6" rx="1" fill="#A8B0B8"/>
        <rect x="34" y="8" width="6" height="6" rx="1" fill="#A8B0B8"/>
        <path d="M27 8V5h10v3" stroke="#8A929A" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>`,
  },
  56: {
    caption: 'X-ray',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- x-ray film glow -->
        <rect x="10" y="6" width="44" height="52" rx="3" fill="#1a2430" stroke="#5a9ec4" stroke-width="1.5"/>
        <!-- skull -->
        <circle cx="32" cy="16" r="7" fill="#c5ced8" opacity="0.9"/>
        <circle cx="29" cy="15" r="1.4" fill="#1a2430"/>
        <circle cx="35" cy="15" r="1.4" fill="#1a2430"/>
        <path d="M30 19h4" stroke="#1a2430" stroke-width="1.2" stroke-linecap="round"/>
        <!-- spine -->
        <path d="M32 23v20" stroke="#c5ced8" stroke-width="2.5" stroke-linecap="round"/>
        <!-- ribs -->
        <path d="M32 26c-6 1-10 3-12 5M32 26c6 1 10 3 12 5" stroke="#c5ced8" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M32 30c-6 1-10 3-12 5M32 30c6 1 10 3 12 5" stroke="#c5ced8" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M32 34c-5 1-9 2-11 4M32 34c5 1 9 2 11 4" stroke="#c5ced8" stroke-width="1.6" stroke-linecap="round"/>
        <!-- pelvis -->
        <path d="M24 44c3-2 5-3 8-3s5 1 8 3" stroke="#c5ced8" stroke-width="2" stroke-linecap="round"/>
        <!-- arms -->
        <path d="M20 28l-6 10M44 28l6 10" stroke="#c5ced8" stroke-width="2" stroke-linecap="round"/>
        <!-- legs -->
        <path d="M28 46v10M36 46v10" stroke="#c5ced8" stroke-width="2.2" stroke-linecap="round"/>
        <!-- soft scan glow -->
        <ellipse cx="32" cy="34" rx="14" ry="18" fill="#5a9ec4" opacity="0.12"/>
      </svg>`,
  },
  57: {
    caption: 'Telescope',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- tube -->
        <path d="M12 40l36-22 4 7-36 22-4-7z" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.5"/>
        <!-- tube bands -->
        <path d="M20 36l2.5 4.2M32 29l2.5 4.2M44 22l2.5 4.2" stroke="#C9C2BA" stroke-width="1.5" opacity="0.7"/>
        <!-- eyepiece -->
        <path d="M8 42l6-3.5 3 5-6 3.5-3-5z" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- objective lens -->
        <ellipse cx="52" cy="21" rx="5" ry="7" transform="rotate(-30 52 21)" fill="#5a9ec4" stroke="#C9C2BA" stroke-width="1.5"/>
        <ellipse cx="52" cy="21" rx="2.5" ry="4" transform="rotate(-30 52 21)" fill="#8eb4d4" opacity="0.7"/>
        <!-- tripod -->
        <path d="M28 44L18 58M28 44l10 14M28 44v6" stroke="#8A929A" stroke-width="2" stroke-linecap="round"/>
        <!-- mount joint -->
        <circle cx="28" cy="44" r="2.5" fill="#C9C2BA"/>
        <!-- star twinkles -->
        <path d="M14 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#F0C24A"/>
        <path d="M38 8l0.8 1.5 1.5 0.8-1.5 0.8L38 12.6l-0.8-1.5-1.5-0.8 1.5-0.8z" fill="#FACAA1"/>
      </svg>`,
  },
  58: {
    caption: 'Lighter flint',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- lighter body -->
        <rect x="18" y="22" width="28" height="34" rx="3" fill="#c45c4a" stroke="#a04838" stroke-width="1.5"/>
        <!-- side highlight -->
        <path d="M21 26v26" stroke="#FACAA1" stroke-width="2" stroke-linecap="round" opacity="0.35"/>
        <!-- metal top -->
        <rect x="18" y="16" width="28" height="10" rx="2" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.2"/>
        <!-- flint wheel -->
        <circle cx="38" cy="21" r="5" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <circle cx="38" cy="21" r="2.5" fill="none" stroke="#8A929A" stroke-width="1"/>
        <path d="M38 17v8M35 19l6 4M35 23l6-4" stroke="#C9C2BA" stroke-width="1" opacity="0.7"/>
        <!-- flame -->
        <path d="M28 16c0-6 3-10 5-12 2 3 4 7 4 12-1 3-3 4-4 4s-4-1-5-4z" fill="#F0C24A"/>
        <path d="M30 14c0-3 1.5-5 2.5-6 1 1.5 2 3.5 2 6-0.5 1.5-1.5 2-2 2s-2-0.5-2.5-2z" fill="#FACAA1"/>
        <!-- sparks from flint -->
        <path d="M44 16l4-4M46 20l5-1M44 24l4 2" stroke="#F0C24A" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
  },
  59: {
    caption: 'Torchworker glasses',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- left lens -->
        <ellipse cx="20" cy="30" rx="12" ry="10" fill="#5a3d6b" stroke="#C9C2BA" stroke-width="2"/>
        <ellipse cx="20" cy="30" rx="8" ry="6.5" fill="#7a5490" opacity="0.85"/>
        <!-- right lens -->
        <ellipse cx="44" cy="30" rx="12" ry="10" fill="#5a3d6b" stroke="#C9C2BA" stroke-width="2"/>
        <ellipse cx="44" cy="30" rx="8" ry="6.5" fill="#7a5490" opacity="0.85"/>
        <!-- bridge -->
        <path d="M30 28c2-3 6-3 8 0" stroke="#C9C2BA" stroke-width="2" stroke-linecap="round"/>
        <!-- temples -->
        <path d="M8 28L2 22M56 28l6-6" stroke="#A8B0B8" stroke-width="2.5" stroke-linecap="round"/>
        <!-- lens highlights -->
        <path d="M14 26c2-2 5-3 8-2" stroke="#e8eef4" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
        <path d="M38 26c2-2 5-3 8-2" stroke="#e8eef4" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
        <!-- torch glow hint -->
        <path d="M28 48c2-6 4-8 4-8s2 2 4 8c-2 2-6 2-8 0z" fill="#F0C24A" opacity="0.8"/>
        <path d="M30 46c1-3 2-4 2-4s1 1 2 4c-1 1-3 1-4 0z" fill="#FACAA1"/>
      </svg>`,
  },
  60: {
    caption: 'Electric motor',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- housing -->
        <rect x="10" y="18" width="36" height="28" rx="4" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.5"/>
        <!-- cooling fins -->
        <path d="M16 18v28M22 18v28M28 18v28M34 18v28M40 18v28" stroke="#C9C2BA" stroke-width="1.5" opacity="0.55"/>
        <!-- end bell -->
        <rect x="42" y="22" width="8" height="20" rx="2" fill="#8A929A"/>
        <!-- shaft -->
        <rect x="48" y="28" width="12" height="8" rx="1" fill="#C9C2BA" stroke="#A8B0B8" stroke-width="1.2"/>
        <!-- neodymium magnet hint (cutaway) -->
        <rect x="16" y="26" width="10" height="12" rx="1" fill="#c45c4a"/>
        <rect x="28" y="26" width="10" height="12" rx="1" fill="#2A3F54"/>
        <!-- N / S marks -->
        <path d="M19 30h4M21 30v6" stroke="#FACAA1" stroke-width="1.3" stroke-linecap="round"/>
        <path d="M31 30h4M31 36h4M31 33h4" stroke="#8eb4d4" stroke-width="1.3" stroke-linecap="round"/>
        <!-- mounting feet -->
        <path d="M14 46h8M34 46h8" stroke="#8A929A" stroke-width="3" stroke-linecap="round"/>
        <!-- wire leads -->
        <path d="M14 24c-4-2-6 2-4 6" stroke="#F0C24A" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M14 40c-4 2-6-2-4-6" stroke="#c45c4a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      </svg>`,
  },
  61: {
    caption: 'Luminous Dial',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- bezel -->
        <circle cx="32" cy="32" r="26" fill="#A8B0B8" stroke="#8A929A" stroke-width="2"/>
        <!-- dial face -->
        <circle cx="32" cy="32" r="21" fill="#1a2430"/>
        <!-- soft luminous halo -->
        <circle cx="32" cy="32" r="18" fill="#9CBB80" opacity="0.12"/>
        <!-- major ticks (glowing) -->
        <g stroke="#9CBB80" stroke-width="2.5" stroke-linecap="round">
          <path d="M32 14v5M32 45v5M14 32h5M45 32h5"/>
          <path d="M19.3 19.3l3.5 3.5M41.2 41.2l3.5 3.5M19.3 44.7l3.5-3.5M41.2 22.8l3.5-3.5"/>
        </g>
        <!-- minor ticks -->
        <g stroke="#9CBB80" stroke-width="1.3" stroke-linecap="round" opacity="0.55">
          <path d="M32 17v3M32 44v3M17 32h3M44 32h3"/>
        </g>
        <!-- needle -->
        <path d="M32 32L44 20" stroke="#FACAA1" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="32" cy="32" r="3.5" fill="#C9C2BA" stroke="#A8B0B8" stroke-width="1.2"/>
        <circle cx="32" cy="32" r="1.5" fill="#2A3F54"/>
        <!-- luminous numeral dots -->
        <circle cx="32" cy="20" r="1.8" fill="#c5e0a0"/>
        <circle cx="44" cy="32" r="1.8" fill="#c5e0a0"/>
        <circle cx="32" cy="44" r="1.8" fill="#c5e0a0"/>
        <circle cx="20" cy="32" r="1.8" fill="#c5e0a0"/>
      </svg>`,
  },
  62: {
    caption: 'Nuclear control rod',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- reactor vessel -->
        <rect x="10" y="22" width="44" height="34" rx="4" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- core water glow -->
        <rect x="14" y="28" width="36" height="24" rx="2" fill="#1a3040"/>
        <rect x="14" y="40" width="36" height="12" rx="1" fill="#5a9ec4" opacity="0.25"/>
        <!-- drive mechanism top -->
        <rect x="18" y="8" width="28" height="10" rx="2" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.2"/>
        <path d="M24 8V5h16v3" stroke="#8A929A" stroke-width="2" fill="none" stroke-linecap="round"/>
        <!-- control rods (samarium absorbers) -->
        <rect x="20" y="14" width="5" height="38" rx="1.5" fill="#8A929A"/>
        <rect x="29.5" y="10" width="5" height="42" rx="1.5" fill="#A8B0B8"/>
        <rect x="39" y="16" width="5" height="36" rx="1.5" fill="#8A929A"/>
        <!-- rod tips (inserted deeper) -->
        <rect x="20" y="48" width="5" height="6" rx="1" fill="#c45c4a"/>
        <rect x="29.5" y="48" width="5" height="6" rx="1" fill="#c45c4a"/>
        <rect x="39" y="48" width="5" height="6" rx="1" fill="#c45c4a"/>
        <!-- vessel rim highlight -->
        <path d="M14 26h36" stroke="#5a9ec4" stroke-width="1.2" opacity="0.45"/>
      </svg>`,
  },
  63: {
    caption: 'Color television',
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
  64: {
    caption: 'MRI diagnosis',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- left hemisphere -->
        <path d="M30 12c-10 0-18 8-18 18 0 8 4 14 10 18 3 2 6 3 8 3V12z" fill="#e89bb0" stroke="#d4789a" stroke-width="1.2"/>
        <!-- right hemisphere -->
        <path d="M34 12c10 0 18 8 18 18 0 8-4 14-10 18-3 2-6 3-8 3V12z" fill="#f0a8bc" stroke="#d4789a" stroke-width="1.2"/>
        <!-- midline -->
        <path d="M32 14v34" stroke="#c45c7a" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
        <!-- folds -->
        <path d="M16 22c4 2 8 2 12 0M15 30c5 2 9 2 13 0M17 38c4 2 8 2 11 0" stroke="#c45c7a" stroke-width="1.5" stroke-linecap="round" opacity="0.65"/>
        <path d="M36 22c4 2 8 2 12 0M36 30c5 2 9 2 13 0M36 38c4 2 8 2 11 0" stroke="#c45c7a" stroke-width="1.5" stroke-linecap="round" opacity="0.65"/>
        <!-- cerebellum -->
        <ellipse cx="32" cy="52" rx="10" ry="5" fill="#e089a4" stroke="#d4789a" stroke-width="1.2"/>
        <path d="M26 52h12" stroke="#c45c7a" stroke-width="1.2" opacity="0.5"/>
      </svg>`,
  },
  65: {
    caption: 'Fluorescent light',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- soft glow -->
        <ellipse cx="32" cy="32" rx="28" ry="14" fill="#c5e0a0" opacity="0.25"/>
        <!-- tube -->
        <rect x="6" y="24" width="52" height="16" rx="8" fill="#e8f0d8" stroke="#A8B0B8" stroke-width="1.5"/>
        <!-- phosphor glow inside -->
        <rect x="10" y="27" width="44" height="10" rx="5" fill="#9CBB80" opacity="0.85"/>
        <rect x="12" y="29" width="40" height="4" rx="2" fill="#c5e0a0" opacity="0.9"/>
        <!-- end caps -->
        <rect x="2" y="26" width="6" height="12" rx="1.5" fill="#8A929A"/>
        <rect x="56" y="26" width="6" height="12" rx="1.5" fill="#8A929A"/>
        <!-- pins -->
        <path d="M4 38v4M6 38v4M58 38v4M60 38v4" stroke="#A8B0B8" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
  },
  66: {
    caption: 'Wind turbine',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- ground / hill -->
        <path d="M4 56c10-6 20-6 28 0s18 6 28 0v6H4v-6z" fill="#9CBB80" opacity="0.55"/>
        <!-- tower -->
        <path d="M30 28h4l2 30h-8l2-30z" fill="#C9C2BA" stroke="#A8B0B8" stroke-width="1"/>
        <!-- nacelle -->
        <rect x="26" y="22" width="14" height="8" rx="2" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.2"/>
        <!-- hub -->
        <circle cx="32" cy="26" r="3.5" fill="#2A3F54"/>
        <!-- blades -->
        <path d="M32 26L32 6c2 4 3 10 2 16l-2 4z" fill="#e8eef4" stroke="#C9C2BA" stroke-width="1"/>
        <path d="M32 26L48 36c-5-1-10-3-14-6l-2-4z" fill="#e8eef4" stroke="#C9C2BA" stroke-width="1"/>
        <path d="M32 26L16 36c5-1 10-3 14-6l2-4z" fill="#D6DCE2" stroke="#C9C2BA" stroke-width="1"/>
        <!-- hub center -->
        <circle cx="32" cy="26" r="2" fill="#8A929A"/>
      </svg>`,
  },
  67: {
    caption: 'LASIK eye surgery',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- eye white -->
        <ellipse cx="30" cy="32" rx="24" ry="20" fill="#e8eef4" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- iris -->
        <circle cx="30" cy="32" r="14" fill="#5a9ec4"/>
        <circle cx="30" cy="32" r="14" fill="none" stroke="#3d7ea8" stroke-width="1"/>
        <!-- iris rays -->
        <g stroke="#8eb4d4" stroke-width="1.2" stroke-linecap="round" opacity="0.75">
          <path d="M30 20v4M30 40v4M18 32h4M38 32h4"/>
          <path d="M22 24l2.5 2.5M35.5 37.5l2.5 2.5M22 40l2.5-2.5M35.5 26.5l2.5-2.5"/>
        </g>
        <!-- pupil -->
        <circle cx="30" cy="32" r="6" fill="#1a2430"/>
        <!-- catchlight -->
        <circle cx="26" cy="28" r="2.5" fill="#e8eef4" opacity="0.9"/>
        <circle cx="34" cy="36" r="1.2" fill="#e8eef4" opacity="0.45"/>
        <!-- eyelids hint -->
        <path d="M8 28c6-10 18-14 28-12" stroke="#FACAA1" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
        <path d="M8 36c6 10 18 14 28 12" stroke="#FACAA1" stroke-width="2.5" stroke-linecap="round" opacity="0.55"/>
        <!-- needle / laser probe -->
        <path d="M58 10L34 30" stroke="#A8B0B8" stroke-width="3" stroke-linecap="round"/>
        <path d="M58 10L34 30" stroke="#e8eef4" stroke-width="1.5" stroke-linecap="round"/>
        <!-- needle tip into pupil -->
        <path d="M34 30L30 32" stroke="#8A929A" stroke-width="2" stroke-linecap="round"/>
        <!-- hub / handle -->
        <rect x="54" y="6" width="8" height="8" rx="1.5" fill="#8A929A" transform="rotate(45 58 10)"/>
      </svg>`,
  },
  68: {
    caption: 'Optical fiber connections',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- spool left flange -->
        <ellipse cx="18" cy="32" rx="8" ry="18" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.5"/>
        <ellipse cx="18" cy="32" rx="4" ry="10" fill="#2A3F54"/>
        <!-- spool core / cable wrap -->
        <rect x="18" y="18" width="28" height="28" fill="#c45c4a"/>
        <!-- cable winding lines -->
        <g stroke="#a04838" stroke-width="1.5" opacity="0.7">
          <path d="M18 22h28M18 27h28M18 32h28M18 37h28M18 42h28"/>
        </g>
        <!-- highlight on cable -->
        <path d="M22 20h20" stroke="#FACAA1" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
        <!-- spool right flange -->
        <ellipse cx="46" cy="32" rx="8" ry="18" fill="#C9C2BA" stroke="#8A929A" stroke-width="1.5"/>
        <ellipse cx="46" cy="32" rx="4" ry="10" fill="#2A3F54"/>
        <!-- fiber end trailing off -->
        <path d="M46 40c6 2 10 6 12 12" stroke="#9CBB80" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="58" cy="52" r="2" fill="#c5e0a0"/>
      </svg>`,
  },
  69: {
    caption: 'LASIK eye surgery',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- chart card -->
        <rect x="10" y="4" width="44" height="56" rx="2" fill="#e8eef4" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- row 1: big E -->
        <text x="32" y="20" text-anchor="middle" fill="#2A3F54" font-size="16" font-family="Righteous, Georgia, serif" font-weight="700">E</text>
        <!-- row 2: F P -->
        <text x="32" y="30" text-anchor="middle" fill="#2A3F54" font-size="9" font-family="Righteous, Georgia, serif" font-weight="700" letter-spacing="2">F P</text>
        <!-- red / green duochrome lines -->
        <rect x="14" y="34" width="36" height="5" fill="#c45c4a"/>
        <rect x="14" y="39" width="36" height="5" fill="#9CBB80"/>
        <text x="32" y="38.5" text-anchor="middle" fill="#1a2430" font-size="4.5" font-family="Righteous, Georgia, serif" font-weight="700">T O Z</text>
        <text x="32" y="43.5" text-anchor="middle" fill="#1a2430" font-size="4.5" font-family="Righteous, Georgia, serif" font-weight="700">L P E D</text>
        <!-- smaller bottom rows -->
        <text x="32" y="52" text-anchor="middle" fill="#2A3F54" font-size="4" font-family="Righteous, Georgia, serif" font-weight="700" letter-spacing="1">P E C F D</text>
        <text x="32" y="57" text-anchor="middle" fill="#2A3F54" font-size="3" font-family="Righteous, Georgia, serif" font-weight="700" letter-spacing="1">E D F C Z P</text>
      </svg>`,
  },
  70: {
    caption: 'Scientific fiber lasers',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- laser housing -->
        <rect x="6" y="22" width="36" height="20" rx="3" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- cooling vents -->
        <path d="M12 26h8M12 30h8M12 34h8M12 38h8" stroke="#5a9ec4" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
        <!-- fiber spool on unit -->
        <circle cx="34" cy="32" r="7" fill="#A8B0B8" stroke="#8A929A" stroke-width="1.2"/>
        <circle cx="34" cy="32" r="3.5" fill="#c45c4a"/>
        <circle cx="34" cy="32" r="1.5" fill="#2A3F54"/>
        <!-- fiber cable out -->
        <path d="M40 32c6 0 8-4 10-4" stroke="#9CBB80" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <!-- output head -->
        <rect x="48" y="24" width="10" height="12" rx="2" fill="#8A929A" stroke="#C9C2BA" stroke-width="1.2"/>
        <circle cx="53" cy="30" r="3" fill="#1a2430"/>
        <!-- laser beam -->
        <path d="M56 30h6" stroke="#5a9ec4" stroke-width="3" stroke-linecap="round"/>
        <path d="M56 30h6" stroke="#c5e0a0" stroke-width="1.5" stroke-linecap="round"/>
        <!-- beam glow hit -->
        <circle cx="62" cy="30" r="2" fill="#FACAA1"/>
        <!-- status light -->
        <circle cx="10" cy="28" r="1.5" fill="#9CBB80"/>
      </svg>`,
  },
  71: {
    caption: 'Eiffel Tower',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- ground -->
        <path d="M6 58h52" stroke="#A8B0B8" stroke-width="2" stroke-linecap="round"/>
        <!-- main silhouette -->
        <path d="M12 58l12-26h16l12 26H44L38 40H26L20 58H12z" fill="#8A929A"/>
        <!-- arch -->
        <path d="M22 58c3-7 6-10 10-10s7 3 10 10H22z" fill="#1a2430" opacity="0.4"/>
        <!-- first deck -->
        <rect x="20" y="30" width="24" height="4" rx="0.5" fill="#C9C2BA"/>
        <!-- upper body -->
        <path d="M26 30l4-13h4l4 13H26z" fill="#8A929A"/>
        <!-- second deck -->
        <rect x="26" y="15" width="12" height="3" rx="0.5" fill="#C9C2BA"/>
        <!-- spire -->
        <path d="M29 15l2.5-11h1L35 15H29z" fill="#A8B0B8"/>
        <path d="M32 4V1" stroke="#FACAA1" stroke-width="1.5" stroke-linecap="round"/>
        <!-- lattice -->
        <path d="M18 50h28M24 42h16" stroke="#C9C2BA" stroke-width="1.2" opacity="0.7"/>
        <path d="M22 50L42 42M42 50L22 42" stroke="#A8B0B8" stroke-width="1" opacity="0.55"/>
        <path d="M28 24h8" stroke="#C9C2BA" stroke-width="1" opacity="0.65"/>
      </svg>`,
  },
  72: {
    caption: 'Nuclear submarine',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- water -->
        <path d="M4 44c6 4 12 4 18 0s12-4 18 0 12 4 18 0" stroke="#5a9ec4" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <path d="M4 50c6 3 12 3 18 0s12-3 18 0 12 3 18 0" stroke="#5a9ec4" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
        <!-- hull -->
        <ellipse cx="30" cy="36" rx="24" ry="10" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- bow highlight -->
        <path d="M10 36c2-4 8-7 16-7" stroke="#5a9ec4" stroke-width="1.2" opacity="0.45" stroke-linecap="round"/>
        <!-- sail / conning tower -->
        <path d="M26 26h12l2 10H24l2-10z" fill="#8A929A" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- sail windows -->
        <circle cx="30" cy="30" r="1.3" fill="#5a9ec4"/>
        <circle cx="35" cy="30" r="1.3" fill="#5a9ec4"/>
        <!-- periscope -->
        <path d="M36 26V14" stroke="#A8B0B8" stroke-width="2" stroke-linecap="round"/>
        <path d="M36 14h5" stroke="#A8B0B8" stroke-width="2" stroke-linecap="round"/>
        <circle cx="42" cy="14" r="2" fill="#9CBB80"/>
        <!-- stern / prop hub -->
        <ellipse cx="54" cy="36" rx="3" ry="5" fill="#8A929A"/>
        <!-- propeller -->
        <path d="M56 30c4 2 4 4 0 6M56 42c4-2 4-4 0-6" stroke="#C9C2BA" stroke-width="2" stroke-linecap="round"/>
        <!-- dive planes -->
        <path d="M22 30l-4-6h6l2 6H22z" fill="#A8B0B8"/>
        <path d="M22 42l-4 6h6l2-6H22z" fill="#A8B0B8"/>
      </svg>`,
  },
  73: {
    caption: 'Mobile phone',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- body -->
        <rect x="18" y="6" width="28" height="52" rx="4" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- screen -->
        <rect x="21" y="12" width="22" height="36" rx="2" fill="#1a3040"/>
        <!-- status bar glow -->
        <rect x="21" y="12" width="22" height="4" fill="#5a9ec4" opacity="0.35"/>
        <!-- app icons -->
        <rect x="24" y="20" width="6" height="6" rx="1.2" fill="#9CBB80"/>
        <rect x="34" y="20" width="6" height="6" rx="1.2" fill="#FACAA1"/>
        <rect x="24" y="30" width="6" height="6" rx="1.2" fill="#c45c4a"/>
        <rect x="34" y="30" width="6" height="6" rx="1.2" fill="#5a9ec4"/>
        <!-- home indicator -->
        <path d="M28 52h8" stroke="#A8B0B8" stroke-width="2" stroke-linecap="round"/>
        <!-- speaker / notch -->
        <path d="M28 9h8" stroke="#8A929A" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
  },
  74: {
    caption: 'Light bulb filament',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- soft glow -->
        <ellipse cx="32" cy="30" rx="18" ry="16" fill="#FACAA1" opacity="0.2"/>
        <!-- glass envelope hint -->
        <path d="M18 34c0-12 6-22 14-22s14 10 14 22c0 6-3 10-6 12H24c-3-2-6-6-6-12z" fill="none" stroke="#C9C2BA" stroke-width="1.5" opacity="0.55"/>
        <!-- support posts -->
        <path d="M26 48V28M38 48V28" stroke="#A8B0B8" stroke-width="2" stroke-linecap="round"/>
        <!-- coiled tungsten filament -->
        <path d="M26 28c2-4 4-4 6 0s4 4 6 0 4-4 6 0" stroke="#F0C24A" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M26 32c2-4 4-4 6 0s4 4 6 0 4-4 6 0" stroke="#e0b44e" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M26 36c2-4 4-4 6 0s4 4 6 0 4-4 6 0" stroke="#F0C24A" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <!-- stem / base mount -->
        <rect x="24" y="46" width="16" height="6" rx="1.5" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.2"/>
        <rect x="27" y="52" width="10" height="4" rx="1" fill="#8A929A"/>
      </svg>`,
  },
  75: {
    caption: 'Rocket engine',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- fairing / nose -->
        <path d="M32 4l8 12H24L32 4z" fill="#e8eef4" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- white booster body -->
        <rect x="24" y="16" width="16" height="28" fill="#e8eef4" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- SpaceX-style stripe / markings -->
        <rect x="24" y="30" width="16" height="3" fill="#2A3F54"/>
        <path d="M28 20h8M28 24h8" stroke="#A8B0B8" stroke-width="1" opacity="0.7"/>
        <!-- grid fins -->
        <rect x="16" y="20" width="7" height="8" rx="0.5" fill="#8A929A" stroke="#C9C2BA" stroke-width="1"/>
        <path d="M17.5 22h4M17.5 24h4M17.5 26h4M19 21.5v5M21 21.5v5" stroke="#2A3F54" stroke-width="0.8"/>
        <rect x="41" y="20" width="7" height="8" rx="0.5" fill="#8A929A" stroke="#C9C2BA" stroke-width="1"/>
        <path d="M42.5 22h4M42.5 24h4M42.5 26h4M44 21.5v5M46 21.5v5" stroke="#2A3F54" stroke-width="0.8"/>
        <!-- engine section -->
        <path d="M24 44h16l-2 4H26l-2-4z" fill="#2A3F54"/>
        <!-- engine bells -->
        <path d="M26 48l-2 4h6l-2-4H26z" fill="#8A929A"/>
        <path d="M34 48l-2 4h6l-2-4H34z" fill="#8A929A"/>
        <path d="M30 48l-1.5 3h5l-1.5-3H30z" fill="#A8B0B8"/>
        <!-- exhaust plume -->
        <path d="M28 52c-2 4-1 8 4 10 5-2 6-6 4-10H28z" fill="#c45c4a"/>
        <path d="M30 52c-1 3 0 6 2 8 2-2 3-5 2-8h-4z" fill="#F0C24A"/>
        <path d="M31 52c0 2 0.5 4 1 5 0.5-1 1-3 1-5h-2z" fill="#FACAA1"/>
      </svg>`,
  },
  76: {
    caption: 'Pen points',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- paper -->
        <rect x="8" y="14" width="36" height="44" rx="2" fill="#e8eef4" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- ruled lines -->
        <path d="M14 26h24M14 34h24M14 42h20" stroke="#A8B0B8" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
        <!-- ink writing -->
        <path d="M14 50c4-2 8 2 12 0s8-2 12 1" stroke="#2A3F54" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <!-- pen body -->
        <path d="M38 8l18 18" stroke="#c45c4a" stroke-width="5" stroke-linecap="round"/>
        <path d="M38 8l18 18" stroke="#FACAA1" stroke-width="2.5" stroke-linecap="round"/>
        <!-- metal nib / pen point -->
        <path d="M36 28l6-6 4 4-8 10-4-4z" fill="#8A929A" stroke="#C9C2BA" stroke-width="1.2"/>
        <path d="M38 30l6 6" stroke="#2A3F54" stroke-width="1" stroke-linecap="round"/>
        <!-- tip touching paper -->
        <circle cx="36" cy="36" r="1.5" fill="#2A3F54"/>
      </svg>`,
  },
  77: {
    caption: 'Spark plugs',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- ceramic insulator -->
        <rect x="26" y="6" width="12" height="22" rx="2" fill="#e8eef4" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- ribs -->
        <path d="M26 12h12M26 17h12M26 22h12" stroke="#A8B0B8" stroke-width="1.5"/>
        <!-- hex nut -->
        <path d="M22 28h20l3 6H19l3-6z" fill="#8A929A" stroke="#C9C2BA" stroke-width="1.2"/>
        <rect x="22" y="34" width="20" height="6" fill="#A8B0B8" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- threaded metal body -->
        <rect x="26" y="40" width="12" height="12" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.2"/>
        <path d="M26 43h12M26 46h12M26 49h12" stroke="#8A929A" stroke-width="1" opacity="0.8"/>
        <!-- center electrode -->
        <path d="M32 52v6" stroke="#C9C2BA" stroke-width="2" stroke-linecap="round"/>
        <!-- ground electrode hook -->
        <path d="M26 56h6" stroke="#A8B0B8" stroke-width="2.5" stroke-linecap="round"/>
        <!-- spark -->
        <circle cx="32" cy="56" r="3" fill="#F0C24A" opacity="0.5"/>
        <path d="M32 53l1.5 2h-1l1.5 3-2.5-2.5H33L32 53z" fill="#F0C24A"/>
      </svg>`,
  },
  78: {
    caption: 'Labware',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- Erlenmeyer flask -->
        <path d="M26 8h12v10l10 28c1 3-1 6-4 6H20c-3 0-5-3-4-6l10-28V8z" fill="#C9C2BA" stroke="#A8B0B8" stroke-width="1.5" opacity="0.9"/>
        <!-- glass highlight -->
        <path d="M28 12v8l-8 24" stroke="#e8eef4" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
        <!-- platinum-colored rim -->
        <rect x="24" y="6" width="16" height="4" rx="1" fill="#A8B0B8" stroke="#8A929A" stroke-width="1"/>
        <!-- liquid -->
        <path d="M18 42c1 4 3 6 6 6h16c3 0 5-2 6-6l-2-6H20l-2 6z" fill="#5a9ec4" opacity="0.55"/>
        <!-- bubbles -->
        <circle cx="28" cy="44" r="1.5" fill="#e8eef4" opacity="0.8"/>
        <circle cx="34" cy="46" r="1" fill="#e8eef4" opacity="0.7"/>
        <!-- small beaker beside -->
        <path d="M46 28h12v22c0 2-1 3-3 3H49c-2 0-3-1-3-3V28z" fill="#C9C2BA" stroke="#A8B0B8" stroke-width="1.2" opacity="0.85"/>
        <path d="M46 28h12" stroke="#8A929A" stroke-width="2" stroke-linecap="round"/>
        <rect x="48" y="36" width="8" height="12" rx="1" fill="#9CBB80" opacity="0.5"/>
      </svg>`,
  },
  79: {
    caption: 'Jewelry',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- necklace chain -->
        <path d="M16 8c4 10 10 16 16 16s12-6 16-16" stroke="#e0b44e" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M18 10c3.5 8 8.5 13 14 13s10.5-5 14-13" stroke="#F0C24A" stroke-width="1" fill="none" opacity="0.7"/>
        <!-- ruby pendant -->
        <path d="M32 22l5 7-5 7-5-7 5-7z" fill="#c45c4a" stroke="#a04438" stroke-width="1"/>
        <path d="M32 24l3 5-3 2-3-2 3-5z" fill="#e07870" opacity="0.7"/>
        <!-- gold ring with green gem -->
        <circle cx="16" cy="50" r="8" fill="none" stroke="#e0b44e" stroke-width="3.5"/>
        <circle cx="16" cy="50" r="8" fill="none" stroke="#F0C24A" stroke-width="1.5"/>
        <!-- gold setting -->
        <path d="M11 42h10l-2 4H13l-2-4z" fill="#e0b44e"/>
        <!-- emerald gem -->
        <path d="M16 34l5 6-5 4-5-4 5-6z" fill="#2f8f4e"/>
        <path d="M16 36l3 4h-6l3-4z" fill="#5fcf7a"/>
        <path d="M14 38l2-1 2 1-2 1.5-2-1.5z" fill="#b8f0c4" opacity="0.85"/>
        <!-- open braided bracelet -->
        <path d="M30 42c6 2 12 8 16 14" stroke="#e0b44e" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M32 40c7 3 13 9 16 14" stroke="#F0C24A" stroke-width="1.4" fill="none" stroke-linecap="round"/>
        <path d="M28 44c5 1 11 7 15 12" stroke="#c9962e" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.8"/>
        <!-- braid cross-hatches -->
        <path d="M34 44l3 2M38 47l3 2M42 50l3 2M46 53l2 2" stroke="#c9962e" stroke-width="1" stroke-linecap="round"/>
        <path d="M36 43l-2 3M40 46l-2 3M44 49l-2 3M48 52l-2 3" stroke="#F0C24A" stroke-width="1" stroke-linecap="round" opacity="0.75"/>
        <!-- silver end caps -->
        <circle cx="29" cy="42" r="2.8" fill="#C9C2BA" stroke="#A8B0B8" stroke-width="1"/>
        <circle cx="47" cy="57" r="2.8" fill="#C9C2BA" stroke="#A8B0B8" stroke-width="1"/>
      </svg>`,
  },
  80: {
    caption: 'Dental filling',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- tooth -->
        <path d="M20 14c0-4 4-8 12-8s12 4 12 8c2 4 4 10 4 16 0 8-2 18-4 24-1 3-3 4-5 4s-4-2-5-5c-1 3-3 5-5 5s-4-1-5-4c-2-6-4-16-4-24 0-6 2-12 4-16z" fill="#e8eef4" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- tooth shading -->
        <path d="M28 10c-4 2-6 8-6 16 0 8 1 16 3 22" stroke="#C9C2BA" stroke-width="1.2" opacity="0.45" stroke-linecap="round"/>
        <!-- amalgam filling (mercury silver) -->
        <path d="M26 20c2-2 6-3 10-2 3 1 5 3 6 6 0 2-1 4-3 5h-12c-2-1-3-3-3-5 0-2 1-3 2-4z" fill="#8A929A" stroke="#A8B0B8" stroke-width="1"/>
        <path d="M28 22c2-1 5-1 8 0 1 1 2 2 2 3H28c0-1 0-2 0-3z" fill="#C9C2BA" opacity="0.7"/>
        <!-- filling highlight -->
        <path d="M30 23h4" stroke="#e8eef4" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>
      </svg>`,
  },
  81: {
    caption: 'Cardiac scan',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- soft tracer halo -->
        <ellipse cx="32" cy="34" rx="22" ry="20" fill="#c45c4a" opacity="0.12"/>
        <!-- heart -->
        <path d="M32 54C18 44 10 34 10 24c0-7 5-12 11-12 4 0 7 2 9 5 2-3 5-5 9-5 6 0 11 5 11 12 0 10-8 20-18 30z" fill="#c45c4a" stroke="#a04438" stroke-width="1.5"/>
        <!-- highlight lobe -->
        <path d="M22 18c-3 0-6 3-6 7 0 2 1 4 2 6" stroke="#e07870" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <!-- perfusion hot spot (Tl-201 uptake) -->
        <ellipse cx="36" cy="30" rx="7" ry="6" fill="#F0C24A" opacity="0.55"/>
        <ellipse cx="36" cy="30" rx="3.5" ry="3" fill="#FACAA1" opacity="0.85"/>
        <!-- scan sweep arcs -->
        <path d="M14 20c6-8 14-12 22-12" stroke="#5a9ec4" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
        <path d="M48 22c4 6 6 14 4 22" stroke="#5a9ec4" stroke-width="1.8" stroke-linecap="round" opacity="0.65"/>
        <path d="M44 48c-8 6-18 8-28 4" stroke="#5a9ec4" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
        <!-- scan ticks -->
        <path d="M16 16l2 3M50 26l-3 2M40 52l-2-3" stroke="#9CBB80" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
  },
  82: {
    caption: 'Weights',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- left plate outer -->
        <rect x="6" y="18" width="12" height="28" rx="2" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- left plate inner -->
        <rect x="16" y="22" width="6" height="20" rx="1" fill="#8A929A" stroke="#A8B0B8" stroke-width="1.2"/>
        <!-- bar -->
        <rect x="20" y="29" width="24" height="6" rx="1.5" fill="#A8B0B8" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- grip knurling -->
        <path d="M28 29v6M32 29v6M36 29v6" stroke="#8A929A" stroke-width="1.2" opacity="0.8"/>
        <!-- right plate inner -->
        <rect x="42" y="22" width="6" height="20" rx="1" fill="#8A929A" stroke="#A8B0B8" stroke-width="1.2"/>
        <!-- right plate outer -->
        <rect x="46" y="18" width="12" height="28" rx="2" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- plate highlights -->
        <path d="M9 22v20" stroke="#A8B0B8" stroke-width="1.2" opacity="0.45"/>
        <path d="M55 22v20" stroke="#A8B0B8" stroke-width="1.2" opacity="0.45"/>
      </svg>`,
  },
  83: {
    caption: 'Fire sprinklers',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- ceiling pipe -->
        <rect x="28" y="4" width="8" height="14" rx="1" fill="#8A929A" stroke="#A8B0B8" stroke-width="1.2"/>
        <!-- fitting / escutcheon -->
        <ellipse cx="32" cy="18" rx="10" ry="3" fill="#A8B0B8" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- frame arms -->
        <path d="M22 20c0 10 4 18 10 22" stroke="#C9C2BA" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M42 20c0 10-4 18-10 22" stroke="#C9C2BA" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- fusible link / glass bulb -->
        <ellipse cx="32" cy="28" rx="3" ry="6" fill="#c45c4a" stroke="#a04438" stroke-width="1.2"/>
        <path d="M32 24v6" stroke="#FACAA1" stroke-width="1" opacity="0.7"/>
        <!-- deflector plate -->
        <ellipse cx="32" cy="44" rx="12" ry="3" fill="#8A929A" stroke="#C9C2BA" stroke-width="1.5"/>
        <ellipse cx="32" cy="43" rx="8" ry="1.5" fill="#A8B0B8" opacity="0.7"/>
        <!-- water spray -->
        <path d="M20 48l-6 10M26 50l-2 10M32 51v11M38 50l2 10M44 48l6 10" stroke="#5a9ec4" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
        <path d="M23 50l-3 8M29 51l-1 9M35 51l1 9M41 50l3 8" stroke="#5a9ec4" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
      </svg>`,
  },
  84: {
    caption: 'Antistatic brush',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- handle -->
        <path d="M10 14c0-4 3-6 7-6h6c3 0 5 2 5 5v8H10V14z" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- ferrule / metal band (Po source housing) -->
        <rect x="10" y="20" width="18" height="8" rx="1.5" fill="#8A929A" stroke="#C9C2BA" stroke-width="1.2"/>
        <path d="M13 23h12" stroke="#A8B0B8" stroke-width="1" opacity="0.7"/>
        <!-- brush head -->
        <path d="M12 28h14l4 8H8l4-8z" fill="#A8B0B8" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- bristles -->
        <g stroke="#C9C2BA" stroke-width="1.6" stroke-linecap="round">
          <path d="M10 36v18M14 36v20M18 36v20M22 36v20M26 36v18"/>
        </g>
        <g stroke="#8A929A" stroke-width="1.2" stroke-linecap="round" opacity="0.8">
          <path d="M12 36v16M16 36v18M20 36v18M24 36v16"/>
        </g>
        <!-- static discharge sparks -->
        <path d="M34 40l6-4 4 6 6-3" stroke="#F0C24A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M40 28l3 5M48 34l5 2M52 44l4-3" stroke="#FACAA1" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="46" cy="42" r="2" fill="#F0C24A" opacity="0.7"/>
      </svg>`,
  },
  85: {
    caption: 'Cancer therapy',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- awareness ribbon loop -->
        <path d="M26 8c-6 0-10 5-10 11 0 8 6 14 16 22 10-8 16-14 16-22 0-6-4-11-10-11-3 0-6 2-6 5 0-3-3-5-6-5z" fill="#c45c4a" stroke="#a04438" stroke-width="1.5"/>
        <!-- ribbon tails -->
        <path d="M28 36l-8 20h6l6-14z" fill="#c45c4a" stroke="#a04438" stroke-width="1.2"/>
        <path d="M36 36l8 20h-6l-6-14z" fill="#a04438" stroke="#8a3830" stroke-width="1.2"/>
        <!-- highlight on loop -->
        <path d="M22 14c-2 3-2 7 0 11" stroke="#e07870" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <!-- alpha therapy targeting reticle -->
        <circle cx="48" cy="48" r="10" fill="none" stroke="#5a9ec4" stroke-width="1.5"/>
        <circle cx="48" cy="48" r="4" fill="none" stroke="#9CBB80" stroke-width="1.5"/>
        <path d="M48 36v4M48 56v-4M36 48h4M60 48h-4" stroke="#5a9ec4" stroke-width="1.5" stroke-linecap="round"/>
        <!-- hot spot -->
        <circle cx="48" cy="48" r="2" fill="#F0C24A"/>
      </svg>`,
  },
  86: {
    caption: 'Surgical implants',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- soft tissue hint -->
        <ellipse cx="32" cy="36" rx="22" ry="18" fill="#e89bb0" opacity="0.2"/>
        <!-- radon seed capsules (brachytherapy) -->
        <rect x="12" y="20" width="8" height="28" rx="4" fill="#A8B0B8" stroke="#C9C2BA" stroke-width="1.3"/>
        <rect x="28" y="16" width="8" height="32" rx="4" fill="#8A929A" stroke="#C9C2BA" stroke-width="1.3"/>
        <rect x="44" y="22" width="8" height="26" rx="4" fill="#A8B0B8" stroke="#C9C2BA" stroke-width="1.3"/>
        <!-- sealed end caps -->
        <ellipse cx="16" cy="20" rx="4" ry="2.5" fill="#C9C2BA"/>
        <ellipse cx="32" cy="16" rx="4" ry="2.5" fill="#C9C2BA"/>
        <ellipse cx="48" cy="22" rx="4" ry="2.5" fill="#C9C2BA"/>
        <ellipse cx="16" cy="48" rx="4" ry="2.5" fill="#8A929A"/>
        <ellipse cx="32" cy="48" rx="4" ry="2.5" fill="#8A929A"/>
        <ellipse cx="48" cy="48" rx="4" ry="2.5" fill="#8A929A"/>
        <!-- radioactive glow inside seeds -->
        <rect x="14" y="26" width="4" height="14" rx="2" fill="#9CBB80" opacity="0.75"/>
        <rect x="30" y="24" width="4" height="16" rx="2" fill="#F0C24A" opacity="0.8"/>
        <rect x="46" y="28" width="4" height="12" rx="2" fill="#9CBB80" opacity="0.7"/>
        <!-- faint emission marks -->
        <path d="M22 24l4-3M22 32h5M22 40l4 3" stroke="#FACAA1" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
        <path d="M38 20l4-2M38 32h5M38 44l4 2" stroke="#FACAA1" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
      </svg>`,
  },
  87: {
    caption: 'Laser atom trap',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- vacuum chamber hint -->
        <circle cx="32" cy="32" r="26" fill="#1a3040" stroke="#A8B0B8" stroke-width="1.5" opacity="0.9"/>
        <circle cx="32" cy="32" r="22" fill="none" stroke="#5a9ec4" stroke-width="1" opacity="0.35"/>
        <!-- trapped atom cloud -->
        <circle cx="32" cy="32" r="8" fill="#9CBB80" opacity="0.25"/>
        <circle cx="32" cy="32" r="4" fill="#9CBB80" opacity="0.55"/>
        <circle cx="32" cy="32" r="2" fill="#FACAA1"/>
        <!-- laser beams into the trap -->
        <path d="M4 32h20" stroke="#c45c4a" stroke-width="2" stroke-linecap="round"/>
        <path d="M40 32h20" stroke="#c45c4a" stroke-width="2" stroke-linecap="round"/>
        <path d="M32 4v20" stroke="#5a9ec4" stroke-width="2" stroke-linecap="round"/>
        <path d="M32 40v20" stroke="#5a9ec4" stroke-width="2" stroke-linecap="round"/>
        <path d="M10 10l14 14" stroke="#F0C24A" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
        <path d="M54 54L40 40" stroke="#F0C24A" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
        <!-- beam sources -->
        <rect x="2" y="28" width="6" height="8" rx="1" fill="#8A929A"/>
        <rect x="56" y="28" width="6" height="8" rx="1" fill="#8A929A"/>
        <rect x="28" y="2" width="8" height="6" rx="1" fill="#8A929A"/>
        <rect x="28" y="56" width="8" height="6" rx="1" fill="#8A929A"/>
      </svg>`,
  },
  88: {
    caption: 'Luminous watch',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- outer radium bloom -->
        <circle cx="32" cy="32" r="28" fill="#9CBB80" opacity="0.18"/>
        <circle cx="32" cy="32" r="22" fill="#9CBB80" opacity="0.22"/>
        <!-- strap left -->
        <path d="M8 26h10v12H8c-2 0-4-2-4-4v-4c0-2 2-4 4-4z" fill="#2A3F54" stroke="#9CBB80" stroke-width="1.2"/>
        <path d="M6 30h8M6 34h8" stroke="#9CBB80" stroke-width="1" opacity="0.55"/>
        <!-- strap right -->
        <path d="M46 26h10c2 0 4 2 4 4v4c0 2-2 4-4 4H46V26z" fill="#2A3F54" stroke="#9CBB80" stroke-width="1.2"/>
        <path d="M50 30h8M50 34h8" stroke="#9CBB80" stroke-width="1" opacity="0.55"/>
        <!-- case -->
        <circle cx="32" cy="32" r="16" fill="#3d5a40" stroke="#9CBB80" stroke-width="2"/>
        <!-- dial -->
        <circle cx="32" cy="32" r="13" fill="#1a2e1c"/>
        <!-- strong dial glow -->
        <circle cx="32" cy="32" r="12" fill="#9CBB80" opacity="0.35"/>
        <circle cx="32" cy="32" r="8" fill="#c5e0a0" opacity="0.25"/>
        <!-- luminous markers -->
        <g fill="#c5e0a0">
          <circle cx="32" cy="22" r="2"/>
          <circle cx="42" cy="32" r="2"/>
          <circle cx="32" cy="42" r="2"/>
          <circle cx="22" cy="32" r="2"/>
          <circle cx="39" cy="25" r="1.3"/>
          <circle cx="39" cy="39" r="1.3"/>
          <circle cx="25" cy="39" r="1.3"/>
          <circle cx="25" cy="25" r="1.3"/>
        </g>
        <!-- glowing hands -->
        <path d="M32 32L32 22" stroke="#c5e0a0" stroke-width="3" stroke-linecap="round"/>
        <path d="M32 32L41 37" stroke="#9CBB80" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="32" cy="32" r="2.5" fill="#c5e0a0"/>
        <!-- crown -->
        <rect x="47" y="29" width="4" height="6" rx="1" fill="#3d5a40" stroke="#9CBB80" stroke-width="1"/>
      </svg>`,
  },
  89: {
    caption: 'Radioactive medicine',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- glow around dose -->
        <ellipse cx="32" cy="34" rx="14" ry="18" fill="#F0C24A" opacity="0.2"/>
        <!-- plunger thumb rest -->
        <rect x="24" y="4" width="16" height="6" rx="2" fill="#C9C2BA" stroke="#A8B0B8" stroke-width="1.2"/>
        <!-- plunger rod -->
        <rect x="29" y="8" width="6" height="12" rx="1" fill="#A8B0B8" stroke="#8A929A" stroke-width="1"/>
        <!-- finger flange -->
        <rect x="18" y="18" width="28" height="5" rx="1.5" fill="#8A929A" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- barrel -->
        <rect x="22" y="22" width="20" height="28" rx="3" fill="#e8eef4" stroke="#A8B0B8" stroke-width="1.5"/>
        <!-- radioactive dose -->
        <rect x="24" y="30" width="16" height="18" rx="2" fill="#F0C24A" opacity="0.85"/>
        <rect x="26" y="32" width="12" height="8" rx="1" fill="#c5e0a0" opacity="0.7"/>
        <!-- measurement marks -->
        <path d="M26 26h12M26 30h12M26 34h12" stroke="#8A929A" stroke-width="1" opacity="0.45"/>
        <!-- tiny trefoil on barrel -->
        <circle cx="32" cy="27" r="3.2" fill="#F0C24A"/>
        <circle cx="32" cy="27" r="1" fill="#1a1a1a"/>
        <path d="M32 27l0-2.2M32 27l1.9 1.1M32 27l-1.9 1.1" stroke="#1a1a1a" stroke-width="1.2" stroke-linecap="round"/>
        <!-- hub -->
        <rect x="28" y="48" width="8" height="5" rx="1" fill="#A8B0B8"/>
        <!-- needle -->
        <path d="M32 53v9" stroke="#C9C2BA" stroke-width="2" stroke-linecap="round"/>
        <path d="M30 60l2 3 2-3" fill="#C9C2BA"/>
      </svg>`,
  },
  90: {
    caption: 'Gas lantern',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- handle -->
        <path d="M24 8h16" stroke="#8A929A" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M26 8v6M38 8v6" stroke="#A8B0B8" stroke-width="2" stroke-linecap="round"/>
        <!-- top cap -->
        <path d="M20 14h24l-2 6H22l-2-6z" fill="#8A929A" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- glass globe -->
        <path d="M18 20c0 2 2 4 4 14h20c2-10 4-12 4-14 0-2-2-4-14-4s-14 2-14 4z" fill="#FACAA1" opacity="0.25"/>
        <path d="M18 20c0 2 2 4 4 14h20c2-10 4-12 4-14 0-2-2-4-14-4s-14 2-14 4z" fill="none" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- thorium mantle glow -->
        <ellipse cx="32" cy="28" rx="8" ry="10" fill="#F0C24A" opacity="0.55"/>
        <ellipse cx="32" cy="28" rx="4" ry="6" fill="#FACAA1" opacity="0.85"/>
        <!-- mantle mesh hint -->
        <path d="M28 22c2 4 2 8 0 12M32 20v16M36 22c-2 4-2 8 0 12" stroke="#e0b44e" stroke-width="1" opacity="0.7"/>
        <!-- base / fuel tank -->
        <rect x="20" y="34" width="24" height="6" rx="1" fill="#A8B0B8" stroke="#C9C2BA" stroke-width="1.2"/>
        <path d="M22 40h20v14c0 2-2 4-4 4H26c-2 0-4-2-4-4V40z" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- tank details -->
        <path d="M26 46h12M26 50h8" stroke="#8A929A" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
        <!-- control knob -->
        <circle cx="40" cy="48" r="3" fill="#8A929A" stroke="#C9C2BA" stroke-width="1"/>
      </svg>`,
  },
  91: {
    caption: 'Radioactive waste',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- ground shadow -->
        <ellipse cx="32" cy="56" rx="18" ry="4" fill="#1a3040" opacity="0.35"/>
        <!-- drum body -->
        <path d="M14 18h36v34c0 2-2 4-4 4H18c-2 0-4-2-4-4V18z" fill="#F0C24A" stroke="#c9a03a" stroke-width="1.5"/>
        <!-- top rim -->
        <ellipse cx="32" cy="18" rx="18" ry="6" fill="#FACAA1" stroke="#c9a03a" stroke-width="1.5"/>
        <!-- lid -->
        <ellipse cx="32" cy="16" rx="14" ry="4.5" fill="#F0C24A" stroke="#c9a03a" stroke-width="1.2"/>
        <!-- reinforcing rings -->
        <path d="M14 28h36M14 40h36" stroke="#c9a03a" stroke-width="2.5" opacity="0.85"/>
        <!-- trefoil hazard mark -->
        <circle cx="32" cy="36" r="9" fill="#1a1a1a"/>
        <circle cx="32" cy="36" r="2.2" fill="#F0C24A"/>
        <path d="M32 36l0-6.5M32 36l5.6 3.25M32 36l-5.6 3.25" stroke="#F0C24A" stroke-width="3.2" stroke-linecap="round"/>
        <!-- faint glow -->
        <ellipse cx="32" cy="36" rx="12" ry="10" fill="#9CBB80" opacity="0.2"/>
      </svg>`,
  },
  92: {
    caption: 'Nuclear power plant',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- ground -->
        <path d="M4 52h56" stroke="#8A929A" stroke-width="2" stroke-linecap="round"/>
        <!-- left cooling tower -->
        <path d="M8 52c2-14 4-28 10-34 6 6 8 20 10 34H8z" fill="#A8B0B8" stroke="#C9C2BA" stroke-width="1.3"/>
        <ellipse cx="18" cy="18" rx="6" ry="2.5" fill="#8A929A" stroke="#C9C2BA" stroke-width="1"/>
        <!-- right cooling tower -->
        <path d="M28 52c2-14 4-28 10-34 6 6 8 20 10 34H28z" fill="#8A929A" stroke="#C9C2BA" stroke-width="1.3"/>
        <ellipse cx="38" cy="18" rx="6" ry="2.5" fill="#A8B0B8" stroke="#C9C2BA" stroke-width="1"/>
        <!-- steam plumes -->
        <path d="M14 16c-2-6 2-10 4-8 2-4 6-2 5 2 3-2 6 2 3 6" stroke="#C9C2BA" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.75"/>
        <path d="M34 16c-2-7 3-11 5-8 2-5 7-2 5 3 3-3 7 2 3 7" stroke="#C9C2BA" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.8"/>
        <!-- reactor building -->
        <rect x="48" y="34" width="12" height="18" rx="1" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.2"/>
        <rect x="50" y="38" width="3" height="4" fill="#5a9ec4" opacity="0.7"/>
        <rect x="55" y="38" width="3" height="4" fill="#5a9ec4" opacity="0.5"/>
        <!-- containment dome -->
        <path d="M48 34h12v-2c0-5-3-8-6-8s-6 3-6 8v2z" fill="#A8B0B8" stroke="#C9C2BA" stroke-width="1.2"/>
      </svg>`,
  },
  93: {
    caption: 'Spacecraft battery',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- RTG cylinder body -->
        <rect x="20" y="16" width="24" height="36" rx="4" fill="#8A929A" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- cooling fins -->
        <path d="M12 22h8M12 28h8M12 34h8M12 40h8M12 46h8" stroke="#A8B0B8" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M44 22h8M44 28h8M44 34h8M44 40h8M44 46h8" stroke="#A8B0B8" stroke-width="2.5" stroke-linecap="round"/>
        <!-- hot core glow (Pu-238 from Np) -->
        <rect x="26" y="24" width="12" height="20" rx="2" fill="#c45c4a" opacity="0.85"/>
        <rect x="28" y="28" width="8" height="12" rx="1.5" fill="#F0C24A" opacity="0.9"/>
        <!-- top cap -->
        <ellipse cx="32" cy="16" rx="12" ry="4" fill="#A8B0B8" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- base -->
        <ellipse cx="32" cy="52" rx="12" ry="4" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- heat shimmer -->
        <path d="M18 12c2-3 4-3 6 0M28 8c2-3 4-3 6 0M38 12c2-3 4-3 6 0" stroke="#FACAA1" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
      </svg>`,
  },
  94: {
    caption: 'Nuclear weapons',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- missile body -->
        <path d="M28 8c2-4 6-4 8 0l4 10v28l-8 10-8-10V18l4-10z" fill="#8A929A" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- nose cone -->
        <path d="M28 8c2-4 6-4 8 0l-4 8-4-8z" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- warhead band -->
        <rect x="26" y="18" width="12" height="6" fill="#c45c4a" stroke="#a04438" stroke-width="1"/>
        <!-- body rings -->
        <path d="M26 30h12M26 38h12" stroke="#A8B0B8" stroke-width="1.5" opacity="0.8"/>
        <!-- fins -->
        <path d="M26 46l-8 10h8V46z" fill="#A8B0B8" stroke="#C9C2BA" stroke-width="1.2"/>
        <path d="M38 46l8 10h-8V46z" fill="#A8B0B8" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- trefoil mark -->
        <circle cx="32" cy="34" r="4.5" fill="#F0C24A"/>
        <circle cx="32" cy="34" r="1.2" fill="#1a1a1a"/>
        <path d="M32 34l0-2.8M32 34l2.4 1.4M32 34l-2.4 1.4" stroke="#1a1a1a" stroke-width="1.4" stroke-linecap="round"/>
      </svg>`,
  },
  95: {
    caption: 'Smoke detectors',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- ceiling mount plate -->
        <ellipse cx="32" cy="14" rx="14" ry="4" fill="#8A929A" stroke="#A8B0B8" stroke-width="1.2"/>
        <!-- detector body -->
        <ellipse cx="32" cy="28" rx="22" ry="16" fill="#C9C2BA" stroke="#A8B0B8" stroke-width="1.5"/>
        <ellipse cx="32" cy="26" rx="18" ry="12" fill="#e8eef4" stroke="#A8B0B8" stroke-width="1.2"/>
        <!-- vent slots -->
        <path d="M18 24h6M26 22h12M40 24h6M20 30h8M36 30h8" stroke="#8A929A" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
        <!-- Am-241 chamber hint -->
        <circle cx="32" cy="28" r="5" fill="#F0C24A" opacity="0.35"/>
        <circle cx="32" cy="28" r="2.5" fill="#F0C24A"/>
        <!-- test button -->
        <circle cx="44" cy="34" r="3" fill="#c45c4a" stroke="#a04438" stroke-width="1"/>
        <!-- smoke wisps -->
        <path d="M10 48c2-4 4-4 6 0 2-4 4-4 6 0" stroke="#8A929A" stroke-width="1.5" stroke-linecap="round" opacity="0.65"/>
        <path d="M42 50c2-5 5-5 7 0 2-4 4-4 6 0" stroke="#8A929A" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
      </svg>`,
  },
  96: {
    caption: 'Mineral analyzers',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- rock sample -->
        <path d="M8 44l6-10 10-4 12 6 4 12-8 8H14l-6-12z" fill="#8A929A" stroke="#A8B0B8" stroke-width="1.3"/>
        <path d="M16 42l4-4 6 2M22 48l8 2" stroke="#C9C2BA" stroke-width="1.2" opacity="0.6"/>
        <!-- analyzer body -->
        <rect x="34" y="12" width="22" height="28" rx="3" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.5"/>
        <!-- screen -->
        <rect x="38" y="16" width="14" height="10" rx="1.5" fill="#5a9ec4" opacity="0.85"/>
        <path d="M40 20h10M40 23h6" stroke="#C9C2BA" stroke-width="1" opacity="0.7"/>
        <!-- Cm source nose / snout -->
        <path d="M34 32h-8l-4 6h12V32z" fill="#8A929A" stroke="#C9C2BA" stroke-width="1.2"/>
        <circle cx="24" cy="36" r="3" fill="#F0C24A" opacity="0.8"/>
        <!-- handle -->
        <rect x="40" y="40" width="10" height="14" rx="2" fill="#A8B0B8" stroke="#C9C2BA" stroke-width="1.2"/>
        <!-- beam to rock -->
        <path d="M22 38l-4 4" stroke="#F0C24A" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
        <circle cx="16" cy="44" r="2" fill="#FACAA1" opacity="0.7"/>
      </svg>`,
  },
  97: {
    caption: 'Radioactive waste',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- ground shadow -->
        <ellipse cx="32" cy="56" rx="18" ry="4" fill="#1a3040" opacity="0.35"/>
        <!-- drum body -->
        <path d="M14 18h36v34c0 2-2 4-4 4H18c-2 0-4-2-4-4V18z" fill="#F0C24A" stroke="#c9a03a" stroke-width="1.5"/>
        <!-- top rim -->
        <ellipse cx="32" cy="18" rx="18" ry="6" fill="#FACAA1" stroke="#c9a03a" stroke-width="1.5"/>
        <!-- lid -->
        <ellipse cx="32" cy="16" rx="14" ry="4.5" fill="#F0C24A" stroke="#c9a03a" stroke-width="1.2"/>
        <!-- reinforcing rings -->
        <path d="M14 28h36M14 40h36" stroke="#c9a03a" stroke-width="2.5" opacity="0.85"/>
        <!-- trefoil hazard mark -->
        <circle cx="32" cy="36" r="9" fill="#1a1a1a"/>
        <circle cx="32" cy="36" r="2.2" fill="#F0C24A"/>
        <path d="M32 36l0-6.5M32 36l5.6 3.25M32 36l-5.6 3.25" stroke="#F0C24A" stroke-width="3.2" stroke-linecap="round"/>
        <!-- faint glow -->
        <ellipse cx="32" cy="36" rx="12" ry="10" fill="#9CBB80" opacity="0.2"/>
      </svg>`,
  },
  98: {
    caption: 'Gold prospecting',
    svg: `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <!-- pan bowl -->
        <ellipse cx="32" cy="40" rx="22" ry="12" fill="#8A929A" stroke="#C9C2BA" stroke-width="1.5"/>
        <ellipse cx="32" cy="36" rx="18" ry="9" fill="#5a6a48" stroke="#9CBB80" stroke-width="1.2"/>
        <!-- water / slurry -->
        <ellipse cx="32" cy="34" rx="14" ry="6" fill="#5a9ec4" opacity="0.45"/>
        <!-- gold nuggets -->
        <ellipse cx="26" cy="38" rx="3.5" ry="2.5" fill="#F0C24A" stroke="#c9a03a" stroke-width="1"/>
        <ellipse cx="34" cy="40" rx="2.5" ry="2" fill="#F0C24A" stroke="#c9a03a" stroke-width="1"/>
        <ellipse cx="40" cy="37" rx="2" ry="1.5" fill="#FACAA1" stroke="#c9a03a" stroke-width="0.8"/>
        <!-- Cf neutron probe / scanner -->
        <rect x="44" y="8" width="12" height="22" rx="2" fill="#2A3F54" stroke="#C9C2BA" stroke-width="1.3"/>
        <circle cx="50" cy="16" r="3.5" fill="#F0C24A" opacity="0.85"/>
        <path d="M50 30v6" stroke="#A8B0B8" stroke-width="2" stroke-linecap="round"/>
        <!-- handle of pan -->
        <path d="M10 36c-4 0-6 2-6 5s2 5 6 5" stroke="#C9C2BA" stroke-width="2.5" stroke-linecap="round" fill="none"/>
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

/** Elements with no stable isotopes (all naturally radioactive). */
function isRadioactiveElement(z) {
  return z === 43 || z === 61 || (z >= 84 && z <= 118);
}

/** Classic black-on-yellow trefoil (emoji color varies by platform). */
function radioactiveMarkSvg() {
  return `
    <svg class="sd-el-radioactive-mark" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="#F0C24A"/>
      <g fill="#1a1a1a" transform="translate(8 8)">
        <path d="M0 0L0-7.2A7.2 7.2 0 016.24-3.6Z"/>
        <path d="M0 0L0-7.2A7.2 7.2 0 016.24-3.6Z" transform="rotate(120)"/>
        <path d="M0 0L0-7.2A7.2 7.2 0 016.24-3.6Z" transform="rotate(240)"/>
      </g>
      <circle cx="8" cy="8" r="2.5" fill="#F0C24A"/>
      <circle cx="8" cy="8" r="1.4" fill="#1a1a1a"/>
    </svg>`;
}

function renderElementViz(el) {
  const tile = document.querySelector('.sd-element-viz-tile');
  const art = document.getElementById('sd-el-viz-art');
  const caption = document.getElementById('sd-el-viz-caption');
  const card = document.getElementById('sd-element-card');
  if (!art || !caption) return;

  // No custom scenes for 99–118 — hide the right-hand tile entirely.
  if (el.z >= 99) {
    if (tile) tile.hidden = true;
    if (card) card.classList.add('sd-no-viz');
    art.innerHTML = '';
    caption.textContent = '';
    return;
  }

  if (tile) tile.hidden = false;
  if (card) card.classList.remove('sd-no-viz');

  const viz = ELEMENT_VIZ[el.z];
  art.innerHTML = (viz ? viz.svg : atomFallbackSvg()).trim();
  caption.textContent = viz ? viz.caption : 'Atom';
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

    const category = document.getElementById('sd-el-category');
    if (isRadioactiveElement(el.z)) {
      category.innerHTML = `${el.cat} ${radioactiveMarkSvg()}`;
    } else {
      category.textContent = el.cat;
    }

    const aside = document.getElementById('sd-el-aside');
    if (aside) {
      if (age === 15) {
        aside.hidden = false;
        aside.textContent = 'Slugger really liked this age 😎';
      } else if (age === 43) {
        aside.hidden = false;
        aside.textContent = 'You now come with a warning label. First radioactive element on the table.';
      } else if (age === 71) {
        aside.hidden = false;
        aside.textContent = 'First picture about the name, not the material — Lutetium comes from Lutetia, the old name for Paris.';
      } else if (age >= 99) {
        aside.hidden = false;
        aside.textContent = 'Not found in nature — only made and used in atomic research.';
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
