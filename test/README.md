# Testing Suite

This is a testing suite for the `test` command.

The tests require a Spotify Developer account and a Spotify application. It requires a `client_id` and `client_secret` to be set in the environment variables `CLIENT_ID` and `CLIENT_SECRET` respectively.

Running the `test` command will check for these variables in a the environment or `.env` file. If they are not found, you will be prompted for these values and they will be stores in a `.env` file.

## Running the tests

Client Credentials Flow is used to get an access token for the following tests:

- fetch
- generic-gets
- initial
- search
- utility

This covers the base functionality of the library and all generic non-user based `GET` requests.
