const Joi = require('joi');

const User = require('../models/user');
const Post = require('../models/post');

function validate(userObject) {
  const schema = {
    name: Joi.string().required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(userObject, schema);
}

class UsersController {

  static async createUser(req, res) {
    // validate req body
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // check for existing user
    let user = await User.findOneByEmail(req.body.email);
    if (user) {
      return res.status(400).send('User already registred.');
    }

    // create new user through model
    user = await User.create({
      name: req.body.name, 
      email: req.body.email, password: 
      req.body.password
    });

    // send user in response to client
    res.send(user);
  }

  static async editUser(req, res) {
    // parse param to number
    const id = Number(req.params.userId);
    if (isNaN(id)) {
      res.status(400).send('The user id param must be a number.');
    }

    // validate req body
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // edit user
    const user = await User.findOneAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    if (!user) {
      return res.status(404).send('User with this id not found.');
    }

    res.send(user);
  }

  static async getUser(req, res) {
    // parse param to number
    const id = Number(req.params.userId);
    if (isNaN(id)) {
      res.status(400).send('The user id param must be a number.');
    }

    const user = await User.findOne(id);
    if (!user) {
      return res.status(404).send('User with this id not found.');
    }

    res.send(user);
  }

  static async getUserPosts(req, res) {
    // parse param to number
    const id = Number(req.params.userId);
    if (isNaN(id)) {
      res.status(400).send('The user id param must be a number.');
    }

    const posts = await Post.findPostsByUserId(id);
    
    res.send(posts);
  }
}

module.exports = UsersController;
