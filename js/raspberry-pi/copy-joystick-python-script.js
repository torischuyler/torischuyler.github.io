const pythonScript = `# joystick.py
from sense_hat import SenseHat
sense = SenseHat()
sense.clear()

def red():
    sense.clear(255, 0, 0)

def blue():
    sense.clear(0, 0, 255)

def orange():
    sense.clear(255, 128, 0)

def violet():
    sense.clear(128, 0, 128)

sense.stick.direction_up = red
sense.stick.direction_down = blue
sense.stick.direction_left = orange
sense.stick.direction_right = violet
sense.stick.direction_middle = sense.clear

while True:
    pass
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

