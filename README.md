# pmp-media-keys

A simple command-line app to control Plex Media Player using media keys. [PMP doesn't support media keys on Linux/Ubuntu](https://github.com/plexinc/plex-media-player/issues/531) so this little app is meant to provide unofficial support until it gets added. You most likely don't need this if you're on Windows (or macOS presumably).

## Installation

You'll want to know how to use the Terminal a little bit for the setup.

You'll need to have [Node.js](https://nodejs.org/en/) to installed. I recommend installing [nvm](https://github.com/creationix/nvm) and then installing Node by running `nvm install node`.

Then you need to clone/download this repository and `cd` into it. Run `npm install` in the cloned directory and wait for packages to install.

## Configuration

Rename `config-example.json` to `config.json` and fill in the necessary info in the file:

- `server_hostname`: The host/domain name or IP for your server. Example: `127.0.0.1` or `example.com` (don't include `http://`)
- `server_port`: The server's port, probably `32400` which is already filled in.
- `server_https`: Whether the server uses HTTPS.
- `username` and `password`: Your Plex username and password. These are optional if you supply a `plex_token` instead.
- `plex_token`: Your Plex authentication token. You can probably Google how to find this if you don't want to supply username and password.
- `app_identifier`: The ID for the app. If no ID is provided then every time you run the app it'll get a new one, which will slow the server down eventually (once thousands of IDs are made and kept track of). Should be safe to leave it as the pre-filled one.
- `app_name`: How this app should show up on the server.

**NOTE**: Even though this app controls Plex Media Player it does need to communicate with the Plex Media Server to use the Remote Control functionality for players.

## Usage

After setting up the config, run `npm start`. You should see some output in the terminal when a player is found. Afterwards you can use any media keys the app supports.
