const express = require('express');
const app = express();
const PORT = 3000;
const spotifyAuth = require('./services/spotifyAuth');
const querystring = require('querystring');
require('dotenv').config();


// Middleware to parse JSON
app.use(express.json());

// Define the route for GET requests
app.get('/', (req, res) => {
    res.send('<h1>Playlist Generator</h1>');
});

var stateKey = 'spotify_auth_state';

// Authoring Playlist Generator to access user's Spotify account
// https://github.com/spotify/web-api-examples/blob/7c4872d343a6f29838c437cf163012947b4bffb9/authorization/authorization_code/app.js#L37-L52
app.get('/login', function(req, res) {
    res.redirect(spotifyAuth.getSpotifyAuthUrl());
});

// Implement /callback endpoint - Redirects users after a successful connection to Spotify.
app.get('/callback', async (req, res) => {
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    const tokenData = await spotifyAuth.getAccessToken(code, state);

    if (tokenData.error) {
        return res.redirect('/#' + querystring.stringify({ error: tokenData.error }));
    }

    res.redirect('/#' + querystring.stringify(tokenData));
});

// Start the server - npx nodemon server.js
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
