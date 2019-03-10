let mockPosts = require('../data/posts.json');
const sys = require('../data/sys.json');

const fs = require('fs');

class Comment {

  constructor(id, userId, userName, text, dateOfCreation) {
    this.id = id;
    this.userId = userId;
    this.userName = userName;
    this.text = text;
    this.dateOfCreation = dateOfCreation;
  }
}

class Post {

  constructor(id, userId, userName, title, html, dateOfCreation, dateOfModification, comments, lastCommentId) {
    this.id = id;
    this.userId = userId;
    this.userName = userName;
    this.title = title;
    this.html = html;
    this.dateOfCreation = dateOfCreation;
    this.dateOfModification = dateOfModification;
    this.comments = comments;
    this.lastCommentId = lastCommentId;
  }

  static create(postObject) {
    return new Promise((resolve) => {
      if (sys.lastPostId) {
        sys.lastPostId++;
      } else {
        sys.lastPostId = 1;
      }

      const post = new Post(sys.lastPostId, postObject.userId, postObject.userName, postObject.title, postObject.html, 
          postObject.dateOfCreation, postObject.dateOfModification, [], 0);

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
      mockPosts = mockPosts.filter(post => post.id !== id);
      const sizeAfterRemove = mockPosts.length;

      if (sizeBeforeRemove > sizeAfterRemove) {
        fs.writeFile('./data/posts.json', JSON.stringify(mockPosts), error => {
          if (error) {
            console.error(error);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      } else {
        resolve(false);
      }
    });
  }

  static getRange(limit, offset, order) {
    return new Promise((resolve) => {
      let resultPosts = mockPosts.slice(0);

      // sorting
      if (order === 'desc') {
        resultPosts.sort((a, b) => { return (new Date(b.dateOfModification) - new Date(a.dateOfModification)); });
      } else {
        resultPosts.sort((a, b) => { return (new Date(a.dateOfModification) - new Date(b.dateOfModification)); });
      }

      // do not slice array, if it is not necessary
      if (offset !== 0 || limit !== 0) {
        // limit and offset   
        if (limit === 0) {
          resultPosts = resultPosts.slice(offset);
        } else {
          resultPosts = resultPosts.slice(offset, Number(offset) + Number(limit));
        }
      }   

      resolve(resultPosts);
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
          const comment = new Comment(post.lastCommentId, commentObject.userId, commentObject.userName, 
              commentObject.text, commentObject.dateOfCreation);
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
