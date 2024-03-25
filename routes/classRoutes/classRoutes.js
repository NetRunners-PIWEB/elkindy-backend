const express = require('express');
const router = express.Router();
const classController = require('../../controllers/classController/classController');





router.get('/by-course', classController.getClassesByCourseId);
router.post('/generate', classController.generateClassesForCourse);

router.get('/teachers/:teacherId/sessions/upcoming', classController.getUpcomingSessionsForTeacher);



router.get('/:id', classController.getClass);
router.put('/:id', classController.updateClass);
router.put('/:id/schedule', classController.updateClassSchedule);
router.post('/:classId/assign-teacher', classController.assignTeachersToClass);
router.get('/:classId/teachers', classController.getTeachersByClassId);

router.post('/:classId/session', classController.createSessionForClass);
router.post('/:classId/add-students', classController.addStudentsToClass);



router.delete('/:id', classController.deleteClass);

//router.get('/by-teacher', classController.getClassesByTeacherId);

router.post('/', classController.createClass);
router.get('/', classController.listClasses);

module.exports = router;
