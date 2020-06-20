const express = require('express');
const postsController = require('../controllers/posts');

const router = express.Router();

// get single post
router.get('/get/:postId', postsController.getPost);

// get all posts
router.get('/get', postsController.getPosts);

// post new recipe post
router.post('/post', postsController.createPost);

module.exports = router;