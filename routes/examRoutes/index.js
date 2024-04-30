const express = require('express');
const router = express.Router();
const ExamController = require("../../controllers/examController/index.js");
const GradeController = require("../../controllers/examController/gradeController.js");
const observationController = require("../../controllers/examController/observationController.js");
const userController = require("../../controllers/userControllers/index.js");
//Exam routes 

router.post('/createExam', ExamController.createExam);
router.post('/creategrade', GradeController.createGrade);
router.post('/createObs', observationController.createObs);
router.get('/observations/:id', observationController.getobs);
router.get('/notifications/:id', observationController.getnotifs);
router.get('/typeExams', ExamController.getTypeExams);
router.get('/exam/:id', ExamController.getExamById);
router.get('/student/:username', observationController.getStudent);
router.get('/teacherName/:id', observationController.getTeacherById);
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
router.post('/sendSms/:phoneNumber', observationController.sendSms);
module.exports = router;