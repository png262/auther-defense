'use strict';

var router = require('express').Router();

var HttpError = require('../utils/HttpError');
var User = require('../api/users/user.model');
var crypto = require('crypto');



function encrypt(UEpass, salt) {

	if (!salt) salt = crypto.randomBytes(16).toString('base64');
	var iterations = 1;
	var bytes = 64;
	var buffer = crypto.pbkdf2Sync(UEpass, salt, iterations, bytes);
	var hash = buffer.toString('base64')
	return {hash: hash, salt: salt};
}


router.post('/login', function (req, res, next) {
	User.findOne({email: req.body.email}).exec()
	.then(function (user) {
		if (!user) throw HttpError(401);
		
		var encrypted = encrypt(req.body.password, user.salt);
		if(encrypted.hash == user.password) {
			req.login(user, function () {
			res.json(user);
		})
		}
		else throw HttpError(401);
	})
	.then(null, next);
});

router.post('/signup', function (req, res, next) {
	var encrypted = encrypt(req.body.password)

	var newUser = {
		email: req.body.email,
		password: encrypted.hash,
		salt: encrypted.salt
	};
	console.log("newUser", newUser);

	User.create(newUser)
	.then(function (user) {
		req.login(user, function () {
			res.status(201).json(user);
		});
	})
	.then(null, next);
});

router.get('/me', function (req, res, next) {
	res.json(req.user);
});

router.delete('/me', function (req, res, next) {
	req.logout();
	res.status(204).end();
});

router.use('/google', require('./google.oauth'));

router.use('/twitter', require('./twitter.oauth'));

router.use('/github', require('./github.oauth'));

module.exports = router;