var os = require('os');

module.exports = function () {
	// https://stackoverflow.com/a/8440736
	const ifaces = os.networkInterfaces();
	const ifnames = Object.keys(ifaces);

	for (let i = 0; i < ifnames.length; i++) {
		const ifs = ifaces[ifnames[i]];

		for (let alias = 0; alias < ifs.length; alias++) {
			const iface = ifs[alias];

			if (iface.internal || iface.family !== 'IPv4') continue;

			// if (alias >= 1) {
			// 	// this single interface has multiple ipv4 addresses
			// 	console.log(ifname + ':' + alias, iface.address);
			// } else {
			// 	// this interface has only one ipv4 adress
			// 	console.log(ifname, iface.address);
			// }

			return iface.address;
		}
	}
}
