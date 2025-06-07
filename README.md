# 3D Solar System

A simple 3D solar system visualization using Node.js and Three.js.

## Tech Stack

*   **Backend:** Node.js, Express
*   **Frontend:** HTML, CSS, JavaScript
*   **3D Rendering:** Three.js

## Getting Started

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/3d-solar-system.git
    cd 3d-solar-system
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the server:
    ```bash
    npm start
    ```

4.  Open your browser and navigate to `http://localhost:8080`.

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