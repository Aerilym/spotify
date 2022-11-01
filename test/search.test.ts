import { spotify } from './lib/clients';

describe('Spotify API client returns successful responses to searches', () => {
  //test each search method and check response is defined
  it('returns successful response for generic search', async () => {
    const albums = await spotify.search('The Killers', ['album']);
    expect(albums).toBeDefined();
  });
  it('returns successful response for searchAlbums', async () => {
    const albums = await spotify.searchAlbums('abba');
    expect(albums).toBeDefined();
  });
  it('returns successful response for searchArtists', async () => {
    const artists = await spotify.searchArtists('abba');
    expect(artists).toBeDefined();
  });
  it('returns successful response for searchTracks', async () => {
    const tracks = await spotify.searchTracks('abba');
    expect(tracks).toBeDefined();
  });
  it('returns successful response for searchPlaylists', async () => {
    const playlists = await spotify.searchPlaylists('abba');
    expect(playlists).toBeDefined();
  });
  it('returns successful response for searchShows', async () => {
    const shows = await spotify.searchShows('abba');
    expect(shows).toBeDefined();
  });
  it('returns successful response for searchEpisodes', async () => {
    const episodes = await spotify.searchEpisodes('abba');
    expect(episodes).toBeDefined();
  });
});
