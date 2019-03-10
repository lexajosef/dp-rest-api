const Joi = require('joi');
const bcrypt = require('bcrypt');

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

function checkPermsAndGetUserId(req, res, checkAdmin) {
  // parse param to number
  let id;
  if (req.params.userId === 'me') {
    id = req.user.id;
  } else if(checkAdmin && !req.user.isAdmin) {
    return res.status(403).send('Access forbidden.');
  } else {
    id = Number(req.params.userId);
    if (isNaN(id)) {
      return res.status(400).send('The user id param must be a number.');
    }
  }

  return id;
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

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user through model
    user = await User.create({
      name: req.body.name, 
      email: req.body.email, 
      password: hashedPassword,
      isAdmin: false
    });

    // send user in response to client
    res.send(user);
  }

  static async editUser(req, res) {
    const id = checkPermsAndGetUserId(req, res, true);

    // validate req body
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

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
    const id = checkPermsAndGetUserId(req, res, false);

    const user = await User.findOne(id);
    if (!user) {
      return res.status(404).send('User with this id not found.');
    }

    res.send(user);
  }

  static async getUserPosts(req, res) {
    const id = checkPermsAndGetUserId(req, res, false);
    
    if (req.query.order && req.query.order !== 'asc' && req.query.order !== 'desc') {
      return res.status(400).send('Bad filter parameters.');
    }
    const order = req.query.order || 'asc';
    
    const posts = await Post.findPostsByUserId(id, order);
    
    res.send(posts);
  }
}

module.exports = UsersController;
