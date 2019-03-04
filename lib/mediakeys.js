const ioHook = require('iohook');

let listener;
let started = false;

ioHook.on('keypress', function (msg) {
	// TODO not 100% sure this rawcode is the same across machines
	if (msg.rawcode === 65300 && listener) listener();
});

module.exports = function (callback) {
	listener = callback;

	if (!started) {
		ioHook.start();
	}
};
