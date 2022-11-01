import { spotify } from './lib/clients';

describe('spotify.auth API client utility functions work as expected', () => {
  it('No initial access token to be defined', () => {
    expect(spotify.auth.getAccessToken()).toBeUndefined();
  });
  it('No initial access token', () => {
    expect(spotify.auth.hasAccessToken()).toBe(false);
  });
  it('Access token is not expired when it does not exist', () => {
    expect(spotify.auth.hasAccessToken()).toBe(false);
    expect(spotify.auth.isAccessTokenExpired()).toBe(false);
  });
  it('Setting access token works successfully', () => {
    spotify.auth.setAccessToken('test');
    expect(spotify.auth.getAccessToken()).toEqual('test');
  });
  it('Setting access token with time to expire works successfully', () => {
    spotify.auth.setAccessToken('test', 3600);
    expect(spotify.auth.getAccessToken()).toEqual('test');
    expect(spotify.auth.getAccessTokenExpireDate()).toBeDefined();
  });
  it('Access token can be refreshed', async () => {
    await spotify.auth.refreshAccessToken();
    expect(spotify.auth.hasAccessToken()).toEqual(true);
    expect(spotify.auth.getAccessTokenExpireDate()).toBeInstanceOf(Date);
  });
  it('Access token can be refreshed with client auth flow', async () => {
    await spotify.auth.refreshAccessToken('client_credentials');
    expect(spotify.auth.hasAccessToken()).toEqual(true);
    expect(spotify.auth.getAccessTokenExpireDate()).toBeInstanceOf(Date);
  });
  it('Access token is not expired after it is refreshed', async () => {
    await spotify.auth.refreshAccessToken();
    expect(spotify.auth.hasAccessToken()).toBe(true);
    expect(spotify.auth.isAccessTokenExpired()).toBe(false);
  });
  it('Access token can be cleared', () => {
    spotify.auth.clearAccessToken();
    expect(spotify.auth.hasAccessToken()).toBe(false);
    expect(spotify.auth.getAccessTokenExpireDate()).toBe(undefined);
  });
  it('Initial client ID is set', () => {
    expect(spotify.auth.hasClientID()).toBe(true);
  });
  it('Initial client secret is set', () => {
    expect(spotify.auth.hasClientSecret()).toBe(true);
  });
  it('Client ID can be cleared', () => {
    spotify.auth.setClientID('');
    expect(spotify.auth.hasClientID()).toBe(false);
  });
  it('Client Secret can be cleared', () => {
    spotify.auth.setClientSecret('');
    expect(spotify.auth.hasClientSecret()).toBe(false);
  });
});
