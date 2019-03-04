const express = require('express');
const router = express.Router();

const auth = require('../middleware/authorization');
const comments = require('./comments');
const PostsController = require('../controllers/postsController');

router.post('/', auth, (req, res) => {
  PostsController.createPost(req, res);
});

router.get('/', auth, (req, res) => {
  PostsController.getPosts(req, res);
});

router.put('/:postId', auth, (req, res) => {
  PostsController.editPost(req, res);
});

router.get('/:postId', auth, (req, res) => {
  PostsController.getPost(req, res);
});

router.delete('/:postId', auth, (req, res) => {
  PostsController.deletePost(req, res);
});

// Add comments sub-resource of posts
router.use('/:postId/comments', function(req, res, next) {
  req.postId = req.params.postId;
  next();
}, comments);

module.exports = router;
