import { spotifyUserAuth } from './lib/clients';

const albums = ['382ObEPsp2rxGrnsizN5TX', '1A2GTWGtFfWp7KSQTwWOyo', '2noRn2Aes5aoNVsU6iWThc'];

describe('User Albums', () => {
  it('can be added', async () => {
    const status = await spotifyUserAuth.addToMySavedAlbums(albums);
    expect(status).toBeDefined();
    expect(await spotifyUserAuth.containsMySavedAlbums(albums)).toStrictEqual([true, true, true]);
  });
  it('can be removed', async () => {
    const status = await spotifyUserAuth.removeFromMySavedAlbums(albums);
    expect(status).toBeDefined();
    expect(await spotifyUserAuth.containsMySavedAlbums(albums)).toStrictEqual([
      false,
      false,
      false,
    ]);
  });
});
