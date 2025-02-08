// const querystring = require('querystring');
// require('dotenv').config();

let playlistId = null;

const url = "https://api.spotify.com/v1"

// Creates an empty playlist
exports.createPlaylist = async (access_token) => {
    const user = await fetch(`${url}/me`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    });

    const userData = await user.json();
    const userId = userData.id;

    const makePlaylist = await fetch(`${url}/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": "<VIBE> <GENRE> Playlist",
            "description": "A collection of <VIBE> <GENRE> songs",
            "public": false
        })
    });

    const playlistData = await makePlaylist.json();
    playlistId = playlistData.id;
};
