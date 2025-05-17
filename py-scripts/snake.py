# 🐍 Snake Game logic for PyScript

# Imports the random module for generating food coordinates
import random
# Imports js module to access JavaScript DOM and canvas context
from js import document, window
# Imports create_proxy to persist Python functions for JavaScript
from pyodide.ffi import create_proxy

"""
Defines the snake as a list of (x, y) coordinates on 20x20 grid (25px per cell)
Starts at grid position (10,10), 3 segments long
"""
snake = [(10, 10), (10, 11), (10, 12)]

# Defines the initial direction of the snake (up, down, left, right)
direction = 'up'

# Initializes the score
score = 0  # Tracks points from eating food

# Initializes game over state
game_over = False  # Tracks if the game has ended

# Global variable to store interval ID
interval_id = None


# Generates random food coordinates, avoiding the snake's body
def place_food():
    while True:
        # Picks random x and y coordinates on a 20x20 grid (0 to 19)
        food = (random.randint(0, 19), random.randint(0, 19))
        # Checks if food is not on the snake
        if food not in snake:
            return food


# Initializes the food position
food = place_food()


# Moves the snake in the current direction
def move_snake():
    global snake, food, score, game_over

    # Skip movement if game is over
    if game_over:
        return

    # Gets the current head position
    head_x, head_y = snake[0]

    # Updates head position based on direction
    if direction == 'up':
        head_y -= 1  # Moves up (decreases y)
    elif direction == 'down':
        head_y += 1  # Moves down (increases y)
    elif direction == 'left':
        head_x -= 1  # Moves left (decreases x)
    elif direction == 'right':
        head_x += 1  # Moves right (increases x)

    # Creates new head
    new_head = (head_x, head_y)

    # Checks for collisions with walls or self
    if (head_x < 0 or head_x > 19 or  # Hits left or right wall
            head_y < 0 or head_y > 19 or  # Hits top or bottom wall
            new_head in snake):           # Hits own body
        game_over = True
        return

    # Checks if the snake eats the food
    if new_head == food:
        # Increases score
        score += 1
        # Spawns new food
        food = place_food()
        # Keeps the tail (grows the snake)
        snake = [new_head] + snake
    else:
        # Moves normally (removes tail, adds new head)
        snake = [new_head] + snake[:-1]


# Handles arrow key presses to change snake direction
def handle_key(event):
    global direction

    # Gets the pressed key
    key = event.key

    # Updates direction if the key is an arrow and doesn't reverse the snake
    if key == 'ArrowUp' and direction != 'down':
        direction = 'up'
    elif key == 'ArrowDown' and direction != 'up':
        direction = 'down'
    elif key == 'ArrowLeft' and direction != 'right':
        direction = 'left'
    elif key == 'ArrowRight' and direction != 'left':
        direction = 'right'


# Renders the game state on the canvas
def render():
    # Accesses the canvas context from JavaScript
    ctx = window.ctx

    # Clears the canvas with a white background
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, 500, 500)

    # Draws the snake as green rectangles
    ctx.fillStyle = 'green'
    for x, y in snake:
        # Converts grid coordinates to pixels (25px per cell)
        ctx.fillRect(x * 25, y * 25, 25, 25)

    # Draws the food as a red rectangle
    ctx.fillStyle = 'red'
    ctx.fillRect(food[0] * 25, food[1] * 25, 25, 25)

    # Updates the score display in the HTML
    document.getElementById('score').innerText = f'Score: {score}'

    # Shows or hides the Game Over message
    game_over_elem = document.getElementById('gameOver')
    game_over_elem.style.display = 'block' if game_over else 'none'


# Updates the game state and renders
def game_loop():
    # Log to confirm game loop is running
    window.console.log('Game loop running')
    if not game_over:
        move_snake()
        render()


# Starts or restarts the game
def start_game(event):
    global snake, direction, score, food, game_over, interval_id

    # Clear any existing interval to prevent multiple loops
    if interval_id is not None:
        window.clearInterval(interval_id)
        interval_id = None

    # Resets game state
    snake = [(10, 10), (10, 11), (10, 12)]
    direction = 'up'
    score = 0
    food = place_food()
    game_over = False

    # Starts the game loop, running every 100ms (10 frames per second)
    game_loop_proxy = create_proxy(game_loop)
    interval_id = window.setInterval(game_loop_proxy, 100)

    # Renders the initial state
    render()


# Adds keydown event listener to the document
document.addEventListener('keydown', create_proxy(handle_key))

# Adds click event listener to the start button
start_button = document.getElementById('start-button')
start_button.addEventListener('click', create_proxy(start_game))


# Renders the initial game state after DOM is loaded
def init(event):
    render()


# Tries DOMContentLoaded event to trigger init
window.addEventListener('DOMContentLoaded', init)

# Manual fallback to call init immediately if DOMContentLoaded fails
init(None)
