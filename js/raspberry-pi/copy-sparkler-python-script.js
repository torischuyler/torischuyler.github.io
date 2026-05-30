const pythonScriptSparkler = `# sparkler.py
from sense_hat import SenseHat
import random
import time

sense = SenseHat()
sense.clear()

print("Full-screen Sparkler running on Sense HAT!")
print("Every half a second the entire 8x8 grid will change colors.")
print("Press Ctrl+C to stop.")

try:
    while True:
        # Create a new set of random colors for all 64 pixels
        pixels = []
        for _ in range(64):
            color = random.randint(0, 16777215)
            r = (color >> 16) & 255
            g = (color >> 8) & 255
            b = color & 255
            pixels.append((r, g, b))
        
        # Update the entire display at once
        sense.set_pixels(pixels)
        
        # Hold the pattern for half a second
        time.sleep(.05)

except KeyboardInterrupt:
    sense.clear()
    print("\nSparkler stopped and display cleared.")
`;

const copyBtnSparkler = document.getElementById('copyBtnSparkler');

copyBtnSparkler.addEventListener('click', () => {
    navigator.clipboard.writeText(pythonScriptSparkler).then(() => {
        const originalText = copyBtnSparkler.textContent;
        copyBtnSparkler.textContent = '✅ Copied!';
        setTimeout(() => copyBtnSparkler.textContent = originalText, 2000);
    }).catch(err => {
        console.error('Copy failed', err);
        alert('Failed to copy. Please try again.');
    });
});
