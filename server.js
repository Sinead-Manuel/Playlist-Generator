const express = require('express');
const app = express();
const PORT = 3000;
const spotifyAuth = require('./services/spotifyAuth');
const playlistGenerator = require('./routes/playlist');
// const querystring = require('querystring');
require('dotenv').config();

let code = null;
let state = null;

// Middleware to parse JSON
app.use(express.json());

// Define the route for GET requests
app.get('/', (req, res) => {
    res.send('<h1>Playlist Generator</h1>');
});

let stateKey = 'spotify_auth_state';
let access_token = '';

// Authoring Playlist Generator to access user's Spotify account
// https://github.com/spotify/web-api-examples/blob/7c4872d343a6f29838c437cf163012947b4bffb9/authorization/authorization_code/app.js#L37-L52
app.get('/login', function(req, res) {
    res.redirect(spotifyAuth.getSpotifyAuthUrl());
});

// Implement /callback endpoint - Redirects users after a successful connection to Spotify.
app.get('/callback', async (req, res) => {
    code = req.query.code || null;
    state = req.query.code || null;

    // var storedState = req.cookies ? req.cookies[stateKey] : null;

    // Retrieves access token
    const tokenData = await spotifyAuth.getAccessToken(code, state);

    if (tokenData.error) {
        // return res.redirect('/login' + querystring.stringify({ error: tokenData.error }));
        return res.redirect('/');
    }

    // res.redirect('/vibe#' + querystring.stringify(tokenData));
    res.redirect('/playlist');
    access_token = tokenData.access_token;
});

// Generates playlist
app.get('/playlist', async (req, res) => {
    res.send("<h1>Vibes, Genre, Generate Playlist</h1>")

    // Select vibe keyword

    // Select genre keyword

    // Generate playlist based on keywords
    const playlist = await playlistGenerator.createPlaylist(access_token);
});

// Start the server - npx nodemon server.js
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
