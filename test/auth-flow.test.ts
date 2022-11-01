import { SpotifyAPI } from '../src/index';

const spotify = new SpotifyAPI();

describe('Client Auth flow works as expected', () => {
  it('No initial Client ID or Secret defined', () => {
    expect(spotify.auth.hasClientID()).toBe(false);
    expect(spotify.auth.hasClientSecret()).toBe(false);
  });
  it('Throws a no client ID or Secret found error when no Client ID or Secret is defined', async () => {
    await expect(spotify.auth.clientCredentialsGrant()).rejects.toThrowError(
      'Client ID or Client Secret is missing'
    );
  });
  it('Throws a could not refresh access token error when Client ID or Secret are wrong', async () => {
    await expect(spotify.auth.clientCredentialsGrant('wrong', 'wrong')).rejects.toThrowError(
      'Could not refresh access token'
    );
  });
});
