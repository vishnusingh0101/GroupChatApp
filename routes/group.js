const express = require('express');

const router = express.Router();

const creategroup = require('../controllers/group');
const authenticate = require('../middleware/auth');

router.post('/search', authenticate, creategroup.search);
router.post('/creategroup', authenticate, creategroup.creategroup);
router.get('/getGroup', authenticate, creategroup.getgroup);
router.get('/members', creategroup.members);
router.get('/remove',authenticate, creategroup.remove);
router.get('/makeadmin',authenticate, creategroup.makeadmin);
router.post('/deletegroup',authenticate, creategroup.deletegroup);
router.post('/leavegroup',authenticate, creategroup.leavegroup);

module.exports = router;