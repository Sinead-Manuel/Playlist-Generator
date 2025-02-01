const crypto = require('crypto');
const querystring = require('querystring');

require('dotenv').config();

// Code snippet: https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const generateRandomString = (length) => {
    return crypto
    .randomBytes(60)
    .toString('hex')
    .slice(0, length);
}

// Requests Spotify authorization
exports.getSpotifyAuthUrl = () => {
    var state = generateRandomString(16);

    const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';

    return 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: 'http://localhost:3000/callback',
        state: state
    });
};

// Fetches access token from Spotify
exports.getAccessToken = async (code, state) => {
    if (!code) {
        return { error: 'state_mismatch' };
    }

    try{
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
            },
            body: querystring.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'http://localhost:3000/callback'
            })
        });

        if (!response.ok) {
            return { error: 'invalid_token' };
        }

        const data = await response.json();

        return {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
        };
    } catch (error) {
        console.error('Error fetching access token:', error);
        return { error: 'server_error' };
    }
};