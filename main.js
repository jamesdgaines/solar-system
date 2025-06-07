import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 35;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 0.9);
scene.add(pointLight);

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Sun
const sunTexture = textureLoader.load('textures/sun.jpg');
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), sunMaterial);
scene.add(sun);

// Planet Data
const planets = [
    { name: 'Mercury', size: 0.2, texture: 'textures/mercury.jpg', distance: 4, speed: 0.004 },
    { name: 'Venus', size: 0.4, texture: 'textures/venus.jpg', distance: 7, speed: 0.002 },
    { name: 'Earth', size: 0.5, texture: 'textures/earth.jpg', distance: 10, speed: 0.001, hasMoon: true },
    { name: 'Mars', size: 0.3, texture: 'textures/mars.jpg', distance: 14, speed: 0.0008 },
    { name: 'Jupiter', size: 1.5, texture: 'textures/jupiter.jpg', distance: 20, speed: 0.0004 },
    { name: 'Saturn', size: 1.2, texture: 'textures/saturn.jpg', distance: 28, speed: 0.0002, hasRings: true },
    { name: 'Uranus', size: 0.8, texture: 'textures/uranus.jpg', distance: 35, speed: 0.0001 },
    { name: 'Neptune', size: 0.7, texture: 'textures/neptune.jpg', distance: 40, speed: 0.00005 },
];

const planetMeshes = [];

planets.forEach(planetData => {
    const texture = textureLoader.load(planetData.texture);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const planet = new THREE.Mesh(new THREE.SphereGeometry(planetData.size, 32, 32), material);
    planet.userData = planetData;
    scene.add(planet);
    planetMeshes.push(planet);

    if (planetData.hasRings) {
        const ringTexture = textureLoader.load('textures/saturn_ring.png');
        const ringGeometry = new THREE.RingGeometry(planetData.size + 0.3, planetData.size + 1.5, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({ map: ringTexture, side: THREE.DoubleSide, transparent: true });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        planet.add(ring);
    }
    
    if (planetData.hasMoon) {
        const moonTexture = textureLoader.load('textures/moon.jpg');
        const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
        const moon = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), moonMaterial);
        moon.userData = { isMoon: true, speed: 0.01 }; // Moon-specific data
        planet.add(moon);
    }
});

// Starfield
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
const starVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    if (x*x + y*y + z*z < 100*100) continue; // avoid stars inside a certain radius from sun
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starfield = new THREE.Points(starGeometry, starMaterial);
scene.add(starfield);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    const time = Date.now();

    // Update controls
    controls.update();

    planetMeshes.forEach(planet => {
        const planetData = planet.userData;
        planet.position.x = Math.sin(time * planetData.speed) * planetData.distance;
        planet.position.z = Math.cos(time * planetData.speed) * planetData.distance;

        // Check for and animate moons
        planet.children.forEach(child => {
            if (child.userData.isMoon) {
                child.position.x = Math.sin(time * child.userData.speed) * (planetData.size + 1);
                child.position.z = Math.cos(time * child.userData.speed) * (planetData.size + 1);
            }
        });
    });

    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}); 