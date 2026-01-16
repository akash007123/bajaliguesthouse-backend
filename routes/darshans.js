const express = require('express');
const router = express.Router();
const { getDarshans, getDarshan } = require('../controllers/darshanController');

router.get('/', getDarshans);
router.get('/:id', getDarshan);

module.exports = router;