// Function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Get today's date in MM/DD/YYYY format
const today = new Date();
const formattedDate = today.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
});

// Fetch cumulative digit data and update the display
fetch('../../../assets/digitize-phi/cumulative_digit_counts.json')
    .then(response => response.json())
    .then(data => {
        const formattedCount = formatNumber(data.total_digits);
        document.getElementById('cumulative-digits').textContent =
            `Cumulative Phi Digits as of ${formattedDate}: ${formattedCount}`;
    })
    .catch(error => {
        console.error('Error loading cumulative digit data:', error);
        document.getElementById('cumulative-digits').textContent =
            `Cumulative Phi Digits as of ${formattedDate}: Error loading data`;
    });
