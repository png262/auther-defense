'use strict';

var app = require('./app'),
	db = require('./db'),
	http = require('http'),
	https = require('https'),
	fs = require('fs');

var privateKey  = fs.readFileSync('./key.pem', 'utf8');
var certificate = fs.readFileSync('./cert.pem', 'utf8');
var options = {key: privateKey, cert: certificate};



http.createServer(app).listen(8080);
https.createServer(options, app).listen(8443);


// var server = app.listen(port, function () {
// 	console.log('HTTP server patiently listening on port', port);
// });

// module.exports = server;