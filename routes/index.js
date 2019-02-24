const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');

router.get('/', indexController.getHomePage);

router.get('/signup', indexController.getSignup);

router.get('/login', indexController.getLogin);

router.get('/publicstories', indexController.getPublicStories);

router.get('/story/:userID', indexController.getUserstories);

module.exports = router;