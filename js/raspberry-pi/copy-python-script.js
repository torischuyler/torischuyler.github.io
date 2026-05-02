const pythonScript = `# pi_traffic_light_simulator.py
from gpiozero import Button, LED, Buzzer
from time import sleep, time

# Setup
button = Button(18, pull_up=True)
red = LED(25)
yellow = LED(8)
green = LED(7)
buzzer = Buzzer(17)

print("Starting in RED state (stays on until button pressed)")
print("Press button 18 to trigger sequence:")
print(" → Yellow + Slow beep (3s)")
print(" → Green + Normal beep (8s)")
print(" → Yellow + Fast beep (3s)")
print(" → back to RED")
print("(Ctrl+C to quit)")

# Initial state
red.on()
yellow.off()
green.off()
buzzer.off()

def slow_beep_pattern(duration):
    end = time() + duration
    while time() < end:
        buzzer.on()
        sleep(0.4)
        buzzer.off()
        sleep(0.6)

def normal_beep_pattern(duration):
    end = time() + duration
    while time() < end:
        buzzer.on()
        sleep(0.2)
        buzzer.off()
        sleep(0.3)

def fast_beep_pattern(duration):
    end = time() + duration
    while time() < end:
        buzzer.on()
        sleep(0.1)
        buzzer.off()
        sleep(0.1)

def trigger_sequence():
    print("Button pressed! Starting sequence...")
    red.off()
    yellow.on()
    green.off()
    print("Yellow ON + Slow beep (3s)")
    slow_beep_pattern(3)
    
    yellow.off()
    green.on()
    print("Green ON + Normal beep (8s)")
    normal_beep_pattern(8)
    
    green.off()
    yellow.on()
    print("Yellow ON + Fast beep (3s)")
    fast_beep_pattern(3)
    
    yellow.off()
    green.off()
    red.on()
    buzzer.off()
    print("Back to RED (ready for next press)")

button.when_pressed = trigger_sequence

try:
    while True:
        sleep(0.1)
except KeyboardInterrupt:
    print("\\nQuitting... Turning all LEDs and buzzer off.")
    red.off()
    yellow.off()
    green.off()
    buzzer.off()
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
