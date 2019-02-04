const express = require('express');
const router = express.Router();
const authController = require('../controlers/authController');

router.post('/', (req, res) => {
  authController.authenticateUser(req, res);
});

module.exports = router;
