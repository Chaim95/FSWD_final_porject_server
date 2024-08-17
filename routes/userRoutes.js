const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/auth');


router.post('/', verifyToken, isAdmin, userController.createUser);


router.get('/', verifyToken, isAdmin, userController.getAllUsers);


router.get('/:id', verifyToken, isAdmin, userController.getUserById);


router.put('/:id', verifyToken, isAdmin, userController.updateUser);


router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
