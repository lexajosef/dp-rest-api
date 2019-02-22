const User = require('../models/user');
const Joi = require('joi');

function validate(userObject) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(userObject, schema);
}

class AuthController {

  static async authenticateUser(req, res) {
    // validate req body
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // find user
    const user = await User.findOneByEmail(req.body.email);
    if (!user) {
      return res.status(400).send('Invalid user.');
    }

    // validate password TODO: with some hashing
    if (user.password !== req.body.password) {
      return res.status(400).send('Invalid password.');
    }

    // generate and send auth token
    const token = user.generateAuthToken();
    res.send(token);
  }
}

module.exports = AuthController;
