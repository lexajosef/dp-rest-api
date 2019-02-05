const express = require('express');
const router = express.Router();
const usersController = require('../controlers/usersController');

router.post('/', (req, res) => {
  usersController.createUser(req, res);
});

module.exports = router;
