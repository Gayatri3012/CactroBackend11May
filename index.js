const express = require('express');
const cors = require('cors');
const spotifyRoutes = require('./routes/spotify');

const app = express();
app.use(cors());
app.use(express.json());

// Route all /spotify requests
app.use('/spotify', spotifyRoutes);

// Root route (optional)
app.get('/', (req, res) => {
  res.send('Spotify API is running');
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
  
    try {
      const tokenRes = await axios.post(
        'https://accounts.spotify.com/api/token',
        querystring.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
          client_id: process.env.SPOTIFY_CLIENT_ID,
          client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
  
      console.log('Access Token:', tokenRes.data.access_token);
      console.log('Refresh Token:', tokenRes.data.refresh_token);
      res.send('Tokens received. Check your terminal!');
    } catch (err) {
      console.error('Error getting tokens:', err.response.data);
      res.send('Failed to get tokens.');
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});