const express = require('express');

const router = express.Router();
const userControl = require('../controllers/usercontrols');

router.post('/signup', userControl.signup);

module.exports = router;

