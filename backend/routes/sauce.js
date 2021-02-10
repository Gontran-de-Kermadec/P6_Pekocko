const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const multer = require('../middlewares/config_multer');
const auth = require('../middlewares/auth');

router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createNewSauce);
router.get('/:id', auth, sauceCtrl.getSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;