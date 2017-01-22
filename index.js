const speedTest = require('speedtest-net');
const fs = require('fs');

function logData(data) {
	const { download, upload } = data.speeds;
	const { host, ping, location, country } = data.server;
	const time = Date.now();
	const timeString = new Date(time);
	const logData = { download, upload, host, ping, location, country, time, timeString };
	const logString = Object.keys(logData).reduce((string, key) => string += `${logData[key]},`, '');

	console.log(logString);
}

function logError(error) {
	console.error(error);
}

speedTest({maxTime: 5000})
	.on('data', logData)
	.on('error', logError);
