const express = require('express');
const router = express.Router();
const auth = require('../middleware/authorization');
const commentsController = require('../controlers/exampleController');

router.post('/', auth, (req, res) => {
  // TODO: implement
});

router.get('/:commentId', (req, res) => {
  req.params.postId = req.postId; // retrive postId parameter from req to its params
  res.send(req.params);
  // TODO: implement
});

router.delete('/:commentId', auth, (req, res) => {
  // TODO: implement
});

module.exports = router;
