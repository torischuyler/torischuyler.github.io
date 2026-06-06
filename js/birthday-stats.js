/* 🎂 Birthday Stats: Reads a birth date (MMDDYYYY) and reveals stats like the astrological sign and Chinese zodiac. */

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

  /*
    Chinese zodiac animals run on a 12-year cycle. Using (year - 4) anchors the
    cycle so 1924, 1936, ... map to the Rat at index 0.
  */
  const chineseAnimals = [
    'Rat 🐀', 'Ox 🐂', 'Tiger 🐅', 'Rabbit 🐇', 'Dragon 🐉', 'Snake 🐍',
    'Horse 🐎', 'Goat 🐐', 'Monkey 🐒', 'Rooster 🐓', 'Dog 🐕', 'Pig 🐖'
  ];

  /*
    Chinese five elements cycle every 10 years, paired by the year's last digit:
    0/1 Metal, 2/3 Water, 4/5 Wood, 6/7 Fire, 8/9 Earth.
  */
  const chineseElements = [
    'Metal ⚙️', 'Water 💧', 'Wood 🌳', 'Fire 🔥', 'Earth ⛰️'
  ];

  /*
    Lunar New Year start dates (Gregorian), stored as MMDD numbers so they can be
    compared directly against a birth date's month * 100 + day. The Chinese zodiac
    year only flips on the lunar new year, so anyone born before that date belongs
    to the previous year's animal and element. Covers 1900–2050.
  */
  const lunarNewYears = {
    1900: 131, 1901: 219, 1902: 208, 1903: 129, 1904: 216, 1905: 204, 1906: 125, 1907: 213, 1908: 202, 1909: 122,
    1910: 210, 1911: 130, 1912: 218, 1913: 206, 1914: 126, 1915: 214, 1916: 203, 1917: 123, 1918: 211, 1919: 201,
    1920: 220, 1921: 208, 1922: 128, 1923: 216, 1924: 205, 1925: 125, 1926: 213, 1927: 202, 1928: 123, 1929: 210,
    1930: 130, 1931: 217, 1932: 206, 1933: 126, 1934: 214, 1935: 204, 1936: 124, 1937: 211, 1938: 131, 1939: 219,
    1940: 208, 1941: 127, 1942: 215, 1943: 205, 1944: 125, 1945: 213, 1946: 202, 1947: 122, 1948: 210, 1949: 129,
    1950: 217, 1951: 206, 1952: 127, 1953: 214, 1954: 203, 1955: 124, 1956: 212, 1957: 131, 1958: 218, 1959: 208,
    1960: 128, 1961: 215, 1962: 205, 1963: 125, 1964: 213, 1965: 202, 1966: 121, 1967: 209, 1968: 130, 1969: 217,
    1970: 206, 1971: 127, 1972: 215, 1973: 203, 1974: 123, 1975: 211, 1976: 131, 1977: 218, 1978: 207, 1979: 128,
    1980: 216, 1981: 205, 1982: 125, 1983: 213, 1984: 202, 1985: 220, 1986: 209, 1987: 129, 1988: 217, 1989: 206,
    1990: 127, 1991: 215, 1992: 204, 1993: 123, 1994: 210, 1995: 131, 1996: 219, 1997: 207, 1998: 128, 1999: 216,
    2000: 205, 2001: 124, 2002: 212, 2003: 201, 2004: 122, 2005: 209, 2006: 129, 2007: 218, 2008: 207, 2009: 126,
    2010: 214, 2011: 203, 2012: 123, 2013: 210, 2014: 131, 2015: 219, 2016: 208, 2017: 128, 2018: 216, 2019: 205,
    2020: 125, 2021: 212, 2022: 201, 2023: 122, 2024: 210, 2025: 129, 2026: 217, 2027: 206, 2028: 126, 2029: 213,
    2030: 203, 2031: 123, 2032: 211, 2033: 131, 2034: 219, 2035: 208, 2036: 128, 2037: 215, 2038: 204, 2039: 124,
    2040: 212, 2041: 201, 2042: 122, 2043: 210, 2044: 130, 2045: 217, 2046: 206, 2047: 126, 2048: 214, 2049: 202,
    2050: 123
  };

  // Returns the Chinese zodiac "Element Animal" for a given birth date.
  // Births before that year's lunar new year roll back to the previous zodiac year.
  function getChineseZodiac(month, day, year) {
    const lunarNewYear = lunarNewYears[year];
    let zodiacYear = year;

    if (lunarNewYear && (month * 100 + day) < lunarNewYear) {
      zodiacYear = year - 1;
    }

    const animal = chineseAnimals[((zodiacYear - 4) % 12 + 12) % 12];
    const element = chineseElements[Math.floor((zodiacYear % 10) / 2)];
    return `${element} ${animal}`;
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
    const chineseZodiac = getChineseZodiac(parsed.month, parsed.day, parsed.year);

    results.innerHTML = `
      <ul>
        <li><strong>Astrological Sign:</strong> ${sign}</li>
        <li><strong>Chinese Zodiac:</strong> ${chineseZodiac}</li>
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
