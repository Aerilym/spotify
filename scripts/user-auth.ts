/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

import express from 'express'; // Express web server framework
import fetch from 'cross-fetch';
import cors from 'cors';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import * as dotenv from 'dotenv';
import { SpotifyScope } from '../src/types/types';
import {
  Images,
  Connect,
  Playback,
  Playlists,
  Follow,
  ListeningHistory,
  Library,
  Users,
} from '../src/types/scope';
dotenv.config();

const redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret

if (
  process.env.USER_ACCESS_TOKEN &&
  new Date(parseInt(process.env.USER_AUTH_EXPIRES_AT ?? '')) > new Date()
) {
  process.exit(0);
}

const scopes: SpotifyScope[] = [
  Images.UPLOAD,
  Connect.MODIFY_PLAYBACK_STATE,
  Connect.READ_CURRENTLY_PLAYING,
  Connect.READ_PLAYBACK_STATE,
  Playback.APP_REMOTE_CONTROL,
  Playback.STREAMING,
  Playlists.MODIFY_PRIVATE,
  Playlists.MODIFY_PUBLIC,
  Playlists.READ_COLLABORATIVE,
  Playlists.READ_PRIVATE,
  Follow.MODIFY,
  Follow.READ,
  ListeningHistory.READ_PLAYBACK_POSITION,
  ListeningHistory.READ_RECENTLY_PLAYED,
  ListeningHistory.READ_TOP,
  Library.MODIFY,
  Library.READ,
  Users.READ_EMAIL,
  Users.READ_PRIVATE,
];

const scope = scopes.join(' ');

/**
 * Generates a random string containing numbers and letters
 */
const generateRandomString = function (length: number): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

const app = express();

app.use(cors()).use(cookieParser());

app.get('/login', function (req, res) {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get('/callback', async function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    );
  } else {
    const urlencoded = new URLSearchParams();
    urlencoded.append('code', code?.toString() ?? '');
    urlencoded.append('redirect_uri', redirect_uri);
    urlencoded.append('grant_type', 'authorization_code');
    const authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(client_id + ':' + client_secret),
      },
      body: urlencoded,
      json: true,
    };
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', authOptions);
    const body = await tokenRes.json();
    const { access_token, refresh_token, expires_in } = body;
    fs.appendFileSync(
      '.env',
      `\nUSER_ACCESS_TOKEN=${access_token}\nUSER_REFRESH_TOKEN=${refresh_token}\nUSER_EXPIRES_IN=${expires_in}\nUSER_AUTH_EXPIRES_AT=${
        Date.now() + expires_in * 1000
      }`
    );
    res
      .status(200)
      .send(
        'Spotify user oauth succeeded, access token and refresh token saved to .env file. You may now close this.'
      );
    process.exit(0);
  }
});

console.log(
  '\x1b[33m Spotify user oauth session started. Complete Spotify authentication at http://localhost:8888/login \x1b[0m'
);

app.listen(8888);
