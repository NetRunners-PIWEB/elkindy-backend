const express = require('express');
const router = express.Router();
const controllers = require("../../controllers/eventController");


router.post('/createEvent', controllers.createEvent);
router.get('/events', controllers.getAllEvents);
router.get('/event/:id', controllers.getEventById);
router.put('/updateEvent/:id', controllers.updateEvent);
router.delete('/deleteEvent/:id', controllers.deleteEvent);

module.exports = router;