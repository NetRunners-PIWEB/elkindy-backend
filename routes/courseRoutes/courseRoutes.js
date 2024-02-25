
const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/courseController/courseController');

router.post('/', courseController.createCourse);
router.get('/:id', courseController.getCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

// Route to list all courses
router.get('/', courseController.listCourses);
// Route to list courses by category
router.get('/category/:category', courseController.listCoursesByCategory);

module.exports = router;

