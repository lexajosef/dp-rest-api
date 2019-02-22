const express = require('express');
const router = express.Router();

const auth = require('../middleware/authorization');
const usersController = require('../controllers/usersController');

router.post('/', (req, res) => {
  usersController.createUser(req, res);
});

router.put('/:userId', auth, (req, res) => {
  usersController.editUser(req, res);
});

router.get('/:userId', auth, (req, res) => {
  usersController.getUser(req, res);
});

router.get('/:userId/posts', auth, (req, res) => {
  usersController.getUserPosts(req, res);
});

module.exports = router;
