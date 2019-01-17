const express = require('express');
const router = express.Router();
const authController = require('../controlers/authController');
const auth = require('../middleware/authorization');

router.post('/', auth, (req, res) => {
  authController.authenticateUser(req, res);
});

module.exports = router;
