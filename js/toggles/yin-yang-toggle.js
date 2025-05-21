/*
  Yin Yang toggle: A light/dark mode switch with ☯️ for both modes.
  Saves theme preference in localStorage for future visits.
*/

// Utility to handle localStorage operations
function accessStorage(operation, key, value = null) {
  if (!window.localStorage) return null;
  try {
    return operation === 'get' ? localStorage.getItem(key) : localStorage.setItem(key, value);
  } catch (e) {
    console.error(`Failed to ${operation} theme in localStorage:`, e);
    return null;
  }
}

// Initialize Yin-Yang theme toggle
function initializeYinYangToggle() {
  // Retrieve saved theme and apply if 'light'
  const savedTheme = accessStorage('get', 'theme');
  if (savedTheme) {
    document.body.classList.toggle('light-theme', savedTheme === 'light');
  }

  // Get toggle button
  const toggle = document.getElementById('yin-yang-toggle');
  if (!toggle) {
    console.error('Yin-Yang toggle button not found.');
    return;
  }

  // Update toggle UI based on theme
  function updateThemeUI(currentTheme) {
    toggle.textContent = '☯️';
    toggle.setAttribute('aria-label', `Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`);
  }

  // Set initial UI using saved theme or default to 'dark'
  updateThemeUI(savedTheme || 'dark');

  // Toggle theme on click
  toggle.addEventListener('click', () => {
    const currentTheme = document.body.classList.toggle('light-theme') ? 'light' : 'dark';
    updateThemeUI(currentTheme);
    accessStorage('set', 'theme', currentTheme);
  });
}

initializeYinYangToggle();
