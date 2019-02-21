const express = require('express');
const router = express.Router();

const auth = require('../middleware/authorization');
const comments = require('./comments');
const postsController = require('../controllers/postsController');

router.post('/', auth, (req, res) => {
  postsController.createPost(req, res);
});

router.put('/:postId', auth, (req, res) => {
  postsController.editPost(req, res);
});

router.get('/:postId', auth, (req, res) => {
  postsController.getPost(req, res);
});

router.delete('/:postId', auth, (req, res) => {
  postsController.deletePost(req, res);
});

// Add comments sub-resource of posts
router.use('/:postId/comments', function(req, res, next) {
  req.postId = req.params.postId;
  next();
}, comments);

module.exports = router;
