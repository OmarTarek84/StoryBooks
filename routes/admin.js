const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../util/is-auth');

router.get('/addstory', isAuth, adminController.getAddStory);

router.post('/addstory', isAuth, adminController.postAddStory);

router.get('/publicstories/:storyId', adminController.getStory);

router.get('/mystories', isAuth, adminController.getMyStories);

router.get('/:storyId', adminController.getEditStory);

router.post('/editStory', isAuth, adminController.postEditStory);

router.post('/deleteStory', isAuth, adminController.postDeleteStory);

router.post('/addcomment', isAuth, adminController.postAddComment);

module.exports = router;