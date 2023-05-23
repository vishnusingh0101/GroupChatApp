const express = require('express');

const router = express.Router();

const chats = require('../controllers/chats');
const authenticate = require('../middleware/auth');

router.post('/send', authenticate , chats.send);
router.get('/msg', authenticate, chats.fetchmessages);

module.exports = router;