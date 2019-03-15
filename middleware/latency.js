// middleware to make latency on each req for testing on frontend 
module.exports = function(req, res, next) {
  setTimeout(() => {
    next();
  }, 500);
}
