export enum Images {
  UPLOAD = 'ugc-image-upload',
}

export enum Connect {
  READ_PLAYBACK_STATE = 'user-read-playback-state',
  MODIFY_PLAYBACK_STATE = 'user-modify-playback-state',
  READ_CURRENTLY_PLAYING = 'user-read-currently-playing',
}

export enum Playback {
  APP_REMOTE_CONTROL = 'app-remote-control',
  STREAMING = 'streaming',
}

export enum Playlists {
  READ_PRIVATE = 'playlist-read-private',
  READ_COLLABORATIVE = 'playlist-read-collaborative',
  MODIFY_PRIVATE = 'playlist-modify-private',
  MODIFY_PUBLIC = 'playlist-modify-public',
}

export enum Follow {
  READ = 'user-follow-read',
  MODIFY = 'user-follow-modify',
}

export enum ListeningHistory {
  READ_PLAYBACK_POSITION = 'user-read-playback-position',
  READ_RECENTLY_PLAYED = 'user-read-recently-played',
  READ_TOP = 'user-top-read',
}

export enum Library {
  READ = 'user-library-read',
  MODIFY = 'user-library-modify',
}

export enum Users {
  READ_EMAIL = 'user-read-email',
  READ_PRIVATE = 'user-read-private',
}
