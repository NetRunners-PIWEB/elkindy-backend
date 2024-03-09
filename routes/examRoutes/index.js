const express = require('express');
const router = express.Router();
const ExamController = require("../../controllers/examController");

//Exam routes
router.post('/createExam', ExamController.createExam);
router.get('/typeExams', ExamController.getTypeExams);
router.get('/exam/:id', ExamController.getExamById);
router.put('/updateExam/:id', ExamController.updateExam);
router.delete('/deleteExam/:id', ExamController.deleteExam);








module.exports = router;