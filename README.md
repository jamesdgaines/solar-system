# 3D Solar System with Node.js Backend

A 3D solar system visualization served by a Node.js and Express backend.

## Tech Stack

*   **Frontend**:
    *   HTML, CSS, JavaScript
    *   Three.js for 3D graphics
*   **Backend**:
    *   Node.js
    *   Express.js for serving files

## Milestones

### Milestone 1: Basic Scene with Sun and Earth
*   **Goal**: Set up the Node.js server and render a basic 3D scene.
*   **Tasks**:
    1.  Initialize a Node.js project (`package.json`).
    2.  Set up an Express server to serve an `index.html` file and static assets (JS, CSS).
    3.  Create a basic Three.js scene with a camera, renderer, and a single light source.
    4.  Add two untextured spheres: a large one for the Sun and a smaller one for Earth.
    5.  Animate the Earth to orbit the Sun.

### Milestone 2: Full Solar System with Textures & Starfield
*   **Goal**: Complete the solar system with all planets, textures, and a background.
*   **Tasks**:
    1.  Add spheres for all 8 planets.
    2.  Source and apply realistic textures to the Sun and all planets.
    3.  Create a starfield background using a particle system.
    4.  Animate all planets to orbit the Sun at different speeds.
    5.  Add Saturn's rings.

### Milestone 3: Interactivity and Polish
*   **Goal**: Add user controls and refine the experience.
*   **Tasks**:
    1.  Implement Three.js's `OrbitControls` to allow camera zooming and panning.
    2.  Ensure the scene is responsive and resizes with the browser window.
    3.  (Optional) Add labels for the planets.
    4.  (Optional) Add an information panel that displays data when a planet is clicked.

## How to Run
1.  Install dependencies: `npm install`
2.  Start the server: `npm start`
3.  Open `http://localhost:3000` in your browser. 