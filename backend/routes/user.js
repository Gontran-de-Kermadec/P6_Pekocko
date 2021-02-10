const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
//const sauceCtrl = require('../controllers/sauce');
// const multer = require('../middlewares/config_multer');
// const auth = require('../middlewares/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);



module.exports = router;