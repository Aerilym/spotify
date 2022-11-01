import { spotifyUserAuth } from './lib/clients';

const tracks = ['4rzfv0JLZfVhOhbSQ8o5jZ', '5o3jMYOSbaVz3tkgwhELSV', '4Cy0NHJ8Gh0xMdwyM9RkQm'];

describe('User Tracks', () => {
  it('can be added', async () => {
    const status = await spotifyUserAuth.addToMySavedTracks(tracks);
    expect(status).toBeDefined();
    expect(await spotifyUserAuth.containsMySavedTracks(tracks)).toStrictEqual([true, true, true]);
  });
  it('can be removed', async () => {
    const status = await spotifyUserAuth.removeFromMySavedTracks(tracks);
    expect(status).toBeDefined();
    expect(await spotifyUserAuth.containsMySavedTracks(tracks)).toStrictEqual([
      false,
      false,
      false,
    ]);
  });
});
