import { Fetch } from './types/fetch';
import { addTrailingSlash, createURIs, resolveFetch, spotifyURI } from './helpers';
import type {
  PlaylistOptions,
  DeviceOptions,
  PlayOptions,
  SeekOptions,
  SetRepeatOptions,
  SetShuffleOptions,
  SetVolumeOptions,
  SpotifyAPIClientOptions,
  SpotifyFetchOptions,
  SpotifyRequestOptions,
  SpotifyAuthMethods,
  AuthOptions,
  SpotifyScope,
  SpotifyURI,
  SpotifyID,
} from './types/types';

const DEFAULT_OPTIONS: Omit<
  Required<SpotifyAPIClientOptions>,
  | 'fetch'
  | 'accessToken'
  | 'accessTokenExpiresAt'
  | 'accessTokenExpiresIn'
  | 'clientID'
  | 'clientSecret'
  | 'auth'
> = {
  url: 'https://api.spotify.com/v1',
};

/**
 * Spotify API Client for making requests to the Spotify Web API.
 */
export default class SpotifyAPI {
  private url: string;
  private fetch: Fetch;
  auth: Auth;
  /**
   * Create a new Spotify API client.
   * @param options - Spotify API client options.
   */
  constructor(options?: SpotifyAPIClientOptions) {
    const settings = { ...DEFAULT_OPTIONS, ...options };
    this.url = settings.url;
    this.fetch = resolveFetch(settings.fetch);
    this.auth = new Auth(this.fetch, settings.auth);
  }

  /**
   * Get the set API URL.
   */
  getApiUrl = (): string => {
    return this.url;
  };

  /**
   * Set the API client to use a custom fetch implementation.
   * @param fetch - A custom fetch implementation.
   */
  //TODO: Add type for fetch.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCustomFetch = (fetch: any): void => {
    this.fetch = resolveFetch(fetch);
  };

  /**
   * Make a request to the Spotify API. This method is used internally by the other methods but can be called directly if you want to make a request that is not yet implemented or modify an existing request.
   * @remarks
   * The method will automatically refresh the access token if it is expired, unless the refreshExpiredAccessToken option is set to `false`. It will also make `GET` requests by default if no `method` is specified.
   * @param options - The options for the request to the Spotify API. A url as a string can be specified instead to make GET request to the specified url.
   */
  // TODO: Add type for return.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request = async (options: SpotifyRequestOptions | string): Promise<any> => {
    if (!this.auth.hasAccessToken() || this.auth.isAccessTokenExpired()) {
      if (!this.auth.refreshExpiredAccessToken) {
        throw new Error('No non-expired access token set and expired token refresh is disabled.');
      }
      await this.auth.refreshAccessToken();
    }

    const fetchOptions: SpotifyFetchOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.auth.getAccessToken()}`,
      },
    };

    let reqUrl;
    if (typeof options === 'string') {
      reqUrl = options;
    } else {
      reqUrl = options.url;
      if (options.params) {
        reqUrl = addTrailingSlash(reqUrl);
        const urlencoded = new URLSearchParams(options.params as Record<string, string>);
        reqUrl += `?${urlencoded.toString()}`;
      }
      if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
        fetchOptions.headers['Content-Type'] = 'application/json';
      }
      if (options.method) {
        fetchOptions.method = options.method;
      }
    }

    const res = await this.fetch(reqUrl, fetchOptions);

    if (res.ok) {
      //if content type is json, return json, otherwise return text
      if (res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
      return await res.text();
    }

    const { error } = await res.json();
    throw new Error(
      `Request to ${reqUrl} failed with status ${res.status}: ${res.statusText} - Message: ${error.message}`
    );
  };

  /**
   * Get detailed profile information about the current user (including the current user's username).
   * @See [Get Current User's Profile](https://developer.spotify.com/web-api/get-current-users-profile/)
   */
  getMe = async (): Promise<SpotifyApi.UserProfileResponse> => {
    return this.request(this.url + '/me');
  };

  /**
   * Fetches current user's saved tracks.
   * @See [Get Current User's Saved Tracks](https://developer.spotify.com/web-api/get-users-saved-tracks/)
   */
  getMySavedTracks = async (): Promise<SpotifyApi.UsersSavedTracksResponse> => {
    return this.request(this.url + '/me/tracks');
  };

  /**
   * Adds a list of tracks to the current user's saved tracks.
   * @See [Save Tracks for Current User](https://developer.spotify.com/web-api/save-tracks-user/)
   * @param trackIDs - The ids of the tracks.
   */
  addToMySavedTracks = async (trackIDs: string[]): Promise<SpotifyApi.UsersSavedTracksResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/me/tracks',
      method: 'PUT',
      body: trackIDs,
    };
    return this.request(payload);
  };

  /**
   * Remove a list of tracks from the current user's saved tracks.
   * @See [Remove Tracks for Current User](https://developer.spotify.com/web-api/remove-tracks-user/)
   * @param trackIDs - The ids of the tracks.
   */
  removeFromMySavedTracks = async (
    trackIDs: string[]
  ): Promise<SpotifyApi.RemoveUsersSavedTracksResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/me/tracks',
      method: 'DELETE',
      body: trackIDs,
    };
    return this.request(payload);
  };

  /**
   * Checks if the current user's saved tracks contains a certain list of tracks.
   * @See [Check Current User's Saved Tracks](https://developer.spotify.com/web-api/check-users-saved-tracks/)
   * @param trackIDs - The ids of the tracks.
   */
  containsMySavedTracks = async (
    trackIDs: string[]
  ): Promise<SpotifyApi.CheckUsersSavedTracksResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/me/tracks/contains',
      params: { ids: trackIDs.join(',') },
    };
    return this.request(payload);
  };

  /**
   * Get a list of the albums saved in the current Spotify user's "Your Music" library.
   * @See [Get Current User's Saved Albums](https://developer.spotify.com/web-api/get-users-saved-albums/)
   */
  getMySavedAlbums = async (): Promise<SpotifyApi.UsersSavedAlbumsResponse> => {
    return this.request(this.url + '/me/albums');
  };

  /**
   * Save one or more albums to the current user's "Your Music" library.
   * @See [Save Albums for Current User](https://developer.spotify.com/web-api/save-albums-user/)
   * @param albumIDs - The ids of the albums.
   */
  addToMySavedAlbums = async (
    albumIDs: string[]
  ): Promise<SpotifyApi.SaveAlbumsForUserResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/me/albums',
      method: 'PUT',
      body: albumIDs,
    };
    return this.request(payload);
  };

  /**
   * Remove one or more albums from the current user's "Your Music" library.
   * @See [Remove Albums for Current User](https://developer.spotify.com/web-api/remove-albums-user/)
   * @param albumIDs - The ids of the albums.
   */
  removeFromMySavedAlbums = async (
    albumIDs: string[]
  ): Promise<SpotifyApi.RemoveAlbumsForUserResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/me/albums',
      method: 'DELETE',
      body: albumIDs,
    };
    return this.request(payload);
  };

  /**
   * Check if one or more albums is already saved in the current Spotify user's "Your Music" library.
   * @See [Check User's Saved Albums](https://developer.spotify.com/web-api/check-users-saved-albums/)
   * @param albumIDs - The ids of the albums.
   */
  containsMySavedAlbums = async (
    albumIDs: string[]
  ): Promise<SpotifyApi.CheckUserSavedAlbumsResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/me/albums/contains',
      params: { ids: albumIDs.join(',') },
    };
    return this.request(payload);
  };

  /**
   * Get the current user’s top artists based on calculated affinity.
   * @See [Get a User’s Top Artists](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/)
   */
  getMyTopArtists = async (): Promise<SpotifyApi.UsersTopArtistsResponse> => {
    return this.request(this.url + '/me/top/artists');
  };

  /**
   * Get the current user’s top tracks based on calculated affinity.
   * @See [Get a User’s Top Tracks](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/)
   */
  getMyTopTracks = async (): Promise<SpotifyApi.UsersTopTracksResponse> => {
    return this.request(this.url + '/me/top/tracks');
  };

  /**
   * Get tracks from the current user’s recently played tracks.
   * @See [Get Current User’s Recently Played Tracks](https://developer.spotify.com/web-api/web-api-personalization-endpoints/get-recently-played/)
   */
  getMyRecentlyPlayedTracks = async (): Promise<SpotifyApi.UsersRecentlyPlayedTracksResponse> => {
    return this.request(this.url + '/me/player/recently-played');
  };

  /**
   * Adds the current user as a follower of one or more other Spotify users.
   * @See [Follow Artists or Users](https://developer.spotify.com/web-api/follow-artists-users/)
   * @param userIDs - The ids of the users.
   */
  followUsers = async (userIDs: string[]): Promise<SpotifyApi.FollowArtistsOrUsersResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/me/following/',
      method: 'PUT',
      params: {
        ids: userIDs.join(','),
        type: 'user',
      },
    };
    return this.request(payload);
  };

  /**
   * Adds the current user as a follower of one or more artists.
   * @See [Follow Artists or Users](https://developer.spotify.com/web-api/follow-artists-users/)
   * @param artistIDs - The ids of the artists.
   */
  followArtists = async (artistIDs: string[]): Promise<SpotifyApi.FollowArtistsOrUsersResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/me/following/',
      method: 'PUT',
      params: {
        ids: artistIDs.join(','),
        type: 'artist',
      },
    };
    return this.request(payload);
  };

  /**
   * Add the current user as a follower of one playlist.
   * @See [Follow a Playlist](https://developer.spotify.com/web-api/follow-playlist/)
   * @param playlistID - The id of the playlist.
   */
  followPlaylist = async (playlistID: string): Promise<SpotifyApi.FollowPlaylistResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/playlists/' + playlistID + '/followers',
      method: 'PUT',
    };

    return this.request(payload);
  };

  /**
   * Removes the current user as a follower of one or more other Spotify users.
   * @See [Unfollow Artists or Users](https://developer.spotify.com/web-api/unfollow-artists-users/)
   * @param userIDs - The ids of the users.
   */
  unfollowUsers = async (userIDs: string[]): Promise<SpotifyApi.UnfollowArtistsOrUsersResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/me/following/',
      method: 'DELETE',
      params: {
        ids: userIDs.join(','),
        type: 'user',
      },
    };
    return this.request(payload);
  };

  /**
   * Removes the current user as a follower of one or more artists.
   * @See [Unfollow Artists or Users](https://developer.spotify.com/web-api/unfollow-artists-users/)
   * @param artistIDs - The ids of the artists.
   */
  unfollowArtists = async (
    artistIDs: string[]
  ): Promise<SpotifyApi.UnfollowArtistsOrUsersResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/me/following/',
      method: 'DELETE',
      params: {
        ids: artistIDs.join(','),
        type: 'artist',
      },
    };
    return this.request(payload);
  };

  /**
   * Remove the current user as a follower of one playlist.
   * @See [Unfollow a Playlist](https://developer.spotify.com/web-api/unfollow-playlist/)
   * @param playlistID - The id of the playlist.
   */
  unfollowPlaylist = async (playlistID: string): Promise<SpotifyApi.UnfollowPlaylistResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/playlists/' + playlistID + '/followers',
      method: 'DELETE',
    };
    return this.request(payload);
  };

  /**
   * Checks to see if the current user is following one or more other Spotify users.
   * @See [Check if Current User Follows Users or Artists](https://developer.spotify.com/web-api/check-current-user-follows/)
   * @param userIDs - The ids of the users.
   */
  isFollowingUsers = async (
    userIDs: string[]
  ): Promise<SpotifyApi.UserFollowsUsersOrArtistsResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/me/following/contains',

      params: {
        ids: userIDs.join(','),
        type: 'user',
      },
    };
    return this.request(payload);
  };

  /**
   * Checks to see if the current user is following one or more artists.
   * @See [Check if Current User Follows](https://developer.spotify.com/web-api/check-current-user-follows/)
   * @param artistIDs - The ids of the artists.
   */
  isFollowingArtists = async (
    artistIDs: string[]
  ): Promise<SpotifyApi.UserFollowsUsersOrArtistsResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/me/following/contains',

      params: {
        ids: artistIDs.join(','),
        type: 'artist',
      },
    };
    return this.request(payload);
  };

  /**
   * Check to see if one or more Spotify users are following a specified playlist.
   * @See [Check if Users Follow a Playlist](https://developer.spotify.com/web-api/check-user-following-playlist/)
   * @param playlistID - The id of the playlist.
   * @param userIDs - The ids of the users.
   */
  areFollowingPlaylist = async (
    playlistID: string,
    userIDs: string[]
  ): Promise<SpotifyApi.UsersFollowPlaylistResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/playlists/' + playlistID + '/followers/contains',

      params: {
        ids: userIDs.join(','),
      },
    };
    return this.request(payload);
  };

  /**
   * Get the current user's followed artists.
   * @See [Get User's Followed Artists](https://developer.spotify.com/web-api/get-followed-artists/)
   */
  getFollowedArtists = async (): Promise<SpotifyApi.UsersFollowedArtistsResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/me/following',

      params: {
        type: 'artist',
      },
    };
    return this.request(payload);
  };

  /**
   * Fetches information about a specific user.
   * @See [Get a User's Profile](https://developer.spotify.com/web-api/get-users-profile/)
   * @param userID - The id of the user.
   */
  getUser = async (userID: string): Promise<SpotifyApi.UserProfileResponse> => {
    return this.request(this.url + '/users/' + userID);
  };

  /**
   * Fetches a list of a user's playlists.
   * @See [Get a List of a User's Playlists](https://developer.spotify.com/web-api/get-list-users-playlists/)
   * @param userID -The id of the user.
   */
  getUserPlaylists = async (userID: string): Promise<SpotifyApi.ListOfUsersPlaylistsResponse> => {
    return this.request(this.url + '/users/' + encodeURIComponent(userID) + '/playlists');
  };

  /**
   * Fetches a list of the current user's playlists.
   * @See [Get a List of a User's Playlists](https://developer.spotify.com/web-api/get-list-users-playlists/)
   */
  getMyPlaylists = async (): Promise<SpotifyApi.ListOfUsersPlaylistsResponse> => {
    return this.request(this.url + '/me/playlists');
  };

  /**
   * Fetches a specific playlist.
   * @See [Get a Playlist](https://developer.spotify.com/web-api/get-playlist/)
   * @param playlistID - The id of the playlist.
   */
  getPlaylist = async (playlistID: string): Promise<SpotifyApi.SinglePlaylistResponse> => {
    return this.request(this.url + '/playlists/' + playlistID);
  };

  /**
   * Fetches the tracks from a specific playlist.
   * @See [Get a Playlist's Tracks](https://developer.spotify.com/web-api/get-playlists-tracks/)
   * @param playlistID - The id of the playlist.
   */
  getPlaylistTracks = async (playlistID: string): Promise<SpotifyApi.PlaylistTrackResponse> => {
    return this.request(this.url + '/playlists/' + playlistID + '/tracks');
  };

  /**
   * Gets the current image associated with a specific playlist.
   * @See [Get a Playlist Cover Image](https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlist-cover/)
   * @param playlistID - The id of the playlist.
   */
  getPlaylistCoverImage = async (
    playlistID: string
  ): Promise<SpotifyApi.PlaylistCoverImageResponse> => {
    return this.request(this.url + '/playlists/' + playlistID + '/images');
  };

  /**
   * Creates a playlist and stores it in the current user's library.
   * @See [Create a Playlist](https://developer.spotify.com/web-api/create-playlist/)
   * @param userID - The id of the user.
   * @param options - Options for playlist creation.
   */
  createPlaylist = async (
    userID: string,
    options: PlaylistOptions
  ): Promise<SpotifyApi.CreatePlaylistResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/users/' + encodeURIComponent(userID) + '/playlists',
      method: 'POST',
      body: { ...options },
    };
    return this.request(payload);
  };

  /**
   * Change a playlist's name and public/private state
   * @See [Change a Playlist's Details](https://developer.spotify.com/web-api/change-playlist-details/)
   * @param playlistID - The id of the playlist.
   * @param options - The options for changing the playlist details.
   */
  changePlaylistDetails = async (
    playlistID: string,
    options: PlaylistOptions
  ): Promise<SpotifyApi.ChangePlaylistDetailsResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/playlists/' + playlistID,
      method: 'PUT',
      body: { ...options },
    };
    return this.request(payload);
  };

  /**
   * Add items to a playlist.
   * @See [Add Items to a Playlist](https://developer.spotify.com/web-api/add-tracks-to-playlist/)
   * @param playlistID - The id of the playlist.
   * @param itemURIs - A list of Spotify URIs for the items to be added.
   */
  addToPlaylist = async (
    playlistID: string,
    itemURIs: SpotifyURI[]
  ): Promise<SpotifyApi.AddTracksToPlaylistResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/playlists/' + playlistID + '/tracks',
      method: 'POST',
      body: {
        uris: itemURIs,
      },
    };
    return this.request(payload);
  };

  /**
   * Add tracks to a playlist.
   * @See [Add Tracks to a Playlist](https://developer.spotify.com/web-api/add-tracks-to-playlist/)
   * @see {@link addToPlaylist} for adding any items.
   * @remarks This method is a convenience method for {@link addToPlaylist}.
   * @param playlistID - The id of the playlist.
   * @param trackURIs - A list of Spotify URIs for the tracks.
   */
  addTracksToPlaylist = async (
    playlistID: string,
    trackURIs: SpotifyURI[]
  ): Promise<SpotifyApi.AddTracksToPlaylistResponse> => {
    return this.addToPlaylist(playlistID, trackURIs);
  };

  /**
   * Add tracks to a playlist using Spotify IDs.
   * @See [Add Tracks to a Playlist](https://developer.spotify.com/web-api/add-tracks-to-playlist/)
   * @see {@link addTracksToPlaylist} for adding tracks using Spotify URIs.
   * @see {@link addToPlaylist} for adding any items.
   * @remarks This method is a convenience method for {@link addToPlaylist}.
   * @param playlistID - The id of the playlist.
   * @param trackIDs - A list of Spotify IDs for the tracks.
   */
  addTracksToPlaylistWithIDs = async (
    playlistID: string,
    trackIDs: SpotifyURI[]
  ): Promise<SpotifyApi.AddTracksToPlaylistResponse> => {
    const trackURIs = createURIs('track', trackIDs);
    return this.addToPlaylist(playlistID, trackURIs);
  };

  /**
   * Remove all items from a playlist
   * @See [Replace a Playlist's Tracks](https://developer.spotify.com/web-api/replace-playlists-tracks/)
   * @param playlistID - The id of the playlist.
   */
  clearPlaylist = async (playlistID: string): Promise<SpotifyApi.ReplacePlaylistTracksResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/playlists/' + playlistID + '/tracks',
      method: 'PUT',
    };
    return this.request(payload);
  };

  /**
   * Replace the items in a playlist with a list of items.
   * @See [Replace a Playlist's Tracks](https://developer.spotify.com/web-api/replace-playlists-tracks/)
   * @param playlistID - The id of the playlist.
   * @param itemURIs - A list of Spotify URIs for the items
   */
  replacePlaylistItems = async (
    playlistID: string,
    itemURIs: string[]
  ): Promise<SpotifyApi.ReplacePlaylistTracksResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/playlists/' + playlistID + '/tracks',
      method: 'PUT',
      body: { uris: itemURIs },
    };
    return this.request(payload);
  };

  /**
   * Replace the items in a playlist with a list of tracks.
   * @See [Replace a Playlist's Tracks](https://developer.spotify.com/web-api/replace-playlists-tracks/)
   * @see {@link replacePlaylist} for replacing with any items.
   * @remarks This method is a convenience method for {@link replaceInPlaylist}.
   * @param playlistID - The id of the playlist.
   * @param trackURIs - A list of Spotify URIs for the tracks
   */
  replacePlaylistItemsWithTracks = async (
    playlistID: string,
    trackURIs: string[]
  ): Promise<SpotifyApi.ReplacePlaylistTracksResponse> => {
    return this.replacePlaylistItems(playlistID, trackURIs);
  };

  /**
   * Replace the tracks of a playlist
   * @See [Replace a Playlist's Tracks](https://developer.spotify.com/web-api/replace-playlists-tracks/)
   * @see {@link replacePlaylistItems} for replacing tracks using Spotify URIs.
   * @see {@link replacePlaylistItems} for replacing any items.
   * @remarks This method is a convenience method for {@link replacePlaylistItems}.
   * @param playlistID - The id of the playlist.
   * @param trackURIs - A list of Spotify URIs for the tracks
   */
  replacePlaylistItemsWithTrackIDs = async (
    playlistID: string,
    trackIDs: SpotifyID[]
  ): Promise<SpotifyApi.ReplacePlaylistTracksResponse> => {
    const trackURIs = createURIs('track', trackIDs);
    return this.replacePlaylistItems(playlistID, trackURIs);
  };

  /**
   * Reorder items in a playlist
   * @See [Reorder a Playlist’s Tracks](https://developer.spotify.com/web-api/reorder-playlists-tracks/)
   * @param playlistID - The id of the playlist.
   * @param rangeStart - The position of the first track to be reordered.
   * @param insertBefore - The position where the tracks should be inserted. To reorder the tracks to
   * the end of the playlist, simply set insert_before to the position after the last track.
   * @param snapshotID - The playlist’s snapshot ID against which you want to make the changes.
   */
  reorderItemsInPlaylist = async (
    playlistID: string,
    rangeStart: number,
    insertBefore: number,
    rangeLength?: number,
    snapshotID?: number
  ): Promise<SpotifyApi.ReorderPlaylistTracksResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/playlists/' + playlistID + '/tracks',
      method: 'PUT',
      body: {
        range_start: rangeStart,
        insert_before: insertBefore,
        range_length: rangeLength,
        snapshot_id: snapshotID,
      },
    };
    return this.request(payload);
  };

  /**
   * Remove items from a playlist
   * @See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/)
   * @param playlistID - The id of the playlist.
   * @param itemURIs - A list of items to be removed.
   */
  removeFromPlaylist = async (
    playlistID: string,
    itemURIs: SpotifyURI[]
  ): Promise<SpotifyApi.RemoveTracksFromPlaylistResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/playlists/' + playlistID + '/tracks',
      method: 'DELETE',
      body: {
        tracks: itemURIs.map((itemURI: SpotifyURI) => {
          return { uri: itemURI };
        }),
      },
    };
    return this.request(payload);
  };

  /**
   * Remove tracks from a playlist.
   * @See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/)
   * @see {@link removeFromPlaylist} for removing any items.
   * @remarks This method is a convenience method for {@link removeFromPlaylist}.
   * @param playlistID - The id of the playlist.
   * @param trackURIs - A list of tracks to be removed.
   */
  removeTracksFromPlaylist = async (
    playlistID: string,
    trackURIs: SpotifyURI[]
  ): Promise<SpotifyApi.RemoveTracksFromPlaylistResponse> => {
    return this.removeFromPlaylist(playlistID, trackURIs);
  };

  /**
   * Remove tracks from a playlist.
   * @See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/)
   * @see {@link removeFromPlaylist} for removing any items.
   * @remarks This method is a convenience method for {@link removeFromPlaylist}.
   * @param playlistID - The id of the playlist.
   * @param trackIDs - A list of tracks to be removed.
   */
  removeTracksFromPlaylistWithIDs = async (
    playlistID: string,
    trackIDs: SpotifyID[]
  ): Promise<SpotifyApi.RemoveTracksFromPlaylistResponse> => {
    return this.removeFromPlaylist(playlistID, trackIDs);
  };

  /**
   * Remove tracks from a playlist, specifying a snapshot id.
   * @See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/)
   * @param playlistID - The id of the playlist.
   * @param itemURIs - A list of tracks to be removed.
   * @param snapshotID - The playlist's snapshot ID against which you want to make the changes
   */
  removeItemsFromPlaylistWithSnapshotID = async (
    playlistID: string,
    itemURIs: string[],
    snapshotID: string
  ): Promise<SpotifyApi.RemoveTracksFromPlaylistResponse> => {
    const dataToBeSent = itemURIs.map(function (uri) {
      return { uri: uri };
    });
    const payload: SpotifyRequestOptions = {
      url: this.url + '/playlists/' + playlistID + '/tracks',
      method: 'DELETE',
      body: {
        tracks: dataToBeSent,
        snapshot_id: snapshotID,
      },
    };
    return this.request(payload);
  };

  /**
   * Remove items from a playlist, specifying the positions of the items to be removed.
   * @See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/)
   * @param playlistID - The id of the playlist.
   * @param positions - A list of integers containing the positions of the items to remove
   * from the playlist.
   * @param snapshotID - The playlist's snapshot ID against which you want to make the changes
   */
  removeFromPlaylistInPositions = async (
    playlistID: string,
    positions: number[],
    snapshotID: string
  ): Promise<SpotifyApi.RemoveTracksFromPlaylistResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/playlists/' + playlistID + '/tracks',
      method: 'DELETE',
      body: {
        positions: positions,
        snapshot_id: snapshotID,
      },
    };
    return this.request(payload);
  };

  /**
   * Upload a custom playlist cover image.
   * @See [Upload A Custom Playlist Cover Image](https://developer.spotify.com/web-api/upload-a-custom-playlist-cover-image/)
   * @param playlistID - The id of the playlist.
   * @param imageData - Base64 encoded JPEG image data, maximum payload size is 256 KB.
   */
  uploadCustomPlaylistCoverImage = async (
    playlistID: string,
    imageData: string
  ): Promise<SpotifyApi.UploadCustomPlaylistCoverImageResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/playlists/' + playlistID + '/images',
      method: 'PUT',
      body: imageData.replace(/^data:image\/jpeg;base64,/, ''),
      contentType: 'image/jpeg',
    };
    return this.request(payload);
  };

  /**
   * Fetches an album from the Spotify catalog.
   * @See [Get an Album](https://developer.spotify.com/web-api/get-album/)
   * @param albumID - The id of the album.
   */
  getAlbum = async (albumID: string): Promise<SpotifyApi.SingleAlbumResponse> => {
    return this.request(this.url + '/albums/' + albumID);
  };

  /**
   * Fetches the tracks of an album from the Spotify catalog.
   * @See [Get an Album's Tracks](https://developer.spotify.com/web-api/get-albums-tracks/)
   * @param albumID - The id of the album.
   */
  getAlbumTracks = async (albumID: string): Promise<SpotifyApi.AlbumTracksResponse> => {
    return this.request(this.url + '/albums/' + albumID + '/tracks');
  };

  /**
   * Fetches multiple albums from the Spotify catalog.
   * @See [Get Several Albums](https://developer.spotify.com/web-api/get-several-albums/)
   * @param albumIDs - The ids of the albums.
   */
  getAlbums = async (albumIDs: string[]): Promise<SpotifyApi.MultipleAlbumsResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/albums/',
      params: { ids: albumIDs.join(',') },
    };
    return this.request(payload);
  };

  /**
   * Fetches a track from the Spotify catalog.
   * @See [Get a Track](https://developer.spotify.com/web-api/get-track/)
   * @param trackID - The id of the track.
   */
  getTrack = async (trackID: string): Promise<SpotifyApi.SingleTrackResponse> => {
    return this.request(this.url + '/tracks/' + trackID);
  };

  /**
   * Fetches multiple tracks from the Spotify catalog.
   * @See [Get Several Tracks](https://developer.spotify.com/web-api/get-several-tracks/)
   * @param trackIDs - The ids of the tracks.
   */
  getTracks = async (trackIDs: string[]): Promise<SpotifyApi.MultipleTracksResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/tracks/',
      params: { ids: trackIDs.join(',') },
    };
    return this.request(payload);
  };

  /**
   * Fetches an artist from the Spotify catalog.
   * @See [Get an Artist](https://developer.spotify.com/web-api/get-artist/)
   * @param artistID - The id of the artist.
   */
  getArtist = async (artistID: string): Promise<SpotifyApi.SingleArtistResponse> => {
    return this.request(this.url + '/artists/' + artistID);
  };

  /**
   * Fetches multiple artists from the Spotify catalog.
   * @See [Get Several Artists](https://developer.spotify.com/web-api/get-several-artists/)
   * @param artistIDs - The ids of the artists.
   */
  getArtists = async (artistIDs: string[]): Promise<SpotifyApi.MultipleArtistsResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/artists/',
      params: { ids: artistIDs.join(',') },
    };
    return this.request(payload);
  };

  /**
   * Fetches the albums of an artist from the Spotify catalog.
   * @See [Get an Artist's Albums](https://developer.spotify.com/web-api/get-artists-albums/)
   * @param artistID - The id of the artist.
   */
  getArtistAlbums = async (artistID: string): Promise<SpotifyApi.ArtistsAlbumsResponse> => {
    return this.request(this.url + '/artists/' + artistID + '/albums');
  };

  /**
   * Fetches a list of top tracks of an artist from the Spotify catalog, for a specific country.
   * @See [Get an Artist's Top Tracks](https://developer.spotify.com/web-api/get-artists-top-tracks/)
   * @param artistID - The id of the artist. If you know the Spotify URI it is easy
   * to find the
   * @param countryID - The id of the country (e.g. ES for Spain or US for United States)
   */
  getArtistTopTracks = async (
    artistID: string,
    countryID: string
  ): Promise<SpotifyApi.ArtistsTopTracksResponse> => {
    // TODO: restrict countryID to code format.
    const payload: SpotifyRequestOptions = {
      url: this.url + '/artists/' + artistID + '/top-tracks',
      params: { country: countryID },
    };
    return this.request(payload);
  };

  /**
   * Fetches a list of artists related with a given one from the Spotify catalog.
   * @See [Get an Artist's Related Artists](https://developer.spotify.com/web-api/get-related-artists/)
   * @param artistID - The id of the artist.
   */
  getArtistRelatedArtists = async (
    artistID: string
  ): Promise<SpotifyApi.ArtistsRelatedArtistsResponse> => {
    return this.request(this.url + '/artists/' + artistID + '/related-artists');
  };

  /**
   * Fetches a list of Spotify featured playlists (shown, for example, on a Spotify player's "Browse" tab).
   * @See [Get a List of Featured Playlists](https://developer.spotify.com/web-api/get-list-featured-playlists/)
   */
  getFeaturedPlaylists = async (): Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse> => {
    return this.request(this.url + '/browse/featured-playlists');
  };

  /**
   * Fetches a list of new album releases featured in Spotify (shown, for example, on a Spotify player's "Browse" tab).
   * @See [Get a List of New Releases](https://developer.spotify.com/web-api/get-list-new-releases/)
   */
  getNewReleases = async (): Promise<SpotifyApi.ListOfNewReleasesResponse> => {
    return this.request(this.url + '/browse/new-releases');
  };

  /**
   * Get a list of categories used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
   * @See [Get a List of Categories](https://developer.spotify.com/web-api/get-list-categories/)
   */
  getCategories = async (): Promise<SpotifyApi.MultipleCategoriesResponse> => {
    return this.request(this.url + '/browse/categories');
  };

  /**
   * Get a single category used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
   * @See [Get a Category](https://developer.spotify.com/web-api/get-category/)
   * @param categoryID - The id of the category. These can be found with the {@link getCategories} function.
   */
  getCategory = async (categoryID: string): Promise<SpotifyApi.SingleCategoryResponse> => {
    return this.request(this.url + '/browse/categories/' + categoryID);
  };

  /**
   * Get a list of Spotify playlists tagged with a particular category.
   * @See [Get a Category's Playlists](https://developer.spotify.com/web-api/get-categorys-playlists/)
   * @param categoryID - The id of the category. These can be found with the  {@link getCategories} function.
   */
  getCategoryPlaylists = async (
    categoryID: string
  ): Promise<SpotifyApi.CategoryPlaylistsResponse> => {
    return this.request(this.url + '/browse/categories/' + categoryID + '/playlists');
  };

  /**
   * Get Spotify catalog information about artists, albums, tracks or playlists that match a keyword string.
   * @See [Search for an Item](https://developer.spotify.com/web-api/search-item/)
   * @param query - The search query
   * @param types - A list of item types to search across. Valid types are: 'album', 'artist', 'playlist', and 'track'.
   */
  // TODO: Restrict return types to valid types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search = async (query: string, types: string[]): Promise<any> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/search/',
      params: {
        q: query,
        type: types.join(','),
      },
    };
    return this.request(payload);
  };

  /**
   * Fetches albums from the Spotify catalog according to a query.
   * @See [Search for an Item](https://developer.spotify.com/web-api/search-item/)
   * @param query - The search query
   */
  searchAlbums = async (query: string): Promise<SpotifyApi.AlbumSearchResponse> => {
    return this.search(query, ['album']);
  };

  /**
   * Fetches artists from the Spotify catalog according to a query.
   * @See [Search for an Item](https://developer.spotify.com/web-api/search-item/)
   * @param query - The search query
   */
  searchArtists = async (query: string): Promise<SpotifyApi.ArtistSearchResponse> => {
    return this.search(query, ['artist']);
  };

  /**
   * Fetches tracks from the Spotify catalog according to a query.
   * @See [Search for an Item](https://developer.spotify.com/web-api/search-item/)
   * @param query - The search query
   */
  searchTracks = async (query: string): Promise<SpotifyApi.TrackSearchResponse> => {
    return this.search(query, ['track']);
  };

  /**
   * Fetches playlists from the Spotify catalog according to a query.
   * @See [Search for an Item](https://developer.spotify.com/web-api/search-item/)
   * @param query - The search query
   */
  searchPlaylists = async (query: string): Promise<SpotifyApi.PlaylistSearchResponse> => {
    return this.search(query, ['playlist']);
  };

  /**
   * Fetches shows from the Spotify catalog according to a query.
   * @See [Search for an Item](https://developer.spotify.com/web-api/search-item/)
   * @param query - The search query
   */
  searchShows = async (query: string): Promise<SpotifyApi.ShowSearchResponse> => {
    return this.search(query, ['show']);
  };

  /**
   * Fetches episodes from the Spotify catalog according to a query.
   * @See [Search for an Item](https://developer.spotify.com/web-api/search-item/)
   * @param query - The search query
   */
  searchEpisodes = async (query: string): Promise<SpotifyApi.EpisodeSearchResponse> => {
    return this.search(query, ['episode']);
  };

  /**
   * Get audio features for a single track identified by its unique Spotify ID.
   * @See [Get Audio Features for a Track](https://developer.spotify.com/web-api/get-audio-features/)
   * @param trackID - The id of the track.
   */
  getAudioFeaturesForTrack = async (trackID: string): Promise<SpotifyApi.AudioFeaturesResponse> => {
    return this.request(this.url + '/audio-features/' + trackID);
  };

  /**
   * Get audio features for multiple tracks based on their Spotify IDs.
   * @See [Get Audio Features for Several Tracks](https://developer.spotify.com/web-api/get-several-audio-features/)
   * @param trackIDs - The ids of the tracks.
   */
  getAudioFeaturesForTracks = async (
    trackIDs: string[]
  ): Promise<SpotifyApi.MultipleAudioFeaturesResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/audio-features',
      params: { ids: trackIDs },
    };
    return this.request(payload);
  };

  /**
   * Get audio analysis for a single track identified by its unique Spotify ID.
   * @See [Get Audio Analysis for a Track](https://developer.spotify.com/web-api/get-audio-analysis/)
   * @param trackID - The id of the track.
   */
  getAudioAnalysisForTrack = async (trackID: string): Promise<SpotifyApi.AudioAnalysisTrack> => {
    return this.request(this.url + '/audio-analysis/' + trackID);
  };

  /**
   * Create a playlist-style listening experience based on seed artists, tracks and genres.
   * @See [Get Recommendations Based on Seeds](https://developer.spotify.com/web-api/get-recommendations/)
   * @param options - An object with optional keys limit, market, min_*, etc...
   */
  getRecommendations = async (
    options: SpotifyApi.RecommendationsOptionsObject
  ): Promise<SpotifyApi.RecommendationsFromSeedsResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/recommendations',
      params: { ...options },
    };
    return this.request(payload);
  };

  /**
   * Retrieve a list of available genres seed parameter values for recommendations.
   * @See [Available Genre Seeds](https://developer.spotify.com/web-api/get-recommendations/#available-genre-seeds)
   */
  getAvailableGenreSeeds = async (): Promise<SpotifyApi.AvailableGenreSeedsResponse> => {
    return this.request(this.url + '/recommendations/available-genre-seeds');
  };

  /**
   * Get information about a user’s available devices.
   * @See [Get a User’s Available Devices](https://developer.spotify.com/web-api/get-a-users-available-devices/)
   */
  getMyDevices = async (): Promise<SpotifyApi.UserDevicesResponse> => {
    return this.request(this.url + '/me/player/devices');
  };

  /**
   * Get information about the user’s current playback state, including track, track progress, and active device.
   * @See [Get Information About The User’s Current Playback](https://developer.spotify.com/web-api/get-information-about-the-users-current-playback/)
   */
  getMyCurrentPlaybackState = async (): Promise<SpotifyApi.CurrentPlaybackResponse> => {
    return this.request(this.url + '/me/player');
  };

  /**
   * Get the object currently being played on the user’s Spotify account.
   * @See [Get the User’s Currently Playing Track](https://developer.spotify.com/web-api/get-the-users-currently-playing-track/)
   */
  getMyCurrentPlayingTrack = async (): Promise<SpotifyApi.CurrentlyPlayingResponse> => {
    return this.request(this.url + '/me/player/currently-playing');
  };

  /**
   * Transfer playback to a new device and determine if it should start playing.
   * @See [Transfer a User’s Playback](https://developer.spotify.com/web-api/transfer-a-users-playback/)
   * @param deviceID - The ID of the device on which playback should be started/transferred.
   */
  // TODO: Refer to Spotify API docs for proper request and ensure it works.
  transferMyPlayback = async (deviceID: string): Promise<any> => {
    const payload: SpotifyRequestOptions = {
      method: 'PUT',
      url: this.url + '/me/player',
      body: {
        device_ids: [deviceID],
      },
    };
    return this.request(payload);
  };

  /**
   * Play a track on the user's active device
   * @See [Start/Resume a User's Playback](https://developer.spotify.com/documentation/web-api/reference/player/start-a-users-playback/)
   * @param options - An object with options that can be passed.
   */
  play = async (options: PlayOptions): Promise<any> => {
    const payload: SpotifyRequestOptions = {
      method: 'PUT',
      url: this.url + '/me/player/play',
      params: { device_id: options.device_id },
      body: {
        context_uri: options.context_uri,
        uris: options.uris,
        offset: options.offset,
        position_ms: options.position_ms,
      },
    };
    return this.request(payload);
  };

  /**
   * Add an item to the end of the user’s current playback queue.
   * @See [Add an Item to the User's Playback Queue](https://developer.spotify.com/documentation/web-api/reference/player/add-to-queue/)
   * @param uri - The uri of the item to add to the queue. Must be a track or an episode uri.
   * @param options - A JSON object with options that can be passed.
   */
  queue = async (uri: string, options: DeviceOptions): Promise<SpotifyApi.AddToQueueResponse> => {
    const params =
      'device_id' in options ? { uri: uri, device_id: options.device_id } : { uri: uri };
    const payload: SpotifyRequestOptions = {
      method: 'POST',
      url: this.url + '/me/player/queue',
      params,
    };
    return this.request(payload);
  };

  /**
   * Pause playback on the user’s account.
   * @See [Pause a User’s Playback](https://developer.spotify.com/web-api/pause-a-users-playback/)
   * @param options - An object with options that can be passed.
   */
  pause = async (options: DeviceOptions): Promise<any> => {
    const payload: SpotifyRequestOptions = {
      method: 'PUT',
      url: this.url + '/me/player/pause',
      params: 'device_id' in options ? { device_id: options.device_id } : undefined,
    };
    return this.request(payload);
  };

  /**
   * Skips to next track in the user’s queue.
   * @See [Skip User’s Playback To Next Track](https://developer.spotify.com/web-api/skip-users-playback-to-next-track/)
   * @param options - An object with options that can be passed.
   */
  skipToNext = async (options: DeviceOptions): Promise<any> => {
    const payload: SpotifyRequestOptions = {
      method: 'POST',
      url: this.url + '/me/player/next',
      params: 'device_id' in options ? { device_id: options.device_id } : undefined,
    };
    return this.request(payload);
  };

  /**
   * Skips to previous track in the user’s queue.
   * Note that this will ALWAYS skip to the previous track, regardless of the current track’s progress.
   * Returning to the start of the current track should be performed using `.seek()`
   * @See [Skip User’s Playback To Previous Track](https://developer.spotify.com/web-api/skip-users-playback-to-next-track/)
   * @param options - An object with options that can be passed.
   */
  skipToPrevious = async (options: DeviceOptions): Promise<any> => {
    const payload: SpotifyRequestOptions = {
      method: 'POST',
      url: this.url + '/me/player/previous',
      params: 'device_id' in options ? { device_id: options.device_id } : undefined,
    };
    return this.request(payload);
  };

  /**
   * Seeks to the given position in the user’s currently playing track.
   * @See [Seek To Position In Currently Playing Track](https://developer.spotify.com/web-api/seek-to-position-in-currently-playing-track/)
   * @param position_ms - The position in milliseconds to seek to. Must be a positive number.
   * @param options - An object with options that can be passed.
   */
  seek = async (position_ms: number, options: SeekOptions): Promise<any> => {
    const params = {
      position_ms: position_ms,
      device_id: options.device_id,
    };
    const payload: SpotifyRequestOptions = {
      method: 'PUT',
      url: this.url + '/me/player/seek',
      params,
    };
    return this.request(payload);
  };

  /**
   * Set the repeat mode for the user’s playback. Options are repeat-track, repeat-context, and off.
   * @See [Set Repeat Mode On User’s Playback](https://developer.spotify.com/web-api/set-repeat-mode-on-users-playback/)
   * @param state - A string set to 'track', 'context' or 'off'.
   * @param options - An object with options that can be passed.
   */
  setRepeat = async (state: string, options: SetRepeatOptions): Promise<any> => {
    const params = {
      state: state,
      device_id: options.device_id,
    };
    const payload: SpotifyRequestOptions = {
      method: 'PUT',
      url: this.url + '/me/player/repeat',
      params,
    };
    return this.request(payload);
  };

  /**
   * Set the volume for the user’s current playback device.
   * @See [Set Volume For User’s Playback](https://developer.spotify.com/web-api/set-volume-for-users-playback/)
   * @param volume_percent - The volume to set. Must be a value from 0 to 100 inclusive.
   * @param options - An object with options that can be passed.
   */
  setVolume = async (volume_percent: number, options: SetVolumeOptions): Promise<any> => {
    const params = {
      volume_percent: volume_percent,
      device_id: options.device_id,
    };
    const payload: SpotifyRequestOptions = {
      method: 'PUT',
      url: this.url + '/me/player/volume',
      params,
    };
    return this.request(payload);
  };

  /**
   * Toggle shuffle on or off for user’s playback.
   * @See [Toggle Shuffle For User’s Playback](https://developer.spotify.com/web-api/toggle-shuffle-for-users-playback/)
   * @param state - Whether or not to shuffle user's playback.
   * @param options - An object with options that can be passed.
   */
  setShuffle = async (state: boolean, options: SetShuffleOptions): Promise<any> => {
    const params = {
      state: state,
      device_id: options.device_id,
    };
    const payload: SpotifyRequestOptions = {
      method: 'PUT',
      url: this.url + '/me/player/shuffle',
      params,
    };
    return this.request(payload);
  };

  /**
   * Fetches a show from the Spotify catalog.
   * @See [Get a Show](https://developer.spotify.com/documentation/web-api/reference/shows/get-a-show/)
   * @param showID - The id of the show.
   */
  getShow = async (showID: string, market?: string): Promise<SpotifyApi.SingleShowResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/shows/' + showID,
      params: { market: market ?? 'ES' },
    };
    return this.request(payload);
  };

  /**
   * Fetches multiple shows from the Spotify catalog.
   * @See [Get Several Shows](https://developer.spotify.com/documentation/web-api/reference/shows/get-several-shows/)
   * @param showIDs - The ids of the shows.
   */
  getShows = async (
    showIDs: string[],
    market?: string
  ): Promise<SpotifyApi.MultipleShowsResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/shows/',
      params: { ids: showIDs.join(','), market: market ?? 'ES' },
    };
    return this.request(payload);
  };

  /**
   * Fetches current user's saved shows.
   * @See [Get Current User's Saved Shows](https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-shows/)
   */
  getMySavedShows = async (): Promise<SpotifyApi.UsersSavedShowsResponse> => {
    return this.request(this.url + '/me/shows');
  };

  /**
   * Adds a list of shows to the current user's saved shows.
   * @See [Save Shows for Current User](https://developer.spotify.com/documentation/web-api/reference/library/save-shows-user/)
   * @param showIDs - The ids of the shows.
   */
  addToMySavedShows = async (showIDs: string[]): Promise<SpotifyApi.SaveShowsForUserResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/me/shows',
      method: 'PUT',
      body: showIDs,
    };
    return this.request(payload);
  };

  /**
   * Remove a list of shows from the current user's saved shows.
   * @See [Remove Shows for Current User](https://developer.spotify.com/documentation/web-api/reference/library/remove-shows-user/)
   * @param showIDs - The ids of the shows.
   */
  removeFromMySavedShows = async (
    showIDs: string[]
  ): Promise<SpotifyApi.RemoveShowsForUserResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/me/shows',
      method: 'DELETE',
      body: showIDs,
    };
    return this.request(payload);
  };

  /**
   * Checks if the current user's saved shows contains a certain list of shows.
   * @See [Check Current User's Saved Shows](https://developer.spotify.com/documentation/web-api/reference/library/check-users-saved-shows/)
   * @param showIDs - The ids of the shows.
   */
  containsMySavedShows = async (
    showIDs: string[]
  ): Promise<SpotifyApi.CheckUserSavedShowsResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/me/shows/contains',
      params: { ids: showIDs.join(',') },
    };
    return this.request(payload);
  };

  /**
   * Fetches the episodes of a show from the Spotify catalog.
   * @See [Get a Show's Episodes](https://developer.spotify.com/documentation/web-api/reference/shows/get-shows-episodes/)
   * @param showID - The id of the show.
   */
  getShowEpisodes = async (
    showID: string,
    market?: string
  ): Promise<SpotifyApi.ShowEpisodesResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/shows/' + showID + '/episodes',
      params: { market: market ?? 'ES' },
    };
    return this.request(payload);
  };

  /**
   * Fetches an episode from the Spotify catalog.
   * @See [Get an Episode](https://developer.spotify.com/documentation/web-api/reference/episodes/get-an-episode/)
   * @param episodeID - The id of the episode.
   */
  getEpisode = async (
    episodeID: string,
    market?: string
  ): Promise<SpotifyApi.SingleEpisodeResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/episodes/' + episodeID,
      params: { market: market ?? 'ES' },
    };
    return this.request(payload);
  };

  /**
   * Fetches multiple episodes from the Spotify catalog.
   * @See [Get Several Episodes](https://developer.spotify.com/documentation/web-api/reference/episodes/get-several-episodes/)
   * @param episodeIDs - The ids of the episodes.
   */
  getEpisodes = async (
    episodeIDs: string[],
    market?: string
  ): Promise<SpotifyApi.MultipleEpisodesResponse> => {
    const payload: SpotifyRequestOptions = {
      url: this.url + '/episodes/',
      params: { ids: episodeIDs.join(','), market: market ?? 'ES' },
    };
    return this.request(payload);
  };
}

/**
 * A class for the Spotify Web API authorization flow and authorization management.
 */
export class Auth {
  private accessToken?: string;
  private accessTokenExpireDate?: Date;
  public refreshExpiredAccessToken: boolean;
  private clientID?: string;
  private clientSecret?: string;
  private scopes?: SpotifyScope[];
  private fetch: Fetch;
  /**
   * Creates a new Auth instance.
   * @param customFetch - Custom fetch function. If not provided, the global fetch function will be used.
   * @param options - Options for the auth class.
   */
  constructor(customFetch: Fetch, options?: AuthOptions) {
    const {
      accessToken,
      accessTokenExpiresAt,
      accessTokenExpiresIn,
      refreshExpiredAccessToken,
      clientID,
      clientSecret,
      scopes,
    } = options || {};
    this.accessToken = accessToken;
    if (accessTokenExpiresAt) {
      this.accessTokenExpireDate = accessTokenExpiresAt;
    } else if (accessTokenExpiresIn) {
      const now = new Date();
      this.accessTokenExpireDate = new Date(now.getTime() + accessTokenExpiresIn * 1000);
    }
    this.refreshExpiredAccessToken = refreshExpiredAccessToken ?? true;
    this.clientID = clientID;
    this.clientSecret = clientSecret;
    this.scopes = scopes;
    this.fetch = customFetch;
  }
  /**
   * Sets the access token to be used.
   * @See [The Authorization Guide](https://developer.spotify.com/web-api/authorization-guide/)
   * @param accessToken - The access token
   * @param expiresIn - The time in seconds until the token expires
   */
  setAccessToken = (accessToken: string, expiresIn?: number): void => {
    this.accessToken = accessToken;
    if (!expiresIn) return;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresIn * 1000);
    this.setAccessTokenExpireDate(expiresAt);
  };

  /**
   * Get the currently set access token.
   */
  getAccessToken = (): string | undefined => {
    return this.accessToken;
  };

  /**
   * Get if an access token is set.
   */
  hasAccessToken = (): boolean => {
    return !!this.accessToken;
  };

  /**
   * Refreshes the access token using the given method or if no method is given, the detected method.
   */
  refreshAccessToken = async (method?: SpotifyAuthMethods): Promise<void> => {
    const authMethod = method ?? this.detectAuthMethod();
    switch (authMethod) {
      case 'client_credentials':
        await this.clientCredentialsGrant();
        break;

      case 'authorization_code':
        throw new Error('Authorization code grant is not supported yet');

      case 'implicit_grant':
        throw new Error('Implicit grant is not supported yet');

      default:
        throw new Error('No valid auth method provided');
    }
  };

  /**
   * Detect the set auth method.
   */
  detectAuthMethod = (): SpotifyAuthMethods => {
    if (this.clientID && this.clientSecret) {
      return 'client_credentials';
    }
    return 'authorization_code';
  };

  /**
   * Clears the set access token.
   */
  clearAccessToken = (): void => {
    this.accessToken = undefined;
    this.accessTokenExpireDate = undefined;
  };

  /**
   * Set the access token expire date.
   * @param expiresAt - The date object representing when the set access token expires.
   */
  setAccessTokenExpireDate = (expiresAt: Date): void => {
    this.accessTokenExpireDate = expiresAt;
  };

  /**
   * Get the access token expire date.
   */
  getAccessTokenExpireDate = (): Date | undefined => {
    return this.accessTokenExpireDate;
  };

  /**
   * Get if the access token is expired.
   * @remarks
   * If no access token is set, this will return false.
   */
  isAccessTokenExpired = (): boolean => {
    if (!this.accessTokenExpireDate) return false;
    const now = new Date();
    return this.accessTokenExpireDate < now;
  };

  /**
   * Set the client ID.
   * @param clientID - The client ID of your application.
   */
  setClientID = (clientID: string): void => {
    this.clientID = clientID;
  };

  /**
   * Get if the client ID is set.
   */
  hasClientID = (): boolean => {
    return !!this.clientID;
  };

  /**
   * Set the client secret.
   * @param clientSecret - The client secret of your application.
   */
  setClientSecret = (clientSecret: string): void => {
    this.clientSecret = clientSecret;
  };

  /**
   * Get if the client secret is set.
   */
  hasClientSecret = (): boolean => {
    return !!this.clientSecret;
  };

  /**
   * Make a request to the Spotify API using the client credentials grant flow and set the access token if one is returned by Spotify. Uses the set clientID and clientSecret if none are given.
   * @param clientID - The client ID of your application.
   * @param clientSecret - The client secret of your application.
   */
  clientCredentialsGrant = async (clientID?: string, clientSecret?: string): Promise<void> => {
    if (clientID) this.setClientID(clientID);
    if (clientSecret) this.setClientSecret(clientSecret);
    if (!this.hasClientID() || !this.hasClientSecret()) {
      throw new Error('Client ID or Client Secret is missing');
    }
    const authUrl = 'https://accounts.spotify.com/api/token';
    const urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', 'client_credentials');
    const authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(this.clientID + ':' + this.clientSecret),
      },
      body: urlencoded,
      json: true,
    };
    const res = await this.fetch(authUrl, authOptions);
    if (res.status === 200) {
      const { access_token, expires_in } = await res.json();
      this.setAccessToken(access_token, expires_in);
    } else {
      throw new Error('Could not refresh access token - ' + res.status + ': ' + res.statusText);
    }
  };
}
