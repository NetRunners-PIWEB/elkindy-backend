const express = require('express');
const router = express.Router();
const classController = require('../../controllers/classController/classController');



router.get('/Allclasses', classController.getClasses);
router.get('/by-course', classController.getClassesByCourseId);
router.put('/:classId/teachers', classController.updateClassTeachers);
router.post('/', classController.createClass);
router.get('/:id', classController.getClass);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);
router.get('/studentsClass/:teacher', classController.getStudentsAndClass);
router.get('/StudentsByClass/:name', classController.getStudentsByClass);
router.get('/', classController.listClasses);


module.exports = router;
