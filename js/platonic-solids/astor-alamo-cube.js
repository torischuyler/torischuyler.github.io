// Create the scene (like a 3D world)
const scene = new THREE.Scene();

// Create a camera (like your eyes viewing the scene)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // Move the camera back so we can see the cube
camera.position.y = -1;

// Create the renderer (draws everything to the screen)
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xF5F5F5); // Soft off-white background
renderer.setSize(window.innerWidth, window.innerHeight); // Make it full-screen
document.getElementById('canvas-container').appendChild(renderer.domElement); // Add the drawing area to the page

// Create the cube (a box shape with color)
const geometry = new THREE.BoxGeometry(2, 2, 2); // Bigger cube: 2x2x2 units

// Replace the single material and cube lines with:
const materials = [
  new THREE.MeshBasicMaterial({ color: 0x2F2F2F }), // +x (right)
  new THREE.MeshBasicMaterial({ color: 0x2F2F2F }), // -x (left)
  new THREE.MeshBasicMaterial({ color: 0x2F2F2F }), // +y (top)
  new THREE.MeshBasicMaterial({ color: 0x2F2F2F }), // -y (bottom)
  new THREE.MeshBasicMaterial({ color: 0x2F2F2F }), // +z (front)
  new THREE.MeshBasicMaterial({ color: 0x2F2F2F }), // -z (back)
];
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube); // Add the cube to the scene

const baseGeometry = new THREE.BoxGeometry(3, 0.3, 3); // Width 3, height 0.3, depth 3
const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 }); // Gray color for the base
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.y = -1.1; // Position it just below the cube
scene.add(base);

let isSpinning = false; // Flag to control if the cube should rotate

let timer = null; // We'll use this later for the timeout

const audio = document.getElementById('cubeMusic');

renderer.domElement.addEventListener('click', () => {
  isSpinning = !isSpinning;
  if (isSpinning && !timer) {
    timer = setTimeout(() => {
      isSpinning = false;
      timer = null;
      audio.pause();
    }, 86000);
    audio.play().catch(error => {
      console.error('Audio playback failed:', error);
    });
  } else {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    audio.pause();
  }
});

// Track highlighted face
let highlightedFace = null;

// Function to find the face most facing the camera
function getFrontFace() {
  const cubeWorldMatrix = cube.matrixWorld;
  const faceNormals = [
    new THREE.Vector3(1, 0, 0),  // +x
    new THREE.Vector3(-1, 0, 0), // -x
    new THREE.Vector3(0, 1, 0),  // +y
    new THREE.Vector3(0, -1, 0), // -y
    new THREE.Vector3(0, 0, 1),  // +z
    new THREE.Vector3(0, 0, -1)  // -z
  ];
  const cameraDirection = camera.getWorldDirection(new THREE.Vector3()).negate();
  let maxDot = -1;
  let frontFaceIndex = 0;
  faceNormals.forEach((normal, index) => {
    const worldNormal = normal.clone().applyMatrix4(cubeWorldMatrix).normalize();
    const dot = cameraDirection.dot(worldNormal);
    if (dot > maxDot) {
      maxDot = dot;
      frontFaceIndex = index;
    }
  });
  return frontFaceIndex;
}

// Add click event to "Face Shape: Square" in stats card
const faceShapeElement = document.querySelector('.stats-card dd:nth-child(4)'); // Targets "Square"
faceShapeElement.style.cursor = 'pointer'; // Visual feedback
faceShapeElement.addEventListener('click', () => {
  if (highlightedFace === null) {
    // Highlight the front-most face
    highlightedFace = getFrontFace();
    materials[highlightedFace].color.setHex(0x8A9A5B); // Stats card color
  } else {
    // Revert highlight
    materials[highlightedFace].color.setHex(0x2F2F2F); // Back to dark steel-black
    highlightedFace = null;
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
