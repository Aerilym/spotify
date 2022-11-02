import { addTrailingSlash, spotifyURI, isSpotifyID, createURI, createURIs } from '../src/helpers';

describe('Trailing Slash', () => {
  it('adds a trailing slash to a url if one does not exist', () => {
    const url = 'https://api.spotify.com/v1';
    expect(addTrailingSlash(url)).toBe(url + '/');
  });
  it('doesnt change the url if it has a trailing slash', () => {
    const url = 'https://api.spotify.com/v1/';
    expect(addTrailingSlash(url)).toBe(url);
  });
});

describe('Spotify URI', () => {
  it('returns a Spotify URI when a valid ID is given', () => {
    const uri = spotifyURI`${'track'}${'4rzfv0JLZfVhOhbSQ8o5jZ'}`;
    expect(uri).toBe('spotify:track:4rzfv0JLZfVhOhbSQ8o5jZ');
  });
  it('throws an error when an invalid ID is given', () => {
    expect(() => spotifyURI`${'track'}${'4rzfv0JLZfVhOhbSQ8o5jZz'}`).toThrowError(
      'Invalid Spotify ID'
    );
  });
});

describe('Spotify ID', () => {
  it('returns true when a valid ID is given', () => {
    const id = '4rzfv0JLZfVhOhbSQ8o5jZ';
    expect(isSpotifyID(id)).toBe(true);
  });
  it('returns false when an invalid ID is given', () => {
    const id = '4rzfv0JLZfVhOhbSQ8o5jZz';
    expect(isSpotifyID(id)).toBe(false);
  });
});

describe('Create URI', () => {
  it('returns a Spotify URI when a valid ID is given', () => {
    const uri = createURI('track', '4rzfv0JLZfVhOhbSQ8o5jZ');
    expect(uri).toBe('spotify:track:4rzfv0JLZfVhOhbSQ8o5jZ');
  });
  it('throws an error when an invalid ID is given', () => {
    expect(() => createURI('track', '4rzfv0JLZfVhOhbSQ8o5jZz')).toThrowError('Invalid Spotify ID');
  });
});

describe('Create URIs', () => {
  it('returns a Spotify URI when a valid ID is given', () => {
    const uris = createURIs('track', ['4rzfv0JLZfVhOhbSQ8o5jZ']);
    expect(uris).toStrictEqual(['spotify:track:4rzfv0JLZfVhOhbSQ8o5jZ']);
  });
  it('throws an error when an invalid ID is given', () => {
    expect(() => createURIs('track', ['4rzfv0JLZfVhOhbSQ8o5jZz'])).toThrowError(
      'Invalid Spotify ID'
    );
  });
});
