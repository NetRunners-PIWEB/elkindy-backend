const express = require('express');
const router = express.Router();
const reservationController = require("../../controllers/reservationController/reservationController");


// Routes for Reservations CRUD operations
router.post('/addReservation', reservationController.createReservation);
router.get('/reservations', reservationController.listReservations);
router.get('/reservations/:id', reservationController.getReservationById);
router.put('/updateReservation/:id', reservationController.updateReservation);
router.delete('/deleteReservation/:id', reservationController.deleteReservation);

module.exports = router;