const mockUsers = require('./users.json');

class User {

  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
  
  generateAuthToken() {
    // TODO: generate JWT token from user properties
  }

  static findUser(user) {
    // TODO: find and return user from mockUsers
    return new User('Alois', 'alois18@gmail.com', 'password');
  }
}

module.exports = User;
