const express = require('express');
const router = express.Router();
const ticketController = require("../../controllers/ticketController/ticketController");


// Routes for Tickets CRUD operations
router.post('/createTicket', ticketController.createTicket);
router.get('/', ticketController.listTickets);
router.get('/:id', ticketController.getTicketById);
router.put('/updateTicket/:id', ticketController.updateTicket);
router.delete('/deleteTicket/:id', ticketController.deleteTicket);

module.exports = router;