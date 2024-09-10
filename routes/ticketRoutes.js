const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { verifyToken } = require('../middleware/auth');


router.post('/', verifyToken, ticketController.createTicket);


router.get('/', verifyToken, ticketController.getAllTickets);


router.get('/user', verifyToken, ticketController.getUserTickets);


router.get('/:id', verifyToken, ticketController.getTicketById);


router.put('/:id', verifyToken, ticketController.updateTicket);


router.delete('/:id', verifyToken, ticketController.deleteTicket);

module.exports = router;
