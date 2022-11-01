import { spotifyUserAuth } from './lib/clients';

describe('User API endpoints work as expected', () => {
  // Test every user get endpoint
  it('Get Current User Profile', async () => {
    const user = await spotifyUserAuth.getMe();
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
  });
  it('Get Current users Top Artists', async () => {
    const artists = await spotifyUserAuth.getMyTopArtists();
    expect(artists).toBeDefined();
    expect(artists.items).toBeDefined();
  });
  it('Get Current users Top Tracks', async () => {
    const tracks = await spotifyUserAuth.getMyTopTracks();
    expect(tracks).toBeDefined();
    expect(tracks.items).toBeDefined();
  });
  it('Get Current users Recently Played Tracks', async () => {
    const tracks = await spotifyUserAuth.getMyRecentlyPlayedTracks();
    expect(tracks).toBeDefined();
    expect(tracks.items).toBeDefined();
  });
  it('Get Current users Saved Albums', async () => {
    const albums = await spotifyUserAuth.getMySavedAlbums();
    expect(albums).toBeDefined();
    expect(albums.items).toBeDefined();
  });
  it('Get Current users Saved Tracks', async () => {
    const tracks = await spotifyUserAuth.getMySavedTracks();
    expect(tracks).toBeDefined();
    expect(tracks.items).toBeDefined();
  });
  it('Get Current users saved shows', async () => {
    const shows = await spotifyUserAuth.getMySavedShows();
    expect(shows).toBeDefined();
    expect(shows.items).toBeDefined();
  });
  it('Get Current users playlists', async () => {
    const playlists = await spotifyUserAuth.getMyPlaylists();
    expect(playlists).toBeDefined();
    expect(playlists.items).toBeDefined();
  });
  it('Get Current users Followed Artists', async () => {
    const artists = await spotifyUserAuth.getFollowedArtists();
    expect(artists).toBeDefined();
    expect(artists.artists).toBeDefined();
  });
  it('Get if a list of tracks is in Current users Saved Tracks', async () => {
    const tracks = await spotifyUserAuth.containsMySavedTracks([
      '0eGsygTp906u18L0Oimnem',
      '1lDWb6b6ieDQ2xT7ewTC3G',
    ]);
    expect(tracks).toBeDefined();
    expect(tracks[0]).toBeDefined();
  });
  it('Get if a list of shows is in Current users Saved Shows', async () => {
    const shows = await spotifyUserAuth.containsMySavedShows([
      '6HTZdaDHjqXKDE4acYffoZ',
      '6HTZdaDHjqXKDE4acYffoZ',
    ]);
    expect(shows).toBeDefined();
  });
  it('Get if a list of albums is in Current users Saved Albums', async () => {
    const albums = await spotifyUserAuth.containsMySavedAlbums([
      '0sNOF9WDwhWunNAHPD3Baj',
      '1lDWb6b6ieDQ2xT7ewTC3G',
    ]);
    expect(albums).toBeDefined();
    expect(albums[0]).toBeDefined();
  });
  it('Get if current user follows other users', async () => {
    const users = await spotifyUserAuth.isFollowingUsers(['spotify', 'spotifycharts']);
    expect(users).toBeDefined();
    expect(users[0]).toBeDefined();
  });
  it('Get if current user follows artists', async () => {
    const artists = await spotifyUserAuth.isFollowingArtists(['0oSGxfWSnnOXhD2fKuz2Gy']);
    expect(artists).toBeDefined();
    expect(artists[0]).toBeDefined();
  });
});
