import { SpotifyAPI } from '../../src/index';
import * as dotenv from 'dotenv';
dotenv.config();

export const spotify = new SpotifyAPI({
  auth: {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
});

export const spotifyUserAuth = new SpotifyAPI({
  auth: {
    accessToken: process.env.USER_ACCESS_TOKEN,
    refreshToken: process.env.USER_REFRESH_TOKEN,
    accessTokenExpiresIn: parseInt(process.env.USER_EXPIRES_IN ?? ''),
  },
});
