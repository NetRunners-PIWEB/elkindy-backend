const express = require('express');
const router = express.Router();
const controllers = require("../../controllers/examController");


router.post('/createExam', controllers.createExam);
router.get('/exams', controllers.getAllExams);
router.get('/exam/:id', controllers.getExamById);
router.put('/updateExam/:id', controllers.updateExam);
router.delete('/deleteExam/:id', controllers.deleteExam);

module.exports = router;