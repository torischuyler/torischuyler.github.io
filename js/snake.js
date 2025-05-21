/* 🐍 Snake Game */

// Runs when the DOM is fully loaded to ensure canvas is available
window.addEventListener('load', () => {
	// Gets the canvas element by its ID
	const canvas = document.getElementById('game-canvas');

	// Gets the 2D rendering context for drawing on the canvas
	const ctx = canvas.getContext('2d');

	// Exposes the canvas context to PyScript for Python access
	window.ctx = ctx;

	// Sets canvas dimensions to match HTML attributes (500x500 pixels)
	canvas.width = 500;
	canvas.height = 500;
});
