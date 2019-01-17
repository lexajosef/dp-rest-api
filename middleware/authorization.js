const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  if (!req.token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(req.token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } 
  catch (e) {
    res.status(400).send('Invalid token.');
  }
}
