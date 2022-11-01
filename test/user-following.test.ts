import { spotifyUserAuth } from './lib/clients';

const users = ['jmperezperez', 'thelinmichael', 'wizzler'];
const artists = ['2CIMQHirSU0MQqyYHq0eOx', '57dN52uHvrHOxijzpIgu3E', '1vCWHaC5f2uS3yhpwWbIA6'];
const playlist = '3cEYpjA9oz9GiPac4AsH4n';

describe('Follow Users', () => {
  it('can follow', async () => {
    const status = await spotifyUserAuth.followUsers(users);
    expect(status).toBeDefined();
    expect(await spotifyUserAuth.isFollowingUsers(users)).toStrictEqual([true, true, true]);
  });
  it('can unfollow', async () => {
    const status = await spotifyUserAuth.unfollowUsers(users);
    expect(status).toBeDefined();
    expect(await spotifyUserAuth.isFollowingUsers(users)).toStrictEqual([false, false, false]);
  });
});

describe('Follow Artists', () => {
  it('can follow', async () => {
    const status = await spotifyUserAuth.followArtists(artists);
    expect(status).toBeDefined();
    expect(await spotifyUserAuth.isFollowingArtists(artists)).toStrictEqual([true, true, true]);
  });
  it('can unfollow', async () => {
    const status = await spotifyUserAuth.unfollowArtists(artists);
    expect(status).toBeDefined();
    expect(await spotifyUserAuth.isFollowingArtists(artists)).toStrictEqual([false, false, false]);
  });
});

describe('Follow Playlist', () => {
  it('can follow', async () => {
    const { id } = await spotifyUserAuth.getMe();
    const status = await spotifyUserAuth.followPlaylist(playlist);
    expect(status).toBeDefined();
    expect(await spotifyUserAuth.areFollowingPlaylist(playlist, [id])).toStrictEqual([true]);
  });
  it('can unfollow', async () => {
    const { id } = await spotifyUserAuth.getMe();
    const status = await spotifyUserAuth.unfollowPlaylist(playlist);
    expect(status).toBeDefined();
    expect(await spotifyUserAuth.areFollowingPlaylist(playlist, [id])).toStrictEqual([false]);
  });
});
