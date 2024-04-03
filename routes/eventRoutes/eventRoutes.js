const express = require('express');
const router = express.Router();
const eventController = require("../../controllers/eventController/eventController");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


// Routes for Events CRUD operations
// router.post('/createEvent', eventController.createEvent);
router.post('/createEvent', upload.single('image'), eventController.createEvent);
router.get('/', eventController.listEvents);
router.get('/archived', eventController.listArchivedEvents); 
router.get('/monthlyEventCount', eventController.getMonthlyEventCount);
router.get('/searchLocation', eventController.searchLocation);
router.get('/:id', eventController.getEventById);
router.put('/updateEvent/:id', eventController.updateEvent);
router.delete('/deleteEvent/:id', eventController.deleteEvent);
router.patch('/archiveEvent/:id', eventController.archiveEvent);
router.patch('/restoreEvent/:id', eventController.restoreEvent); 

module.exports = router;