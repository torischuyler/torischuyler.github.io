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

// Create the cube (a box shape with color)
const geometry = new THREE.BoxGeometry(2, 2, 2); // Bigger cube: 2x2x2 units
const material = new THREE.MeshBasicMaterial({ color: 0x2F2F2F }); // Dark steel-black
const cube = new THREE.Mesh(geometry, material);
scene.add(cube); // Add the cube to the scene

// Animation loop (makes the cube rotate forever)
function animate() {
    requestAnimationFrame(animate); // Keeps the loop running smoothly
    cube.rotation.x += 0.01; // Rotate a tiny bit on X axis each frame
    cube.rotation.y += 0.01; // Rotate a tiny bit on Y axis each frame
    renderer.render(scene, camera); // Draw the updated scene
}
animate(); // Start the animation

// Make it responsive (resize when window changes, like on mobile)
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
