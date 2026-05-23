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

const copyBtn = document.getElementById('copyBtnHi');

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(pythonScript).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = originalText, 2000);
    }).catch(err => {
        console.error('Copy failed', err);
        alert('Failed to copy. Please try again.');
    });
});
