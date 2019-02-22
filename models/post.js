const mockPosts = require('../data/posts.json');
const sys = require('../data/sys.json');

const fs = require('fs');

class Post {

  constructor(id, userId, title, html, dateOfCreation, dateOfModification) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.html = html;
    this.dateOfCreation = dateOfCreation;
    this.dateOfModification = dateOfModification;
    this.comments = [];
  }

  static create(userId, title, html, dateOfCreation, dateOfModification) {
    return new Promise((resolve) => {
      if (sys.lastPostId) {
        sys.lastPostId++;
      } else {
        sys.lastPostId = 1;
      }

      const post = new Post(sys.lastPostId, userId, title, html, dateOfCreation, dateOfModification);

      mockPosts.push(post);
      fs.writeFileSync('./data/posts.json', JSON.stringify(mockPosts));
      fs.writeFileSync('./data/sys.json', JSON.stringify(sys));

      resolve(post);
    });
  }

  static findOneAndUpdate(id, postObject) {
    return new Promise((resolve) => {
      mockPosts.forEach(post => {
        if (post.id === id) {
          post.title = postObject.title;
          post.html = postObject.html;
          post.dateOfModification = postObject.dateOfModification;

          fs.writeFileSync('./data/posts.json', JSON.stringify(mockPosts));
          resolve(post);
        }
      });
      
      resolve(null);
    });
  }

  static delete(id) {
    return new Promise((resolve) => {
      const sizeBeforeRemove = mockPosts.length;
      const resultPosts = mockPosts.filter(post => post.id !== id);
      const sizeAfterRemove = resultPosts.length;

      if (sizeBeforeRemove > sizeAfterRemove) {
        fs.writeFileSync('./data/posts.json', JSON.stringify(resultPosts));
        resolve(true);
      }

      resolve(false);
    });
  }

  static findOne(id) {
    return new Promise((resolve) => {
      mockPosts.forEach(post => {
        if (post.id === id) {
          resolve(new Post(post.id, post.userId, post.title, post.html, post.dateOfCreation, post.dateOfModification));
        }
      });

      resolve(null);
    });
  }

  static findPostsByUserId(userId) {
    return new Promise((resolve) => {
      const findedPosts = mockPosts.filter(post => post.userId === userId);
      resolve(findedPosts);
    });
  }
}

module.exports = Post;
