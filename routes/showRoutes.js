const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');
const { verifyToken, isAdmin } = require('../middleware/auth');


//router.get('/shows', showController.getAllShowsPaging);

router.post('/', verifyToken, isAdmin, showController.createShow);

router.get('/', showController.getAllShowsPaging);

router.get('/manager', verifyToken, isAdmin, showController.getShowsByManager);

//router.get('/:id', verifyToken, showController.getShowById);


router.get('/:id', showController.getShowById);

router.put('/:id', verifyToken, isAdmin, showController.updateShow);


router.delete('/:id', verifyToken, isAdmin, showController.deleteShow);

module.exports = router;
