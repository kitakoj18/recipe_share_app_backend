const express = require('express');
const router = express.Router();

const postsController = require('../controllers/posts');
const loggedIn = require('../middleware/loggedIn');

// get single post
router.get('/get/:postId', loggedIn, postsController.getPost);

// get all posts
router.get('/get', loggedIn, postsController.getPosts);

// post new recipe post
router.post('/post', loggedIn, postsController.createPost);

module.exports = router;