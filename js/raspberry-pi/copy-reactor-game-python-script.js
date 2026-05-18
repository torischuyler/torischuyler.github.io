const pythonScript = `# reaction_game.py
from gpiozero import LED, Button
from time import sleep
from random import uniform
import sys

# Get player names
blue_player = input("Blue team player name is: ")
orange_player = input("Orange team player name is: ")

led = LED(4)
button_blue = Button(18)
button_orange = Button(14)

# Scores live only in local variables — gone when the script exits
blue_wins = 0
orange_wins = 0

print("\n=== Best of 3 Reaction Game ===")
print(f"  {blue_player} (Blue) vs {orange_player} (Orange)\n")

for round_number in range(1, 4):
    # Stop early if someone already clinched best of 3
    if blue_wins >= 2 or orange_wins >= 2:
        break

    print(f"--- Round {round_number} ---")

    if round_number == 3:
        print("It all comes down to this!")
        sleep(2.5)

    print("Get ready... press your button when the light turns on!")
    sleep(1.5)

    sleep(uniform(3, 8))

    print("GO!")
    led.on()

    # Wait for first button press
    while not button_blue.is_pressed and not button_orange.is_pressed:
        sleep(0.01)

    # Determine winner before releasing
    if button_blue.is_pressed:
        blue_wins += 1
        winner = blue_player
    else:
        orange_wins += 1
        winner = orange_player

    led.off()

    print(f"{winner} wins round {round_number}! | Score: {blue_player} {blue_wins} - {orange_wins} {orange_player}")

    # Wait for button release before next round
    while button_blue.is_pressed or button_orange.is_pressed:
        sleep(0.01)

    sleep(2)

# Final result
print("\n" + "=" * 40)
if blue_wins > orange_wins:
    print(f"{blue_player} is victorious! Veni, Vidi, Vici!")
else:
    print(f"{orange_player} is victorious! Veni, Vidi, Vici!")
print("=" * 40)
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
