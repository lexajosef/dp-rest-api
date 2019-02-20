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
      if (sys.lastPostId) sys.lastPostId++;
      else sys.lastPostId = 1;

      const post = new Post(sys.lastPostId, userId, title, html, dateOfCreation, dateOfModification);

      mockPosts.push(post);

      // TODO: try catch and reject promise
      fs.writeFileSync('./data/posts.json', JSON.stringify(mockPosts));
      fs.writeFileSync('./data/sys.json', JSON.stringify(sys));

      resolve(post);
    });
  }

  static update(postObject) {
    // TODO: find and update post object in data/post.json
  }

  static findOne(postId) {
    return new Promise((resolve) => {
      mockPosts.forEach(post => {
        if (post.id === postId) resolve(post);
      });

      resolve(null);
    });
  }
}

module.exports = Post;
