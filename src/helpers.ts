import { SpotifyID, SpotifyResource, SpotifyURI } from './types/types';

type Fetch = typeof fetch;

/**
 * Resolves the fetch implementation to use.
 */
// TODO: Add support for other fetch handlers like axios.
export const resolveFetch = (customFetch?: Fetch): Fetch => {
  let _fetch: Fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === 'undefined') {
    // TODO: Replace any with a proper type
    // eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-explicit-any
    _fetch = async (...args): Promise<any> => await (await import('cross-fetch')).fetch(...args);
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};

/** Adds a trailing slash to a url if ones doesn't exist */
export const addTrailingSlash = (url: string): string => {
  if (url.endsWith('/')) {
    return url;
  }
  return `${url}/`;
};

/**
 *
 */
export function spotifyURI(
  strings: TemplateStringsArray,
  resource: SpotifyResource,
  id: SpotifyID
): SpotifyURI {
  if (!isSpotifyID(id)) throw new Error('Invalid Spotify ID');
  return `spotify:${resource}:${id}`;
}

/**
 *
 */
export function isSpotifyID(id: string): id is SpotifyID {
  const regex = /^[0-9A-Za-z_-]{22}$/;
  return regex.test(id);
}

/**
 *
 */
export function createURI(resource: SpotifyResource, id: SpotifyID): SpotifyURI {
  return spotifyURI`${resource}${id}`;
}

/**
 *
 */
export function createURIs(resource: SpotifyResource, ids: SpotifyID[]): SpotifyURI[] {
  return ids.map((id) => createURI(resource, id));
}
