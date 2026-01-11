const express = require('express');
const router = express.Router();
const { getRooms, getRoom } = require('../controllers/roomController');

router.get('/', getRooms);
router.get('/:id', getRoom);

module.exports = router;