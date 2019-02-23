const mockPosts = require('../data/posts.json');
const sys = require('../data/sys.json');

const fs = require('fs');

class Comment {

  constructor(id, userId, text, dateOfCreation) {
    this.id = id;
    this.userId = userId;
    this.text = text;
    this.dateOfCreation = dateOfCreation;
  }
}

class Post {

  constructor(id, userId, title, html, dateOfCreation, dateOfModification, comments, lastCommentId) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.html = html;
    this.dateOfCreation = dateOfCreation;
    this.dateOfModification = dateOfModification;
    this.comments = comments;
    this.lastCommentId = lastCommentId;
  }

  static create(userId, title, html, dateOfCreation, dateOfModification) {
    return new Promise((resolve) => {
      if (sys.lastPostId) {
        sys.lastPostId++;
      } else {
        sys.lastPostId = 1;
      }

      const post = new Post(sys.lastPostId, userId, title, html, dateOfCreation, dateOfModification, [], 0);

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
          resolve(post);
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

  // COMMENTS STUFF

  static findOneComment(postId, commentId) {
    return new Promise((resolve) => {
      mockPosts.forEach(post => {
        if (post.id === postId) {
          post.comments.forEach(comment => {
            if (comment.id === commentId) {
              resolve(comment);
            }
          });
        }
      });

      resolve(null);
    });
  }

  static createComment(postId, commentObject) {
    return new Promise((resolve) => {
      mockPosts.forEach(post => {
        if (post.id === postId) {
          post.lastCommentId++;
          const comment = new Comment(post.lastCommentId, commentObject.userId, commentObject.text, 
              commentObject.dateOfCreation);
          post.comments.push(comment);

          fs.writeFileSync('./data/posts.json', JSON.stringify(mockPosts));
          resolve(comment);
        }
      });

      resolve(null);
    });
  }

  static deleteComment(postId, commentId) {
    return new Promise((resolve) => {
      mockPosts.forEach(post => {
        if (post.id === postId) {
          const sizeBeforeRemove = post.comments.length;
          post.comments = post.comments.filter(comment => comment.id !== commentId);
          const sizeAfterRemove = post.comments.length;

          if (sizeBeforeRemove > sizeAfterRemove) {
            fs.writeFileSync('./data/posts.json', JSON.stringify(mockPosts));
            resolve(true); 
          }
        }
      });

      resolve(false);
    });
  }
}

module.exports = Post;
