const pythonScriptCreeper = `# creeper.py
from sense_hat import SenseHat
from time import sleep

sense = SenseHat()
sense.low_light = True

g = (0, 50, 0)
b = (0, 0, 0)

# Normal Creeper face (both eyes open)
creeper_normal = [
    g, g, g, g, g, g, g, g,
    g, g, g, g, g, g, g, g,
    g, b, b, g, g, b, b, g,
    g, b, b, g, g, b, b, g,
    g, g, g, b, b, g, g, g,
    g, g, b, b, b, b, g, g,
    g, g, b, b, b, b, g, g,
    g, g, b, g, g, b, g, g 
]

# Winking version (right eye closed)
creeper_wink = [
    g, g, g, g, g, g, g, g,
    g, g, g, g, g, g, g, g,
    g, b, b, g, g, g, g, g,  # right eye closed
    g, b, b, g, g, g, g, g,  # right eye closed
    g, g, g, b, b, g, g, g,
    g, g, b, b, b, b, g, g,
    g, g, b, b, b, b, g, g,
    g, g, b, g, g, b, g, g 
]

sense.set_pixels(creeper_normal)

# Wink loop - runs forever until you stop the script
while True:
    sleep(2)                    # hold open eyes
    sense.set_pixels(creeper_wink)
    sleep(0.3)                  # quick wink
    sense.set_pixels(creeper_normal)
    sleep(0.3)                  # quick reopen (optional double blink effect)
    sleep(3)                    # pause before next wink
`;

const copyBtnCreeper = document.getElementById('copyBtnCreeper');

copyBtnCreeper.addEventListener('click', () => {
    navigator.clipboard.writeText(pythonScriptCreeper).then(() => {
        const originalText = copyBtnCreeper.textContent;
        copyBtnCreeper.textContent = '✅ Copied!';
        setTimeout(() => copyBtnCreeper.textContent = originalText, 2000);
    }).catch(err => {
        console.error('Copy failed', err);
        alert('Failed to copy. Please try again.');
    });
});
