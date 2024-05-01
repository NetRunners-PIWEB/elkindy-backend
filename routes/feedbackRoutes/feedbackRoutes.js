const express = require('express');
const router = express.Router();
const feedbackController = require("../../controllers/feedbackController/feedbackController");

// Route to create a new feedback
router.post('/createFeedback', feedbackController.createFeedback);

//get all feedbacks for a specific event
router.get('/:eventId', feedbackController.getFeedbacks);

// Route to get a single feedback by ID
router.get('/details/:feedbackId', feedbackController.getFeedbackById);

//update an existing feedback
router.put('/:feedbackId', feedbackController.updateFeedback);

//delete a feedback
router.delete('/:feedbackId', feedbackController.deleteFeedback);


module.exports = router;