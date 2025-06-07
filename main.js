import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 35;

// WebGL Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// CSS2D Renderer for labels
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

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
    { name: 'Mercury', size: 0.2, texture: 'textures/mercury.jpg', distance: 4, speed: 0.0004 },
    { name: 'Venus', size: 0.4, texture: 'textures/venus.jpg', distance: 7, speed: 0.0002 },
    { name: 'Earth', size: 0.5, texture: 'textures/earth.jpg', distance: 10, speed: 0.0001, hasMoon: true },
    { name: 'Mars', size: 0.3, texture: 'textures/mars.jpg', distance: 14, speed: 0.00008 },
    { name: 'Jupiter', size: 1.5, texture: 'textures/jupiter.jpg', distance: 20, speed: 0.00004 },
    { name: 'Saturn', size: 1.2, texture: 'textures/saturn.jpg', distance: 28, speed: 0.00002, hasRings: true },
    { name: 'Uranus', size: 0.8, texture: 'textures/uranus.jpg', distance: 35, speed: 0.00001 },
    { name: 'Neptune', size: 0.7, texture: 'textures/neptune.jpg', distance: 40, speed: 0.000005 },
];

const planetMeshes = [];

planets.forEach(planetData => {
    const texture = textureLoader.load(planetData.texture);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const planet = new THREE.Mesh(new THREE.SphereGeometry(planetData.size, 32, 32), material);
    planet.userData = planetData;
    scene.add(planet);
    planetMeshes.push(planet);

    // Create orbit path
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
        new THREE.Path().absarc(0, 0, planetData.distance, 0, 2 * Math.PI).getSpacedPoints(200)
    );
    const orbitMaterial = new THREE.LineDashedMaterial({
        color: 0xffffff,
        dashSize: 0.5,
        gapSize: 0.25,
        transparent: true,
        opacity: 0.4
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitLine.computeLineDistances();
    orbitLine.rotation.x = Math.PI / 2;
    scene.add(orbitLine);

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
        moon.userData = { isMoon: true, speed: 0.005, name: 'Moon' }; // Moon-specific data
        planet.add(moon);
    }

    // Create label
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = planetData.name;
    const planetLabel = new CSS2DObject(labelDiv);
    planetLabel.position.set(0, planetData.size + 0.5, 0);
    planet.add(planetLabel);
});

// Raycaster for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoPanel = document.getElementById('info-panel');
const planetName = document.getElementById('planet-name');
const planetSize = document.getElementById('planet-size');
const planetDistance = document.getElementById('planet-distance');

function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const userData = clickedObject.userData;

        if (userData.name) { // Check if it's a planet or moon with data
            planetName.textContent = userData.name;
            planetSize.textContent = userData.size || 'N/A';
            planetDistance.textContent = userData.distance || 'N/A';
            infoPanel.classList.remove('hidden');
        } else {
            infoPanel.classList.add('hidden');
        }
    } else {
        infoPanel.classList.add('hidden');
    }
}

window.addEventListener('click', onMouseClick);

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
                child.position.x = Math.sin(time * child.userData.speed) * (planetData.size + 1.5);
                child.position.z = Math.cos(time * child.userData.speed) * (planetData.size + 1.5);
            }
        });
    });

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
}); 