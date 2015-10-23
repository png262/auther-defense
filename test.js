

var crypto = require('crypto');

var salt = crypto.randomBytes(16);
var iterations = 100;
var bytes = 64;
var buffer = crypto.pbkdf2Sync('jon', salt, iterations, bytes);
var hash = buffer.toString('base64');

console.log(' 1st hash', hash);


var buffer = crypto.pbkdf2Sync('jon', salt, iterations, bytes);
var hash2 = buffer.toString('base64');
console.log('2nd hash', hash2)