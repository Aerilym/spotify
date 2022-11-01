import { spotify } from './lib/clients';
import nodeFetch from 'node-fetch';

describe('Spotify API client works with custom fetch implementations', () => {
  it('works with default fetch implementation', async () => {
    const track = await spotify.getTrack('0eGsygTp906u18L0Oimnem');
    expect(track).toBeDefined();
    expect(track.name).toEqual('Mr. Brightside');
    expect(track.artists[0].name).toEqual('The Killers');
    expect(track.album.name).toEqual('Hot Fuss');
  });
  it('works with custom fetch implementation node-fetch', async () => {
    spotify.setCustomFetch(nodeFetch);
    const track = await spotify.getTrack('0eGsygTp906u18L0Oimnem');
    expect(track).toBeDefined();
    expect(track.name).toEqual('Mr. Brightside');
    expect(track.artists[0].name).toEqual('The Killers');
    expect(track.album.name).toEqual('Hot Fuss');
  });
});
