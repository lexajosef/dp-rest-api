const express = require('express');
const router = express.Router();
const auth = require('../middleware/authorization');
const comments = require('./comments');
const postsController = require('../controlers/exampleController');

router.post('/', auth, (req, res) => {
  // TODO: implement
});

router.put('/:postId', auth, (req, res) => {
  // TODO: implement
});

router.get('/:postId', auth, (req, res) => {
  // TODO: implement
});

router.delete('/:postId', auth, (req, res) => {
  // TODO: implement
});

// Add comments sub-resource of posts
router.use('/:postId/comments', function(req, res, next) {
  req.postId = req.params.postId;
  next();
}, comments);

module.exports = router;
