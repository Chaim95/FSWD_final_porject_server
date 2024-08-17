const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');
const { verifyToken, isAdmin } = require('../middleware/auth');


router.post('/', verifyToken, isAdmin, showController.createShow);


router.get('/', verifyToken, showController.getAllShows);


router.get('/:id', verifyToken, showController.getShowById);


router.put('/:id', verifyToken, isAdmin, showController.updateShow);


router.delete('/:id', verifyToken, isAdmin, showController.deleteShow);

module.exports = router;
