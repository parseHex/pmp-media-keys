const PlexAPI = require('plex-api');
const listen_MediaPause = require('./mediakeys');
const config = require('../config.json');

const localIP = require('./local-ip')();
let playerID;
let playerPort;
let playerName;
let playerProduct;
let commandID = 1;

const opt = {
	hostname: config.server_hostname,
	port: config.server_port || 32400,
	https: config.server_https || false,
	options: {
		deviceName: config.app_name || 'Media Key Listener',
	},
};

if (config.username && config.password) {
	opt.username = config.username;
	opt.password = config.password;
} else if (config.plex_token) {
	opt.token = config.plex_token;
}

if (config.app_identifier) opt.options.identifier = config.app_identifier;

const server = new PlexAPI(opt);
let client;

const token = server.authToken;

(async function start() {
	const clients = await getClients();

	for (let i = 0; i < clients.length; i++) {
		if (clients[i].host === localIP) {
			playerID = clients[i].machineIdentifier;
			playerPort = clients[i].port;
			playerName = clients[i].name;
			playerProduct = clients[i].product;
			break;
		}

		console.warn('No players found on this IP (is Plex Media Player running on this machine?)');
		console.warn('Trying again in 30 seconds...');
		setTimeout(start, 30000);
	}

	console.log(`Found player on this machine. (port ${playerPort})`);
	console.log('Player ID: ' + playerID);
	console.log(`Player name: ${playerName} (${playerProduct})`);

	client = new PlexAPI({
		hostname: localIP,
		port: playerPort,
		token,
		options: opt.options,
	});

	await subscribe();

	listen_MediaPause(async function () {
		const sessions = await getSessions();

		let newstate;
		let foundThis = false;

		for (let i = 0; i < sessions.length; i++) {
			if (sessions[i].machineIdentifier !== playerID) continue;
			foundThis = true;

			if (sessions[i].state === 'paused') newstate = 'play';
			if (sessions[i].state === 'playing') newstate = 'pause';
		}

		if (!foundThis) return;

		await client.perform(`/player/playback/${newstate}?type=all&commandID=${commandID}`);
		commandID++;
	});

	console.log('Listening for Media Key presses...');
})();

async function getClients() {
	return (await server.query('/clients')).MediaContainer.Server;
}

async function subscribe() {
	const url = '/player/timeline/subscribe?protocol=http&port=32500&commandID=' + commandID;
	await client.perform(url);
	setTimeout(subscribe, 30000);
}

async function getSessions() {
	const res = (await server.query('/status/sessions')).MediaContainer;
	const s = [];

	if (!res.Metadata) return s;

	for (let i = 0; i < res.Metadata.length; i++) {
		s.push(res.Metadata[i].Player);
	}

	return s;
}
