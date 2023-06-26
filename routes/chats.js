const express = require('express');

const router = express.Router();

const chats = require('../controllers/chats');
const authenticate = require('../middleware/auth');

const multer = require('multer');
const storage = multer.memoryStorage();
const uploads = multer({storage});


router.post('/send', authenticate , chats.send);
router.get('/msg', authenticate, chats.fetchmessages);
router.post('/sendFile', authenticate, uploads.array("file"), chats.sendFile);

module.exports = router;