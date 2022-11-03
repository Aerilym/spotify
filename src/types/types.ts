import { Fetch } from './fetch';
import {
  Images,
  Connect,
  Playback,
  Playlists,
  Follow,
  ListeningHistory,
  Library,
  Users,
} from './scope';

/**
 * Spotify API client Client Options
 */
export interface SpotifyAPIClientOptions {
  /** The URL of the Spotify API server */
  url?: string;
  /** A custom fetch implementation. */
  fetch?: Fetch;
  /** Client auth options */
  auth?: AuthOptions;
}

export interface AuthOptions {
  /** AAn Access Token that can be provided in subsequent calls, for example to Spotify Web API services. */
  accessToken?: string;
  /** A token that can be sent to the Spotify Accounts service in place of an authorization code. (When the access code expires, send a POST request to the Accounts service /api/token endpoint, but use this code in place of an authorization code. A new Access Token will be returned. A new refresh token might be returned too.) */
  refreshToken?: string;
  /** A Date object representing when the the access token expires */
  accessTokenExpiresAt?: Date;
  /** A number of seconds until the access token expires */
  accessTokenExpiresIn?: number;
  /** Set to "true" if you want the access token to be refreshed when it needs to be used but has expired */
  refreshExpiredAccessToken?: boolean;
  /** Set to "true" if you want to automatically refresh the token before expiring. */
  autoRefreshToken?: boolean;
  /** Client ID used for client credentials grant */
  clientID?: string;
  /** Client Secret used for client credentials grant */
  clientSecret?: string;
  /** Spotify scopes to use for user auth */
  scopes?: SpotifyScope[];
  /** A custom fetch implementation. */
  fetch?: Fetch;
}

export interface SpotifyFetchOptions {
  /** A valid fetch request method to make the Spotify API request */
  method: SpotifyRequestMethod;
  /** Valid headers for Spotify API requests */
  headers: {
    /** A valid access token used for Spotify API requests "Bearer TOKEN"*/
    Authorization: string;
    /** The content type of the request body eg. "application/json" */
    'Content-Type'?: string;
  };
  /** The body of the request */
  body?: string;
}

//TODO: Properly type post data once post data is implemented.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpotifyBody = any;

export interface SpotifyRequestOptions {
  /** The endpoint url to make the request to */
  url: string;
  /** A valid fetch request method to make the Spotify API request */
  method?: SpotifyRequestMethod;
  /** The body data to include in the request */
  body?: SpotifyBody;
  /** Querystring parameters to append to the request url */
  params?: Record<string, SpotifyParamValues>;
  /** The request header content type */
  contentType?: string;
}

export type SpotifyRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type SpotifyParamValues = string | number | boolean | undefined | string[];

export type SpotifyAuthMethods = 'client_credentials' | 'authorization_code' | 'implicit_grant';

export interface PlaylistOptions {
  name: string;
  public?: boolean;
  collaborative?: boolean;
  description?: string;
}

export interface DeviceOptions {
  /** The ID of the device to effect */
  device_id?: string;
}

export interface PlayOptions extends DeviceOptions {
  context_uri?: string;
  uris?: string[];
  offset?: {
    position?: number;
    uri?: string;
  };
  position_ms?: number;
}

export interface SeekOptions extends DeviceOptions {
  position_ms: number;
}

export interface SetRepeatOptions extends DeviceOptions {
  state: 'track' | 'context' | 'off';
}

export interface SetVolumeOptions extends DeviceOptions {
  volume_percent: number;
}

export interface SetShuffleOptions extends DeviceOptions {
  state: boolean;
}

export type SpotifyURI = string;
export type SpotifyID = string;
export type SpotifyResource = 'album' | 'artist' | 'playlist' | 'track' | 'show' | 'episode';

export type SpotifyScope =
  | Images
  | Connect
  | Playback
  | Playlists
  | Follow
  | ListeningHistory
  | Library
  | Users;
