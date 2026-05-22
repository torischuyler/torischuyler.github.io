const pythonScript = `# sense_hat.py
from sense_hat import SenseHat
sense = SenseHat()

gold = (255, 215, 0) 
purple = (128, 0, 128)
red = (255, 0, 0)

sense.show_message("Hi Universe", text_colour=(gold), 
back_colour=(purple), scroll_speed=(0.18))

sense.show_letter("T", text_colour=(red))
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
