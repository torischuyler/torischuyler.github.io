// Create the scene (like a 3D world)
const scene = new THREE.Scene();

// Create a camera (like your eyes viewing the scene)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // Move the camera back so we can see the cube

// Create the renderer (draws everything to the screen)
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xF5F5F5); // Soft off-white background
renderer.setSize(window.innerWidth, window.innerHeight); // Make it full-screen
document.body.appendChild(renderer.domElement); // Add the drawing area to the page

const prompt = document.createElement('div');
prompt.id = 'cube-prompt';
prompt.innerHTML = 'The black square speaks: <span style="font-style: italic;">"You know you wanna give me a tap...watch me spin into a cube 😵‍💫 and hear a medieval melody!" 🏰</span>';
document.body.appendChild(prompt);

// Create the cube (a box shape with color)
const geometry = new THREE.BoxGeometry(2, 2, 2); // Bigger cube: 2x2x2 units
const material = new THREE.MeshBasicMaterial({ color: 0x2F2F2F }); // Dark steel-black
const cube = new THREE.Mesh(geometry, material);
scene.add(cube); // Add the cube to the scene

const baseGeometry = new THREE.BoxGeometry(3, 0.3, 3); // Width 3, height 0.3, depth 3
const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 }); // Gray color for the base
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.y = -1.1; // Position it just below the cube
scene.add(base);

let isSpinning = false; // Flag to control if the cube should rotate

let timer = null; // We'll use this later for the timeout

const audio = document.getElementById('cubeMusic');

document.addEventListener('click', () => {
  isSpinning = !isSpinning;
  if (isSpinning && !timer) {
    timer = setTimeout(() => {
      isSpinning = false;
      timer = null;
      audio.pause(); // Pause audio when spin stops
    }, 86000); // Changed to 86 seconds
    audio.play().catch(error => {
      console.error('Audio playback failed:', error);
    });
  } else {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    audio.pause(); // Pause audio when manually stopping spin
  }
});

// Animation loop (makes the cube rotate forever)
function animate() {
  requestAnimationFrame(animate); // Keeps the loop running smoothly
  if (isSpinning) {
      cube.rotation.y += 0.01; // Rotate only if isSpinning is true
  }
  renderer.render(scene, camera); // Draw the updated scene
}
animate(); // Start the animation

// Make it responsive (resize when window changes, like on mobile)
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
