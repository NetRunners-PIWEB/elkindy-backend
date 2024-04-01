
const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/courseController/courseController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/popular', courseController.getTopThreeCourses);
router.get('/students-stats', courseController.getStudentStats);
router.get('/teachers-stats',courseController.getTeacherStats );

router.get('/category/:category', courseController.listCoursesByCategory);

//Archive endpoint
router.get('/arch/archived', courseController.listArchivedCourses);
router.patch('/archive/:id', courseController.archiveCourse);


router.get('/:id', courseController.getCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.patch('/:courseId/add-students', courseController.addStudentsToCourse);

router.patch('/:courseId/upload-image', upload.single('image'), courseController.uploadImageToCourse);

router.put('/details/:courseId/teachers', courseController.updateCourseTeachers);
router.get('/details/:courseId/teachers', courseController.getAssignedTeachers);

router.get('/', courseController.listCourses);
router.post('/', courseController.createCourse);

module.exports = router;

