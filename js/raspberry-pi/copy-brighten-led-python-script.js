const pythonScript = `# brighten_led.py
import machine
import time

potentiometer = machine.ADC(26)
led = machine.PWM(machine.Pin(15))
led.freq(1000)

while True:
    led.duty_u16(potentiometer.read_u16())
    time.sleep(0.1)
`;

function copyBrightenLedScript() {
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

document.getElementById('copyBtn').addEventListener('click', copyBrightenLedScript);
