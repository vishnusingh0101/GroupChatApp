const express = require('express');

const router = express.Router();

const chats = require('../controllers/chats');
const authenticate = require('../middleware/auth');

router.post('/send', authenticate , chats.send);

module.exports = router;