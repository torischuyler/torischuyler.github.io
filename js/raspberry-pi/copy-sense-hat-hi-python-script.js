const pythonScript = `# sense_hat_hi.py
from sense_hat import SenseHat
sense = SenseHat()
sense.low_light = True

red = (255, 0, 0)
green = (0, 255, 0)
blue = (0, 0, 255)

sense.show_message("Hi Universe!", text_colour=(red), scroll_speed=(0.18))
sense.show_message(":D", text_colour=(green), scroll_speed=(0.18))
sense.show_letter("T", text_colour=(blue))
`;

function copyTrafficScript() {
    navigator.clipboard.writeText(pythonScript).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => btn.textContent = originalText, 2000);
    }).catch(err => {
        console.error('Copy failed', err);
        alert('Failed to copy. Please try again.');
    });
}

document.getElementById('copyBtn').addEventListener('click', copyTrafficScript);
