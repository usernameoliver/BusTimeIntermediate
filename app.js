/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START app]
const express = require('express');
const http = require('http');
const app = express();
var options_outbound = {
	host: 'realtime.portauthority.org',
    path: '/bustime/api/v3/getpredictions?key=ZvG9KVepvvzYaDkbAUuP3vyjF&stpid=8199&rtpidatafeed=Port%20Authority%20Bus&format=json'
};
var options_inbound = {
	host: 'realtime.portauthority.org',
    path: '/bustime/api/v3/getpredictions?key=ZvG9KVepvvzYaDkbAUuP3vyjF&stpid=8191&rtpidatafeed=Port%20Authority%20Bus&format=json'
};
var result = "Hello, Google Cloud!";
app.get('/outbound', (request, response) => {

	var requestTimeAndRoute = http.request(options_outbound, (res) => {
		var rawData = '';
		res.on('data', (chunk) => {
			rawData += chunk;
		});
		res.on('end', () => {
			try {
				result = processData(rawData);
				console.log("the result is " + result);
				response.status(200).send(result).end();
			} catch (e) {
				console.error(e.message);
			}
		});

	});

	requestTimeAndRoute.on('error', (e) => {
		console.log(e.message);
	});
	requestTimeAndRoute.end();
	
});

app.get('/inbound', (request, response) => {

	var requestTimeAndRoute = http.request(options_inbound, (res) => {
		var rawData = '';
		res.on('data', (chunk) => {
			rawData += chunk;
		});
		res.on('end', () => {
			try {
				result = processData(rawData);
				console.log("the result is " + result);
				response.status(200).send(result).end();
			} catch (e) {
				console.error(e.message);
			}
		});

	});

	requestTimeAndRoute.on('error', (e) => {
		console.log(e.message);
	});
	requestTimeAndRoute.end();
	
});

function processData(rawData) {
	const parsedData = JSON.parse(rawData);
	var route = parsedData['bustime-response']['prd'][0]['rt'];
	var prdTime = parsedData['bustime-response']['prd'][0]['prdtm'];
	var timeDifference = 0;
	var predictedTime = prdTime.split(" ")[1];
	var currentTime = getDateTime();
	var currentHour = currentTime.split(":")[0];
	var currentMinute = currentTime.split(":")[1];
	var predictedHour = predictedTime.split(":")[0];
	var predictedMinute = predictedTime.split(":")[1];

	timeDifference = (predictedMinute - 0) - (currentMinute - 0);
	if (timeDifference < 0) {
		timeDifference = (timeDifference - 0) + 60;
	}
	var speechText = "The bus " + route + " is coming in " + timeDifference + " minutes";
	return speechText;
}

function getDateTime() {

	var date = new Date();
	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;
	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;
	return hour + ":" + min;

}

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]
