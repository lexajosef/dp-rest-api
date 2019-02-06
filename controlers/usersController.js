const User = require('../models/user');
const Joi = require('joi');

function validate(userObject) {
  const schema = {
    name: Joi.string().required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(userObject, schema);
}

class usersController {

  static async createUser(req, res) {
    // validate req body
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // check for existing user
    let user = await User.findOne(req.body.email);
    if (user) {
      return res.status(400).send('User already registred.');
    }

    // create new user through model
    user = await User.create(req.body.name, req.body.email, req.body.password);

    // send user in response to client
    res.send(JSON.stringify(user));
  }
}

module.exports = usersController;
