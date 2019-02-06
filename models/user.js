const mockUsers = require('../data/users.json');
const sys = require('../data/sys.json');

const jwt = require('jsonwebtoken');
const config = require('config');
const fs = require('fs');

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
  
  static create(name, email, password) {
    return new Promise((resolve) => {
      sys.lastUserId = sys.lastUserId + 1;
      const user = new User(sys.lastUserId, name, email, password);

      mockUsers.push(user);

      fs.writeFileSync('./data/users.json', JSON.stringify(mockUsers));
      fs.writeFileSync('./data/sys.json', JSON.stringify(sys));
      
      resolve(user);
    });
  }

  static findOne(email) {
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
