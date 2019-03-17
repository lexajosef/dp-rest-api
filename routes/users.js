const express = require('express');
const router = express.Router();

const auth = require('../middleware/authorization');
const UsersController = require('../controllers/usersController');

router.post('/', (req, res) => {
  UsersController.createUser(req, res);
});

router.get('/', (req, res) => {
  UsersController.getAll(req, res);
})

router.put('/:userId', auth, (req, res) => {
  UsersController.editUser(req, res);
});

router.get('/:userId', auth, (req, res) => {
  UsersController.getUser(req, res);
});

router.get('/:userId/posts', auth, (req, res) => {
  UsersController.getUserPosts(req, res);
});

module.exports = router;
