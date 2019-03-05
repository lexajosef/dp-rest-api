const Post = require('../models/post');
const Joi = require('joi');

function validate(commentObject) {
  const schema = {
    text: Joi.string().required()
  };

  return Joi.validate(commentObject, schema);
}

function parseId(id) {
  // parse param to number
  const result = Number(id);
  if (isNaN(id)) {
    return -1;
  }

  return result;
}

class CommentsController {

  static async createComment(req, res) {
    const postId = parseId(req.params.postId);
    if (postId === -1) {
      return res.status(400).send('The post id param must be a number.');
    }

    // validate req body
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const comment = await Post.createComment(postId, {
      userId: req.user.id,
      userName: req.user.name,
      text: req.body.text,
      dateOfCreation: Date()
    });

    res.send(comment);
  }

  static async deleteComment(req, res) {
    const postId = parseId(req.params.postId);
    const commentId = parseId(req.params.commentId);

    // check parameters
    if (postId === -1) {
      return res.status(400).send('The post id param must be a number.');
    }
    if (commentId === -1) {
      return res.status(400).send('The comment id param must be a number.');
    }

    if (!req.user.isAdmin) {
      const comment = await Post.findOneComment(postId, req.params.commentId);
      if (!comment) {
        res.status(404).send('Comment with this id not exist.');
      } else if (comment.userId !== req.user.id) {
        res.status(403).send('Access forbidden.');
      }
    }

    const result = await Post.deleteComment(postId, commentId);
    if (result) {
      res.send('The comment has been deleted.');
    } else {
      res.status(404).send('Comment with this id not exist.');
    }
  }
}

module.exports = CommentsController;
