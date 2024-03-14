const express = require('express');
const router = express.Router();
const ExamController = require("../../controllers/examController");

//Exam routes 

router.post('/createExam', ExamController.createExam);
router.post('/creategrade', ExamController.createGrade);
router.get('/typeExams', ExamController.getTypeExams);
router.get('/exam/:id', ExamController.getExamById);
router.put('/updateExam/:id', ExamController.updateExam);
router.delete('/deleteExam/:id', ExamController.deleteExam);
router.get('/typeEvaluation', ExamController.getTypeEvaluations);
router.get('/evaluationsStudent/:userName', ExamController.getEvaluationByStudent);
router.get('/showgrades', ExamController.getGrades);




module.exports = router;