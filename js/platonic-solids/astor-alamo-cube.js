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

// Track highlighted edge
let highlightedEdge = null;

// Create edge materials for highlighting
const edgeVertices = [
  // Bottom edges
  [[1, -1, 1], [-1, -1, 1]],   // 0: bottom front
  [[1, -1, -1], [1, -1, 1]],   // 1: bottom right
  [[-1, -1, -1], [1, -1, -1]], // 2: bottom back
  [[-1, -1, 1], [-1, -1, -1]], // 3: bottom left
  // Top edges
  [[1, 1, 1], [-1, 1, 1]],     // 4: top front
  [[1, 1, -1], [1, 1, 1]],     // 5: top right
  [[-1, 1, -1], [1, 1, -1]],   // 6: top back
  [[-1, 1, 1], [-1, 1, -1]],   // 7: top left
  // Vertical edges
  [[1, -1, 1], [1, 1, 1]],     // 8: front right
  [[1, -1, -1], [1, 1, -1]],   // 9: back right
  [[-1, -1, -1], [-1, 1, -1]], // 10: back left
  [[-1, -1, 1], [-1, 1, 1]]    // 11: front left
];
const edgeMaterials = [];
const edgeLines = [];
edgeVertices.forEach(vertices => {
  const material = new THREE.LineBasicMaterial({ color: 0xFF0000, linewidth: 10 });
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(...vertices[0]),
    new THREE.Vector3(...vertices[1])
  ]);
  const line = new THREE.Line(geometry, material);
  scene.add(line);
  edgeMaterials.push(material);
  edgeLines.push(line);
});

// Function to find the front-most edge
function getFrontEdge() {
  const frontFace = getFrontFace();
  let topEdgeIndex;
  switch (frontFace) {
    case 4: // +z front
      topEdgeIndex = 4; // top front
      break;
    case 0: // +x right
      topEdgeIndex = 5; // top right
      break;
    case 5: // -z back
      topEdgeIndex = 6; // top back
      break;
    case 1: // -x left
      topEdgeIndex = 7; // top left
      break;
    case 2: // +y top
      topEdgeIndex = 4; // Default to top front
      break;
    case 3: // -y bottom
      topEdgeIndex = 4; // Default to top front
      break;
    default:
      topEdgeIndex = 4; // Default to top front
  }
  return topEdgeIndex;
}

// Add click event to "Edge Type: Line" in stats card
const edgeTypeElement = document.querySelector('.stats-card dd:nth-child(8)');
edgeTypeElement.style.cursor = 'pointer';
edgeTypeElement.addEventListener('click', () => {
  if (highlightedEdge === null) {
    highlightedEdge = getFrontEdge();
    edgeMaterials[highlightedEdge].color.setHex(0x00FF00); // Bright green
  } else {
    edgeMaterials[highlightedEdge].color.setHex(0xFF0000); // Revert to red
    highlightedEdge = null;
  }
});

// Animation loop (makes the cube rotate forever)
function animate() {
  requestAnimationFrame(animate); // Keeps the loop running smoothly
  if (isSpinning) {
      cube.rotation.y += 0.01; // Rotate only if isSpinning is true
  }
  edgeLines.forEach(line => { line.rotation.copy(cube.rotation); }); // Sync edges with cube rotation
  renderer.render(scene, camera); // Draw the updated scene
}
animate(); // Start the animation

// Make it responsive (resize when window changes, like on mobile)
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
