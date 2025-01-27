// fileName : server.js 
// Import the express module
const express = require('express');
const app = express();

// Define the port
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Define the route for GET requests
app.get('/', (req, res) => {
    res.send('<h1>Playlist Generator</h1>');
});

// Implement /callback endpoint - Redirects users after a successful connection to Spotify.
app.get('/callback', (req, res) => {
    res.send('<h1>Spotify connection successful</h1>');
});

// Start the server - npx nodemon server.js
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
