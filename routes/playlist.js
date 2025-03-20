const querystring = require('querystring');
// require('dotenv').config();

let playlistId = null;

const url = "https://api.spotify.com/v1"

// Creates an empty playlist
exports.createPlaylist = async (access_token, vibe, genre) => {
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
            "name": `${vibe} ${genre} Playlist`,
            "description": `A collection of ${vibe} ${genre} songs`,
            "public": false
        })
    });

    const playlistData = await makePlaylist.json();
    playlistId = playlistData.id;
};

// Find tracks to add to the playlist
exports.findTracks = async (access_token, vibe, genre) => {
    const findTracks = await fetch(`${url}/search?q=${vibe}%20genre:${genre}&type=track&limit=20`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    });

    const findTracksData = await findTracks.json();

    let trackUris = [];

    findTracksData.tracks.items.forEach(track => {
        trackUris.push(track.uri);
    });

    await this.addTracks(access_token, trackUris);
};

// Adds tracks to the playlist
exports.addTracks = async (access_token, trackUris) => {
    console.log("track uris: " + trackUris);
    const addTracks = await fetch(`${url}/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'uris': trackUris
        })
    });

    // const addTracksData = await addTracks.json();
};
