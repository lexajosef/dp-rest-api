const mockUsers = require('./mock-data/users.json');
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
  
  saveUser() {
    // TODO: save user to mockUsers
  }

  static findUser(email) {
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
