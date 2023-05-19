const express = require('express');

const router = express.Router();
const userControl = require('../controllers/usercontrols');

router.post('/signup', userControl.signup);
router.post('/signin', userControl.signin);

module.exports = router;

