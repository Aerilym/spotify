import { spotify } from './lib/clients';
import { SpotifyAPI } from '../src/index';

const spotifyBlank = new SpotifyAPI();

describe('creates Spotify API client', () => {
  it('Without any options by default', () => {
    expect(spotifyBlank.auth.getAccessTokenExpireDate()).toBeUndefined();
    expect(spotifyBlank.auth.getAccessToken()).toBeUndefined();
    expect(spotifyBlank.auth.hasClientID()).toBe(false);
    expect(spotifyBlank.auth.hasClientSecret()).toBe(false);
  });
  it('with a default url', () => {
    expect(spotifyBlank.getApiUrl()).toEqual('https://api.spotify.com/v1');
  });
  it('with a custom url', () => {
    const spotifyCustomUrl = new SpotifyAPI({ url: 'https://api.spotify.com/v2' });
    expect(spotifyCustomUrl.getApiUrl()).toEqual('https://api.spotify.com/v2');
  });
  it('with refreshExpiredAccessToken set to false', () => {
    const spotifyCustomExpire = new SpotifyAPI({ auth: { refreshExpiredAccessToken: false } });
    expect(spotifyCustomExpire.auth.refreshExpiredAccessToken).toBe(false);
  });
  it('with an access token', async () => {
    await spotify.auth.clientCredentialsGrant(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
    const accessToken = spotify.auth.getAccessToken();

    const spotifyWithAccessToken = new SpotifyAPI({
      auth: {
        accessToken: spotify.auth.getAccessToken(),
      },
    });
    expect(spotifyWithAccessToken.auth.hasAccessToken()).toEqual(true);
    expect(spotifyWithAccessToken.auth.getAccessToken()).toEqual(accessToken);
  });
  it('with an access token expire date', async () => {
    await spotify.auth.clientCredentialsGrant(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

    const expireDate = spotify.auth.getAccessTokenExpireDate();

    const spotifyWithAccessToken = new SpotifyAPI({
      auth: {
        accessToken: spotify.auth.getAccessToken(),
        accessTokenExpiresAt: expireDate,
      },
    });
    expect(spotifyWithAccessToken.auth.hasAccessToken()).toEqual(true);
    expect(spotifyWithAccessToken.auth.getAccessTokenExpireDate()).toEqual(expireDate);
  });
  it('with an access token expire time', async () => {
    await spotify.auth.clientCredentialsGrant(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

    const expireDate = spotify.auth.getAccessTokenExpireDate() ?? new Date();

    const secondsUntilExpire = Math.floor((expireDate.getTime() - Date.now()) / 1000);

    const spotifyWithAccessToken = new SpotifyAPI({
      auth: {
        accessToken: spotify.auth.getAccessToken(),
        accessTokenExpiresIn: secondsUntilExpire,
      },
    });
    expect(spotifyWithAccessToken.auth.hasAccessToken()).toEqual(true);
    expect(spotifyWithAccessToken.auth.getAccessTokenExpireDate()?.getUTCMinutes()).toBe(
      expireDate.getUTCMinutes()
    );
  });
});

describe('Client can make successful requests', () => {
  it('returns successful response', async () => {
    const track = await spotify.getTrack('0eGsygTp906u18L0Oimnem');
    expect(track).toBeDefined();
    expect(track.name).toEqual('Mr. Brightside');
    expect(track.artists[0].name).toEqual('The Killers');
    expect(track.album.name).toEqual('Hot Fuss');
  });
  it('stores the gotten access token after a request', () => {
    expect(spotify.auth.getAccessToken()).toBeDefined();
  });
});
