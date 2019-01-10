const mockUsers = require('./users.json');
const jwt = require('jsonwebtoken');
const config = require('config');

class User {

  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }
  
  generateAuthToken() {
    return jwt.sign(
      {
        id: this.id,
        name: this.name,
        email: this.email,
        password: this.password
      },
      config.get('jwtPrivateKey')
    );
  }

  static findUser(email) {
    // TODO: find and return user from mockUsers
    return new Promise((resolve) => {
      mockUsers.forEach(user => {
        if (user.email === email) {
          resolve(new User(user.id, user.name, user.email, user.password));
        }
      });

      resolve(null);
    });
  }
}

module.exports = User;
