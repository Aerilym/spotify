import { SpotifyURI } from '../src/types/types';
import { spotifyUserAuth } from './lib/clients';

const tracks = [
  'spotify:track:4rzfv0JLZfVhOhbSQ8o5jZ',
  'spotify:track:5o3jMYOSbaVz3tkgwhELSV',
  'spotify:track:4Cy0NHJ8Gh0xMdwyM9RkQm',
];

let playlistId: string;
let userId: string;

beforeAll(async () => {
  const { id } = await spotifyUserAuth.getMe();
  userId = id;
});

beforeEach(async () => {
  const { id: playId } = await spotifyUserAuth.createPlaylist(userId, {
    name: 'Test Playlist',
    description: 'test playlist description',
  });
  playlistId = playId;
});

afterEach(async () => {
  spotifyUserAuth.unfollowPlaylist(playlistId);
});

describe('Playlists can be created, modified, and deleted', () => {
  it('can be created and deleted', async () => {
    const playlist = await spotifyUserAuth.createPlaylist(userId, {
      name: 'Test Playlist',
      description: 'test playlist description',
    });
    expect(playlist).toBeDefined();
    expect(playlist.id).toBeDefined();
    expect(playlist.name).toBe('Test Playlist');
    expect(playlist.description).toBe('test playlist description');
    expect(await spotifyUserAuth.getPlaylist(playlist.id)).toBeDefined();
    spotifyUserAuth.unfollowPlaylist(playlist.id);
  });
  it('can be modified', async () => {
    const gotPlaylist1 = await spotifyUserAuth.getPlaylist(playlistId);
    expect(gotPlaylist1).toBeDefined();
    expect(gotPlaylist1.id).toBeDefined();
    expect(gotPlaylist1.name).toBe('Test Playlist');
    expect(gotPlaylist1.description).toBe('test playlist description');
    const changed = await spotifyUserAuth.changePlaylistDetails(playlistId, {
      name: 'Modified Playlist',
      description: 'modified playlist description',
    });
    expect(changed).toBeDefined();

    const modifiedPlaylist = await spotifyUserAuth.getPlaylist(playlistId);

    expect(modifiedPlaylist.id).toBeDefined();
    expect(modifiedPlaylist.name).toBe('Modified Playlist');
    expect(modifiedPlaylist.description).toBe('modified playlist description');
  });
  it('can have tracks added', async () => {
    const added = await spotifyUserAuth.addTracksToPlaylist(playlistId, tracks);
    expect(added).toBeDefined();
    expect(added.snapshot_id).toBeDefined();
    const gotPlaylist = await spotifyUserAuth.getPlaylist(playlistId);
    expect(gotPlaylist).toBeDefined();
    expect(gotPlaylist.tracks.items.length).toBe(3);
  });
  it('can have tracks removed', async () => {
    const added = await spotifyUserAuth.addTracksToPlaylist(playlistId, tracks);
    expect(added).toBeDefined();
    expect(added.snapshot_id).toBeDefined();
    const gotPlaylist = await spotifyUserAuth.getPlaylist(playlistId);
    expect(gotPlaylist).toBeDefined();
    expect(gotPlaylist.tracks.items.length).toBe(3);
    const removed = await spotifyUserAuth.removeTracksFromPlaylist(playlistId, tracks);
    expect(removed).toBeDefined();
    expect(removed.snapshot_id).toBeDefined();
    const gotPlaylist2 = await spotifyUserAuth.getPlaylist(playlistId);
    expect(gotPlaylist2).toBeDefined();
    expect(gotPlaylist2.tracks.items.length).toBe(0);
  });
  /* it('can have tracks reordered', async () => {
    const added = await spotifyUserAuth.addTracksToPlaylist(playlistId, tracks);
    expect(added).toBeDefined();
    expect(added.snapshot_id).toBeDefined();
    const gotPlaylist = await spotifyUserAuth.getPlaylist(playlistId);
    expect(gotPlaylist).toBeDefined();
    expect(gotPlaylist.tracks.items.length).toBe(3);
    const reordered = await spotifyUserAuth.reorderTracksInPlaylist(playlistId, 1, 0, 2);
    expect(reordered).toBeDefined();
    expect(reordered.snapshot_id).toBeDefined();
    const gotPlaylist2 = await spotifyUserAuth.getPlaylist(playlistId);
    expect(gotPlaylist2).toBeDefined();
    expect(gotPlaylist2.tracks.items.length).toBe(3);
    if (gotPlaylist2.tracks.items && gotPlaylist2.tracks.items.length === 3) {
      expect(gotPlaylist2.tracks.items[0].track).toBeDefined();
      expect(gotPlaylist2.tracks.items[1].track).toBeDefined();
      expect(gotPlaylist2.tracks.items[2].track).toBeDefined();
      if (
        gotPlaylist2.tracks.items[0].track &&
        gotPlaylist2.tracks.items[1].track &&
        gotPlaylist2.tracks.items[2].track
      ) {
        expect(gotPlaylist2.tracks.items[0].track.uri).toBe(tracks[1]);
        expect(gotPlaylist2.tracks.items[1].track.uri).toBe(tracks[2]);
        expect(gotPlaylist2.tracks.items[2].track.uri).toBe(tracks[0]);
      }
    }
  });
  it('can have tracks replaced', async () => {
    const added = await spotifyUserAuth.addTracksToPlaylist(playlistId, tracks);
    expect(added).toBeDefined();
    expect(added.snapshot_id).toBeDefined();
    const gotPlaylist = await spotifyUserAuth.getPlaylist(playlistId);
    expect(gotPlaylist).toBeDefined();
    expect(gotPlaylist.tracks.items.length).toBe(3);
    const replaced = await spotifyUserAuth.replaceTracksInPlaylist(playlistId, [
      tracks[2],
      tracks[0],
      tracks[1],
    ]);
    expect(replaced).toBeDefined();
    expect(replaced.snapshot_id).toBeDefined();
    const gotPlaylist2 = await spotifyUserAuth.getPlaylist(playlistId);
    expect(gotPlaylist2).toBeDefined();
    expect(gotPlaylist2.tracks.items.length).toBe(3);
    if (gotPlaylist2.tracks.items && gotPlaylist2.tracks.items.length === 3) {
      expect(gotPlaylist2.tracks.items[0].track).toBeDefined();
      expect(gotPlaylist2.tracks.items[1].track).toBeDefined();
      expect(gotPlaylist2.tracks.items[2].track).toBeDefined();
      if (
        gotPlaylist2.tracks.items[0].track &&
        gotPlaylist2.tracks.items[1].track &&
        gotPlaylist2.tracks.items[2].track
      ) {
        expect(gotPlaylist2.tracks.items[0].track.uri).toBe(tracks[2]);
        expect(gotPlaylist2.tracks.items[1].track.uri).toBe(tracks[0]);
        expect(gotPlaylist2.tracks.items[2].track.uri).toBe(tracks[1]);
      }
    }
  }); */
});
