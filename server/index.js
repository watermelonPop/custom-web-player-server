const express = require('express');
const request = require('request');
const dotenv = require('dotenv');
const cors = require('cors');
const SpotifWebAPI = require("spotify-web-api-node");
const bodyParser = require('body-parser');

const port = process.env.PORT || 4000;

global.access_token = '';

dotenv.config();

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

var spotify_redirect_uri = 'https://custom-web-player-server.glitch.me/login';

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var app = express();
app.use(cors());
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.post('/login', (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifWebAPI({
    redirectUri: spotify_redirect_uri,
    clientId: "4eb7fa6a3b80412595f5ef4932d67cfd",
    clientSecret: "7fd3931d8cb04d4fb6850b1268de40bc",
  });
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
    });
});

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifWebAPI({
    redirectUri: redirectUri,
    clientId: "clientId",
    clientSecret: "clientSecret",
    refreshToken,
  });
  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      console.log(data.body);
    })
    .catch(() => {
      res.status(400);
    });
});



app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});