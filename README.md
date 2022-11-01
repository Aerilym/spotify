# Spotify API Wrapper

This is a wrapper for the Spotify API. It is written in TypeScript and is designed to be used with any JavaScript framework. There are examples for using it with different frameworks in the `examples` folder and in the [documentation](docs/v1/).

## Usage

Import the API class and initialize it.

```typescript
import { SpotifyAPI } from 'spotify-api-wrapper';

const spotify = new SpotifyAPI();
```

Initialize the API with a client ID and client secret. See the [Spotify Authorization Guide](https://developer.spotify.com/documentation/general/guides/authorization/) for more information about which auth method to use.

```typescript
import { SpotifyAPI } from 'spotify-api-wrapper';

const spotify = new SpotifyAPI({
  clientID: 'CLIENT_ID',
  clientSecret: 'CLIENT_SECRET',
});
```

You can also initialize the API with an access token. This is useful if you already have an access token and don't want to make a request to get a new one. But this is not recommended as the access token will expire and there is a better way.

```typescript
import { SpotifyAPI } from 'spotify-api-wrapper';

const spotify = new SpotifyAPI({
  accessToken: 'ACCESS_TOKEN',
});
```

If you want to use the API with a user's access token, you can initialize the API with nothing and set the access token whenever you receive one

```typescript
import { SpotifyAPI } from 'spotify-api-wrapper';

const spotify = new SpotifyAPI();

spotify.setAccessToken('ACCESS_TOKEN');
```

You can add and clear an access token with each call if you wish. This is useful if you are using the API with a user's access token and you want to make a request with a different user's access token or if you're getting the access token from a different source.

```typescript
spotify.setAccessToken('ACCESS_TOKEN');

spotify.getAlbum('ALBUM_ID');

spotify.clearAccessToken();
```

## Examples

There are examples for using the API with different frameworks in the `examples` folder and in the [documentation](docs/v1/).

If there's a framework or use case you want to see an example for, please open an issue or contribute an example yourself with a pull request.

## Issues

If you encounter any issues or have any suggestions, please open an issue on the [GitHub repository](TBD). If you're confident, free to try resolve your issue or any other issues by opening a pull request and contributing to the project.

## Contributing

Everything is written in TypeScript and compiled into JavaScript. The compiled JavaScript is not included in the repository. To compile the TypeScript into JavaScript, run the `build` command. The workspace has several recommended extensions and is set up to use [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for linting and formatting. The workspace is also set up to use [Jest](https://jestjs.io/) for testing.
