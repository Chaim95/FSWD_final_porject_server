const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');
const { verifyToken, isAdmin, isShowAdminOrAdmin } = require('../middleware/auth');


//router.get('/shows', showController.getAllShowsPaging);

router.post('/', verifyToken, isShowAdminOrAdmin, showController.createShow);

router.get('/', showController.getAllShowsPaging);

router.get('/manager', verifyToken, isShowAdminOrAdmin, showController.getShowsByManager);

//router.get('/:id', verifyToken, showController.getShowById);


router.get('/:id', showController.getShowById);

router.put('/:id', verifyToken, isShowAdminOrAdmin, showController.updateShow);


router.delete('/:id', verifyToken, isAdmin, showController.deleteShow);

module.exports = router;
