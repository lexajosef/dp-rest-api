const mockUsers = require('../data/users.json');
const sys = require('../data/sys.json');

const jwt = require('jsonwebtoken');
const config = require('config');
const fs = require('fs');

class User {

  constructor(id, name, email, password, isAdmin) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin;
  }
  
  generateAuthToken() {
    return jwt.sign({
        id: this.id,
        name: this.name,
        email: this.email,
        password: this.password,
        isAdmin: this.isAdmin
      },
      config.get('jwtPrivateKey')
    );
  }
  
  static create(userObject) {
    return new Promise((resolve) => {
      if (sys.lastUserId) {
        sys.lastUserId++;
      } else {
        sys.lastUserId = 1;
      }

      const user = new User(sys.lastUserId, userObject.name, userObject.email, userObject.password, userObject.isAdmin);

      mockUsers.push(user);
      fs.writeFileSync('./data/users.json', JSON.stringify(mockUsers));
      fs.writeFileSync('./data/sys.json', JSON.stringify(sys));
      
      resolve(user);
    });
  }

  static findOneAndUpdate(id, userObject) {
    return new Promise((resolve) => {
      mockUsers.forEach(user => {
        if (user.id === id) {
          user.name = userObject.name;
          user.email = userObject.email;
          user.password = userObject.password;
          
          fs.writeFileSync('./data/users.json', JSON.stringify(mockUsers));
          resolve(new User(user.id, user.name, user.email, user.password, user.isAdmin));
        }
      });

      resolve(null);
    });
  }

  static findOne(id) {
    return new Promise((resolve) => {
      mockUsers.forEach(user => {
        if (user.id === id) {
          resolve(new User(user.id, user.name, user.email, user.password, user.isAdmin));
        }
      });

      resolve(null);
    });
  }

  static findOneByEmail(email) {
    return new Promise((resolve) => {
      mockUsers.forEach(user => {
        if (user.email === email) {
          resolve(new User(user.id, user.name, user.email, user.password, user.isAdmin));
        }
      });

      resolve(null);
    });
  }
}

module.exports = User;
