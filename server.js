const express = require('express');
const path = require('path');

const app = express();
const port = 3001;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve Three.js from node_modules
app.use('/scripts/three', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/scripts/three/examples', express.static(path.join(__dirname, 'node_modules/three/examples')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
}); 