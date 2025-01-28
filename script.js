// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

// Theme toggle functionality
const toggle = document.getElementById('theme-toggle');
toggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';

toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    // Update button icon
    toggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    // Save preference
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});

// Load footer component
async function loadFooter() {
    try {
        const response = await fetch('/components/footer.html');
        const footerHtml = await response.text();
        document.body.insertAdjacentHTML('beforeend', footerHtml);
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', loadFooter); 