// fileName : server.js 
// Import the express module
const express = require('express');
const app = express();
const spotify_url = 'https://api.spotify.com/v1';
require('dotenv').config();

var querystring = require('querystring');
var crypto = require('crypto');
var request = require('request');

// Define the port
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Define the route for GET requests
app.get('/', (req, res) => {
    res.send('<h1>Playlist Generator</h1>');
});

// Code snippet: https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const generateRandomString = (length) => {
    return crypto
    .randomBytes(60)
    .toString('hex')
    .slice(0, length);
}

var stateKey = 'spotify_auth_state';

// Authoring Playlist Generator to access user's Spotify account
// https://github.com/spotify/web-api-examples/blob/7c4872d343a6f29838c437cf163012947b4bffb9/authorization/authorization_code/app.js#L37-L52
app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    // your application requests authorization
    var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: 'http://localhost:3000/callback',
        state: state
    }));
});

// Implement /callback endpoint - Redirects users after a successful connection to Spotify.
app.get('/callback', (req, res) => {
    var code = req.query.code || null;
    var state = req.query.state || null;
    // var storedState = req.cookies ? req.cookies[stateKey] : null;

    // if (state === null || state !== storedState) {
    if (state === null) {
        res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: 'http://localhost:3000/callback',
                grant_type: 'authorization_code'
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
      
                var access_token = body.access_token,
                    refresh_token = body.refresh_token;
        
                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };
      
                // use the access token to access the Spotify Web API
                request.get(options, function(error, response, body) {
                    console.log(body);
                });
      
                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
            }
        });
    }
});


// Start the server - npx nodemon server.js
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
