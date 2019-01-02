import speedTest from 'speedtest-net'
import fs from 'fs'
import path from 'path'

const logfile = path.resolve(__dirname, '../speedlog.csv');

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
	const logString = getLogString(logData);
	return new Promise((resolve, reject) => {
		fs.stat(logfile, function(err) {
			if (err && err.code === 'ENOENT') {
				fs.writeFileSync(logfile, Object.keys(logData));
			}

			fs.appendFile(
				logfile,
				logString,
				err => err ? reject(err) : resolve()
			);
		});
	})
}

export default function testSpeed() {
	return new Promise((resolve, reject) => {
		speedTest({maxTime: 5000, maxServers: 3})
			.on('error', error => {
				reject(error);
				logError(error);
			})
			.on('data', data => {
				logData(data)
					.then(() => {
						resolve(data)
					});
			});
	})
}
