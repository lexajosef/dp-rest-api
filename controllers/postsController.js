const Post = require('../models/post');
const Joi = require('joi');

function validate(postObject) {
  // TODO: validate post object
  const schema = {
    title: Joi.string().required().max(255),
    html: Joi.string().required()
  };

  return Joi.validate(postObject, schema);
}

function parseId(req, res) {
  // parse param to number
  const id = Number(req.params.postId);
  if (isNaN(id)) {
    res.status(400).send('The post id param must be a number.');
  }

  return id;
}

class PostsController {

  static async createPost(req, res) {
    // validate req body
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let post = await Post.create(req.user.id, req.body.title, req.body.html, Date(), Date());

    // send new post in response to client
    res.send(post);
  }

  static async editPost(req, res) {
    const id = parseId(req, res);

    // validate req body
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const post = await Post.findOneAndUpdate(id, {
      title: req.body.title, 
      html: req.body.html, 
      dateOfModification: Date()
    });

    if (!post) {
      res.status(404).send('Post with this id not exist.');
    }

    res.send(post);
  }
  
  static async deletePost(req, res) {
    const id = parseId(req, res);

    if (!req.user.isAdmin) {
      const post = await Post.findOne(id);

      if (!post) {
        res.status(404).send('Post with this id not exist.');
      } else if (post.userId !== req.user.id) {
        res.status(403).send('Access forbidden.');
      }
    }

    const result = await Post.delete(id);
    if (result) {
      res.send('The post has been deleted.');
    } else {
      res.status(404).send('Post with this id not exist.');
    }
  }

  static async getPost(req, res) {
    const id = parseId(req, res);

    const post = await Post.findOne(id);
    if (!post) {
      res.status(404).send('Post with this id not exist.');
    }

    res.send(post);
  }
}

module.exports = PostsController;
