const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const { verifyToken, isAdmin } = require('../middleware/auth');


router.post('/', verifyToken, isAdmin, placeController.createPlace);


router.get('/', verifyToken, placeController.getAllPlaces);


router.get('/:id', verifyToken, placeController.getPlaceById);


router.put('/:id', verifyToken, isAdmin, placeController.updatePlace);


router.delete('/:id', verifyToken, isAdmin, placeController.deletePlace);

module.exports = router;
