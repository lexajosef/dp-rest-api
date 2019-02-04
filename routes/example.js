const express = require('express');
const router = express.Router();
require('../controlers/exampleController');

router.get('/', (req, res) => {
  // TODO: call router controller method
});

router.post('/', (req, res) => {
  // TODO: call router controller method
});

module.exports = router;
