import { spotify } from './lib/clients';

describe('Spotify API client returns successful responses to GET requests', () => {
  //test each method and check response is defined
  it('returns successful response for getAlbum', async () => {
    const album = await spotify.getAlbum('0sNOF9WDwhWunNAHPD3Baj');
    expect(album).toBeDefined();
  });
  it('returns successful response for getAlbums', async () => {
    const album = await spotify.getAlbums(['0sNOF9WDwhWunNAHPD3Baj', '1A2GTWGtFfWp7KSQTwWOyo']);
    expect(album).toBeDefined();
  });
  it('returns successful response for getAlbumTracks', async () => {
    const tracks = await spotify.getAlbumTracks('0sNOF9WDwhWunNAHPD3Baj');
    expect(tracks).toBeDefined();
  });
  it('returns successful response for getArtist', async () => {
    const artist = await spotify.getArtist('0oSGxfWSnnOXhD2fKuz2Gy');
    expect(artist).toBeDefined();
  });
  it('returns successful response for getArtistAlbums', async () => {
    const albums = await spotify.getArtistAlbums('0oSGxfWSnnOXhD2fKuz2Gy');
    expect(albums).toBeDefined();
  });
  it('returns successful response for getArtistTopTracks', async () => {
    const tracks = await spotify.getArtistTopTracks('0oSGxfWSnnOXhD2fKuz2Gy', 'ES');
    expect(tracks).toBeDefined();
  });
  it('returns successful response for getArtistRelatedArtists', async () => {
    const artists = await spotify.getArtistRelatedArtists('0oSGxfWSnnOXhD2fKuz2Gy');
    expect(artists).toBeDefined();
  });
  it('returns successful response for getArtists', async () => {
    const artists = await spotify.getArtists([
      '2CIMQHirSU0MQqyYHq0eOx',
      '57dN52uHvrHOxijzpIgu3E',
      '1vCWHaC5f2uS3yhpwWbIA6',
    ]);
    expect(artists).toBeDefined();
  });
  it('returns successful response for getAudioFeaturesForTrack', async () => {
    const features = await spotify.getAudioFeaturesForTrack('0eGsygTp906u18L0Oimnem');
    expect(features).toBeDefined();
  });
  it('returns successful response for getAudioFeaturesForTracks', async () => {
    const features = await spotify.getAudioFeaturesForTracks([
      '0eGsygTp906u18L0Oimnem',
      '1lDWb6b6ieDQ2xT7ewTC3G',
    ]);
    expect(features).toBeDefined();
  });
  it('returns successful response for getAudioAnalysisForTrack', async () => {
    const analysis = await spotify.getAudioAnalysisForTrack('0eGsygTp906u18L0Oimnem');
    expect(analysis).toBeDefined();
  });
  it('returns successful response for getAvailableGenreSeeds', async () => {
    const seeds = await spotify.getAvailableGenreSeeds();
    expect(seeds).toBeDefined();
  });
  it('returns successful response for getCategories', async () => {
    const categories = await spotify.getCategories();
    expect(categories).toBeDefined();
  });
  it('returns successful response for getCategory', async () => {
    const category = await spotify.getCategory('0JQ5DAqbMKFF1br7dZcRtK');
    expect(category).toBeDefined();
  });
  it('returns successful response for getCategoryPlaylists', async () => {
    const playlists = await spotify.getCategoryPlaylists('0JQ5DAqbMKFF1br7dZcRtK');
    expect(playlists).toBeDefined();
  });
  it('returns successful response for getFeaturedPlaylists', async () => {
    const playlists = await spotify.getFeaturedPlaylists();
    expect(playlists).toBeDefined();
  });
  it('returns successful response for getNewReleases', async () => {
    const albums = await spotify.getNewReleases();
    expect(albums).toBeDefined();
  });
  it('returns successful response for getRecommendations', async () => {
    const recommendations = await spotify.getRecommendations({
      seed_artists: ['0oSGxfWSnnOXhD2fKuz2Gy'],
      min_energy: 0.4,
      min_popularity: 50,
    });
    expect(recommendations).toBeDefined();
  });
  it('returns successful response for getTrack', async () => {
    const track = await spotify.getTrack('0eGsygTp906u18L0Oimnem');
    expect(track).toBeDefined();
  });
  it('returns successful response for getTracks', async () => {
    const tracks = await spotify.getTracks(['0eGsygTp906u18L0Oimnem', '1lDWb6b6ieDQ2xT7ewTC3G']);
    expect(tracks).toBeDefined();
  });
  it('returns successful response for getShow', async () => {
    const show = await spotify.getShow('0xEF4DiEIibOVgYC6PK7eP');
    expect(show).toBeDefined();
  });
  it('returns successful response for getShow with market', async () => {
    const show = await spotify.getShow('0xEF4DiEIibOVgYC6PK7eP', 'AU');
    expect(show).toBeDefined();
  });
  it('returns successful response for getShows with market', async () => {
    const shows = await spotify.getShows(
      ['0xEF4DiEIibOVgYC6PK7eP', '5as3aKmN2k11yfDDDSrvaZ'],
      'AU'
    );
    expect(shows).toBeDefined();
  });
  it('returns successful response for getShowEpisodes', async () => {
    const showEpisodes = await spotify.getShowEpisodes('38bS44xjbVVZ3No3ByF1dJ');
    expect(showEpisodes).toBeDefined();
  });
  it('returns successful response for getShowEpisodes with market', async () => {
    const showEpisodes = await spotify.getShowEpisodes('38bS44xjbVVZ3No3ByF1dJ', 'AU');
    expect(showEpisodes).toBeDefined();
  });
  it('returns successful response for getEpisode', async () => {
    const episode = await spotify.getEpisode('512ojhOuo1ktJprKbVcKyQ');
    expect(episode).toBeDefined();
  });
  it('returns successful response for getEpisode with market', async () => {
    const episode = await spotify.getEpisode('512ojhOuo1ktJprKbVcKyQ', 'AU');
    expect(episode).toBeDefined();
  });
  it('returns successful response for getEpisodes', async () => {
    const episodes = await spotify.getEpisodes([
      '512ojhOuo1ktJprKbVcKyQ',
      '0Q86acNRm6V9GYx55SXKwf',
    ]);
    expect(episodes).toBeDefined();
  });
  it('returns successful response for getEpisodes with market', async () => {
    const episodes = await spotify.getEpisodes(
      ['512ojhOuo1ktJprKbVcKyQ', '0Q86acNRm6V9GYx55SXKwf'],
      'AU'
    );
    expect(episodes).toBeDefined();
  });
  it('returns successful response for getPlaylist', async () => {
    const playlist = await spotify.getPlaylist('37i9dQZF1DXcBWIGoYBM5M');
    expect(playlist).toBeDefined();
  });
  it('returns successful response for getPlaylistTracks', async () => {
    const tracks = await spotify.getPlaylistTracks('37i9dQZF1DXcBWIGoYBM5M');
    expect(tracks).toBeDefined();
  });
  it('returns successful response for getPlaylistCoverImage', async () => {
    const image = await spotify.getPlaylistCoverImage('37i9dQZF1DXcBWIGoYBM5M');
    expect(image).toBeDefined();
  });
  it('returns successful response for getUser', async () => {
    const user = await spotify.getUser('spotify');
    expect(user).toBeDefined();
  });
  it('returns successful responseexpect(await spotifyUserAuth.containsMySavedTracks(tracks)).toStrictEqual([true, true, true]); for getUserPlaylists', async () => {
    const playlists = await spotify.getUserPlaylists('spotify');
    expect(playlists).toBeDefined();
  });
  it('Get if users are following a playlist', async () => {
    const isFollowing = await spotify.areFollowingPlaylist('3cEYpjA9oz9GiPac4AsH4n', [
      'jmperezperez',
      'thelinmichael',
      'wizzler',
    ]);
    expect(isFollowing).toStrictEqual([true, false, false]);
  });
});
