import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 3, 0, 0);
scene.add(pointLight);
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Helper function to create planets
function createPlanet(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    
    if(ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.rotation.x = -0.5 * Math.PI;
    }

    mesh.position.x = position;
    scene.add(obj);
    return {mesh, obj};
}


// Sun
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load('textures/sun.jpg')
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Create Planets
const mercury = createPlanet(3.2, 'textures/mercury.jpg', 28);
const venus = createPlanet(5.8, 'textures/venus.jpg', 44);
const earth = createPlanet(6, 'textures/earth.jpg', 62);
const mars = createPlanet(4, 'textures/mars.jpg', 78);
const jupiter = createPlanet(12, 'textures/jupiter.jpg', 100);
const saturn = createPlanet(10, 'textures/saturn.jpg', 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: 'textures/saturn_ring.png'
});
const uranus = createPlanet(7, 'textures/uranus.jpg', 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: 'textures/uranus_ring.png'
});
const neptune = createPlanet(7, 'textures/neptune.jpg', 200);


camera.position.z = 250;

// Starfield
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff
});

const starVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Animation
function animate() {
    requestAnimationFrame(animate);

    // Planet Rotations
    sun.rotateY(0.004);
    mercury.mesh.rotateY(0.004);
    venus.mesh.rotateY(0.002);
    earth.mesh.rotateY(0.02);
    mars.mesh.rotateY(0.018);
    jupiter.mesh.rotateY(0.04);
    saturn.mesh.rotateY(0.038);
    uranus.mesh.rotateY(0.03);
    neptune.mesh.rotateY(0.032);

    // Planet Orbits
    mercury.obj.rotateY(0.04);
    venus.obj.rotateY(0.015);
    earth.obj.rotateY(0.01);
    mars.obj.rotateY(0.008);
    jupiter.obj.rotateY(0.002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptune.obj.rotateY(0.0001);


    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}); 