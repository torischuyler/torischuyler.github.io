// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

// Theme toggle functionality
const toggle = document.getElementById('color-theme-toggle');
toggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';

toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    // Update button icon
    toggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    // Save preference
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}); 