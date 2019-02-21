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

class postsController {

  static async createPost(req, res) {
    // validate req body
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let post = await Post.create(req.user.id, req.body.title, req.body.html, Date(), Date());

    // send new post in response to client
    res.send(JSON.stringify(post));
  }

  static async editPost(req, res) {
    // validate req body
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
      const post = await Post.update(req.params.postId, req.body.title, req.body.html, Date());
      res.send(JSON.stringify(post));
    } catch(e) {
      res.status(400).send(e);
    }
  }
  
  static async deletePost(req, res) {
    try {
      await Post.delete(req.params.postId);
      res.send('The post has been deleted.');
    } catch(e) {
      res.status(400).send(e);
    }
  }

  static async getPost(req, res) {
    try {
      const post = await Post.findOne(req.params.postId);
      res.send(JSON.stringify(post));
    } catch(e) {
      res.status(400).send(e);
    }
  }
}

module.exports = postsController;
