const express = require('express');
const router = express.Router();
const passwordTokenController = require('../controllers/passwordTokenController');


router.post('/create', passwordTokenController.createToken);


router.post('/verify', passwordTokenController.verifyToken);


router.post('/delete', passwordTokenController.deleteToken);

module.exports = router;
