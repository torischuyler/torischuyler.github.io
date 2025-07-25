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
prompt.innerHTML = 'The black square speaks: <span style="font-style: italic;">"You know you wanna give me a tap...watch me spin into a cube!"</span> 😵‍💫';
document.body.appendChild(prompt);

// Create the cube (a box shape with color)
const geometry = new THREE.BoxGeometry(2, 2, 2); // Bigger cube: 2x2x2 units
const material = new THREE.MeshBasicMaterial({ color: 0x2F2F2F }); // Dark steel-black
const cube = new THREE.Mesh(geometry, material);
scene.add(cube); // Add the cube to the scene
let isSpinning = false; // Flag to control if the cube should rotate

document.addEventListener('click', () => {
  isSpinning = true; // Start spinning on click or tap
});

// Animation loop (makes the cube rotate forever)
function animate() {
  requestAnimationFrame(animate); // Keeps the loop running smoothly
  if (isSpinning) {
      cube.rotation.x += 0.01; // Rotate only if isSpinning is true
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
