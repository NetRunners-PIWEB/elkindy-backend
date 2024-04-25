const express = require('express');
const router = express.Router();
const ExamController = require("../../controllers/examController/index.js");
const GradeController = require("../../controllers/examController/gradeController.js");
//Exam routes 

router.post('/createExam', ExamController.createExam);
router.post('/creategrade', GradeController.createGrade);
router.get('/typeExams', ExamController.getTypeExams);
router.get('/exam/:id', ExamController.getExamById);
router.get('/examTeacher/:id', ExamController.getExamsTeacher);
router.put('/updateExam/:id', ExamController.updateExam);
router.delete('/deleteExam/:id', ExamController.deleteExam);
router.get('/typeEvaluation', ExamController.getTypeEvaluations);
router.get('/evaluationsStudent/:userName', ExamController.getEvaluationByStudent);
router.get('/showgrades', GradeController.getGrades);
router.post('/sendEmail/:name', ExamController.sendEmail);
router.get('/studentExams/:id', GradeController.getExamsGrades);
router.get('/studentgrades/:id', GradeController.getExamGrades);
router.get('/studentEvalgrades/:id', GradeController.getEvalGrades);
router.get('/ExamsstudentsGrades/:id', GradeController.getExamsstudentsGrades);
router.put('/updateEvalGrades', GradeController.updateEvalGrades);
module.exports = router;