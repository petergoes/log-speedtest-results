const speedTest = require('speedtest-net');
const fs = require('fs');
const logfile = './speedlog.csv';

function getLogData(data) {
	const { download, upload } = data.speeds;
	const { host, ping, location, country } = data.server;
	const time = Date.now();
	const timeString = new Date(time);
	
	return { download, upload, host, ping, location, country, time, timeString };
}

function getLogString(logData) {
	return Object.keys(logData)
		.reduce((string, key) => string += `${logData[key]},`, '\n')
		.replace(/,$/, '');
}

function logError(error) {
	console.error(error);
}

function logData(data) {
	const logData = getLogData(data);
	fs.stat(logfile, function(err) {
		if(err && err.code === 'ENOENT') {
			fs.writeFileSync(logfile, Object.keys(logData));
		}

		fs.appendFile(logfile, getLogString(logData), err => {
			if (err) {
				console.log(err)
			}
		});
	});
}

speedTest({maxTime: 5000})
	.on('error', logError)
	.on('data', logData);
