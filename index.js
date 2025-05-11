const express = require('express');
const cors = require('cors');
// const spotifyRoutes = require('./routes/spotify');

const app = express();
app.use(cors());
app.use(express.json());

// Route all /spotify requests
// app.use('/spotify', spotifyRoutes);

// Root route (optional)
app.get('/', (req, res) => {
  res.send('Spotify API is running');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});