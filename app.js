require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then((data) => spotifyApi.setAccessToken(data.body['access_token']))
	.catch((error) => console.log('Something went wrong when retrieving an access token', error));

//hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('index')
})

app.get('/artist-search', (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.artistSearch)
        .then(data => {
            const artistResults = data.body.artists.items
            res.render('artist-search-results', { artistResults })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err)); 
});

app.get('/albums/:id', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.id)
        .then(albums => {
            const artistAlbums = albums.body.items
            res.render('albums', { artistAlbums })
        })
        .catch(error => console.log(error)) 
})  

app.get('/albums/tracks/:trackid', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.trackid)
        .then(albumTracks => {
            const tracks = albumTracks.body.items
            res.render('tracks', { tracks })
        })
        .catch(error => console.log(error)) 
}) 

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));