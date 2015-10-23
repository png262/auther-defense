'use strict';
var isAdmin;
var router = require('express').Router(),
	_ = require('lodash');

var HttpError = require('../../utils/HttpError');
var Story = require('./story.model');
var User = require('../users/user.model');

router.param('id', function (req, res, next, id) {
	Story.findById(id).exec()
	.then(function (story) {
		if (!story) throw HttpError(404);
		req.story = story;
		next();
	})
	.then(null, next);
});

router.get('/', function (req, res, next) {
	console.log("req user", req.user);
	console.log("req session", req.session)
	Story.find({}).populate('author').exec()
	.then(function (storys) {
		res.json(storys);
	})
	.then(null, next);
});

router.post('/', function (req, res, next) {
	Story.create(req.body)
	.then(function (story) {
		return story.populateAsync('author');
	})
	.then(function (populated) {
		res.status(201).json(populated);
	})
	.then(null, next);
});

router.get('/:id', function (req, res, next) {
	req.story.populateAsync('author')
	.then(function (story) {
		res.json(story);
	})
	.then(null, next);
});

router.put('/:id', function (req, res, next) {
	_.extend(req.story, req.body);


	User.findById(req.session.passport.user)
	.then(function(response) {
	
		isAdmin = response.isAdmin;
	

		if((req.story.author === req.session.passport.user) || isAdmin) {
			console.log("got into SAVE")
		req.story.save()
		.then(function (story) {
			res.json(story);
			})
		.then(null, next);
		}
		else
			res.status(401).send("unauthoriszed access")
	})

	
	
});

router.delete('/:id', function (req, res, next) {
	User.findById(req.session.passport.user)
	.then(function(response) {
	
		isAdmin = response.isAdmin;

	if((req.story.author === req.session.passport.user) || isAdmin) {
	req.story.remove()
	.then(function () {
		res.status(204).end();
	})
	.then(null, next);
	}
	else
res.status(401).send("unauthoriszed access")
});
});


module.exports = router;