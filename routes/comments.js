const express = require('express');
const router = express.Router();

const auth = require('../middleware/authorization');
const CommentsController = require('../controllers/commentsController');

router.post('/', auth, (req, res) => {
  req.params.postId = req.postId; // retrive postId parameter
  CommentsController.createComment(req, res);
});

router.delete('/:commentId', auth, (req, res) => {
  CommentsController.deleteComment(req, res);
});

module.exports = router;
