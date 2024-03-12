const express = require('express');
const router = express.Router();
const eventController = require("../../controllers/eventController/eventController");


// Routes for Events CRUD operations
router.post('/createEvent', eventController.createEvent);
router.get('/', eventController.listEvents);
router.get('/:id', eventController.getEventById);
router.put('/updateEvent/:id', eventController.updateEvent);
router.delete('/deleteEvent/:id', eventController.deleteEvent);


module.exports = router;