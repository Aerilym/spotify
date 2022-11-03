# Spotify API Wrapper

[![CI Workflow](https://github.com/Aerilym/spotify/actions/workflows/ci-workflow.yml/badge.svg)](https://github.com/Aerilym/spotify/actions/workflows/ci-workflow.yml)
![GitHub package.json version](https://img.shields.io/github/package-json/v/aerilym/spotify)
![Coverage](.github/badges/coverage.svg)
![GitHub](https://img.shields.io/github/license/aerilym/spotify)
![Website](https://img.shields.io/website?label=Documentation&up_message=up&url=https%3A%2F%2Faerilym.github.io%2Fspotify%2F)

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

## Testing

![Coverage](.github/badges/coverage.svg)

![Coverage lines](.github/badges/badge-lines.svg)
![Coverage functions](.github/badges/badge-functions.svg)
![Coverage branches](.github/badges/badge-branches.svg)
![Coverage statements](.github/badges/badge-statements.svg)

## Contributing

Everything is written in TypeScript and compiled into JavaScript. The compiled JavaScript is not included in the repository. To compile the TypeScript into JavaScript, run the `build` command. The workspace has several recommended extensions and is set up to use [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for linting and formatting. The workspace is also set up to use [Jest](https://jestjs.io/) for testing.
