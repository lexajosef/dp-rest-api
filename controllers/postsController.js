const Post = require('../models/post');
const Joi = require('joi');

function validate(postObject) {
  const schema = {
    title: Joi.string().required().max(255),
    html: Joi.string().required()
  };

  return Joi.validate(postObject, schema);
}

function parseId(id) {
  // parse param to number
  const result = Number(id);
  if (isNaN(id)) {
    return -1;
  }

  return result;
}

function badFilterParams(req) {
  return ((req.query.limit && (isNaN(req.query.limit) || req.query.limit < 0)) 
      || (req.query.offset && (isNaN(req.query.offset) || req.query.offset < 0)) 
      || (req.query.order && req.query.order !== 'asc' && req.query.order !== 'desc'));
}

class PostsController {

  static async createPost(req, res) {
    // validate req body
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let post = await Post.create({
      userId: req.user.id, 
      userName: req.user.name, 
      title: req.body.title, 
      html: req.body.html, 
      dateOfCreation: Date(), 
      dateOfModification: Date()
    });

    // send new post in response to client
    res.send(post);
  }

  static async editPost(req, res) {
    const id = parseId(req.params.postId);
    if (id === -1) {
      return res.status(400).send('The post id param must be a number.');
    }

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
      return res.status(404).send('Post with this id not exist.');
    }

    res.send(post);
  }
  
  static async deletePost(req, res) {
    const id = parseId(req.params.postId);
    if (id === -1) {
      return res.status(400).send('The post id param must be a number.');
    }

    if (!req.user.isAdmin) {
      const post = await Post.findOne(id);

      if (!post) {
        return res.status(404).send('Post with this id not exist.');
      } else if (post.userId !== req.user.id) {
        return res.status(403).send('Access forbidden.');
      }
    }

    const result = await Post.delete(id);
    if (result) {
      res.send('The post has been deleted.');
    } else {
      res.status(404).send('Post with this id not exist.');
    }
  }

  static async getPosts(req, res) {
    if (badFilterParams(req)) {
      return res.status(400).send('Bad filter parameters.');      
    }

    const limit = req.query.limit || 0;
    const offset = req.query.offset || 0;
    const order = req.query.order || 'asc';

    const posts = await Post.getRange(limit, offset, order);
    if (posts.length === 0) {
      return res.status(404).send('The posts for this filter not exist.');
    }

    res.send(posts);
  }

  static async getPost(req, res) {
    const id = parseId(req.params.postId);
    if (id === -1) {
      return res.status(400).send('The post id param must be a number.');
    }

    const post = await Post.findOne(id);
    if (!post) {
      return res.status(404).send('Post with this id not exist.');
    }

    res.send(post);
  }
}

module.exports = PostsController;
