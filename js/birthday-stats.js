/* 🎂 Birthday Stats: Reads a birth date (MMDDYYYY) and reveals stats, starting with the astrological sign. */

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('birthdate-input');
  const submitButton = document.getElementById('birthday-submit');
  const results = document.getElementById('birthday-results');

  // Bail out if the section isn't on this page
  if (!input || !submitButton || !results) return;

  /*
    Astrological sign cutoffs. Each entry is the last day a sign runs through
    within its end month, so a given month + day maps to exactly one sign.
    Capricorn wraps across the new year (Dec 22 – Jan 19), handled below.
  */
  const zodiacSigns = [
    { sign: 'Capricorn ♑', endMonth: 1, endDay: 19 },
    { sign: 'Aquarius ♒', endMonth: 2, endDay: 18 },
    { sign: 'Pisces ♓', endMonth: 3, endDay: 20 },
    { sign: 'Aries ♈', endMonth: 4, endDay: 19 },
    { sign: 'Taurus ♉', endMonth: 5, endDay: 20 },
    { sign: 'Gemini ♊', endMonth: 6, endDay: 20 },
    { sign: 'Cancer ♋', endMonth: 7, endDay: 22 },
    { sign: 'Leo ♌', endMonth: 8, endDay: 22 },
    { sign: 'Virgo ♍', endMonth: 9, endDay: 22 },
    { sign: 'Libra ♎', endMonth: 10, endDay: 22 },
    { sign: 'Scorpio ♏', endMonth: 11, endDay: 21 },
    { sign: 'Sagittarius ♐', endMonth: 12, endDay: 21 },
    { sign: 'Capricorn ♑', endMonth: 12, endDay: 31 }
  ];

  // Returns the astrological sign for a given month (1-12) and day (1-31)
  function getZodiacSign(month, day) {
    const match = zodiacSigns.find(
      ({ endMonth, endDay }) => month < endMonth || (month === endMonth && day <= endDay)
    );
    return match ? match.sign : '';
  }

  // Validates the raw input and returns { month, day, year } or null
  function parseBirthdate(raw) {
    if (!/^\d{8}$/.test(raw)) return null;

    const month = parseInt(raw.slice(0, 2), 10);
    const day = parseInt(raw.slice(2, 4), 10);
    const year = parseInt(raw.slice(4, 8), 10);

    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;

    return { month, day, year };
  }

  // Renders the results (or an error) into the results container
  function showResults() {
    const parsed = parseBirthdate(input.value.trim());

    if (!parsed) {
      results.innerHTML = '<p>Please enter a valid birth date in MMDDYYYY format.</p>';
      return;
    }

    const sign = getZodiacSign(parsed.month, parsed.day);

    results.innerHTML = `
      <ul>
        <li><strong>Astrological Sign:</strong> ${sign}</li>
      </ul>
    `;
  }

  submitButton.addEventListener('click', showResults);

  // Allow Enter key to submit from the text box
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      showResults();
    }
  });
});
