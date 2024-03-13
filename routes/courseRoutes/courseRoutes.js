
const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/courseController/courseController');

router.post('/', courseController.createCourse);
router.get('/:id', courseController.getCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

router.get('/', courseController.listCourses);

// Route to list courses by category
router.get('/category/:category', courseController.listCoursesByCategory);

//Archive endpoint
router.patch('/archive/:id', courseController.archiveCourse);
router.get('/arch/archived', courseController.listArchivedCourses);

router.put('/details/:courseId/teachers', courseController.updateCourseTeachers);
router.get('/details/:courseId/teachers', courseController.getAssignedTeachers);
module.exports = router;

