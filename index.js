const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const querystring = require('querystring');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Your Spotify access token (manually obtained)
const ACCESS_TOKEN = process.env.SPOTIFY_ACCESS_TOKEN;

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI; // This should match the one in your Spotify app settings

// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }), {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = response.data;
    console.log('Refreshed Access Token:', access_token);

    // Return the refreshed access token
    return access_token;
  } catch (err) {
    console.error('Failed to refresh access token:', err.response?.data || err);
    throw new Error('Unable to refresh access token');
  }
};

// Callback Route
app.get('/callback', async (req, res) => {
  const { code } = req.query; // Get the authorization code from query string
  
  if (!code) {
    return res.status(400).send('Code missing in query parameters');
  }

  try {
    // Exchange the authorization code for an access token
    const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
    }), {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Get the tokens from the response
    const { access_token, refresh_token } = response.data;

    // Store these tokens securely, either in memory, a database, or environment variables
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);

    // Respond to the user or redirect them
    res.json({
      message: 'Tokens received successfully!',
      access_token,
      refresh_token,
    });
  } catch (err) {
    console.error('Failed to get tokens:', err.response?.data || err);
    res.status(500).send('Error exchanging the authorization code');
  }
});

// app.get('/spotify', async (req, res) => {
//   try {
//     // If the access token is expired, refresh it
//     let tokenToUse = ACCESS_TOKEN;
//     const expiresIn = 3600; // Replace this with the actual expiration time for your token (1 hour)

//     // If token is expired, refresh it
//     if (/* Check if token is expired */) {
//       tokenToUse = await refreshAccessToken();
//     }

//     // Fetch your top tracks from Spotify
//     const topTracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10', {
//       headers: {
//         Authorization: `Bearer ${tokenToUse}`,
//       },
//     });

//     // Return the top tracks as JSON
//     res.json(topTracksResponse.data);
//   } catch (err) {
//     console.error('Error fetching top tracks:', err);
//     res.status(500).send('Failed to fetch Spotify data');
//   }
// });
