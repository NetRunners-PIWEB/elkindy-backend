const express = require('express');
const router = express.Router();
const controllers = require("../../controllers/courseController");


router.post('/createCourse', controllers.createCourse);
router.get('/courses', controllers.getAllCourses);
router.get('/course/:id', controllers.getCourseById);
router.put('/updateCourse/:id', controllers.updateCourse);
router.delete('/deleteCourse/:id', controllers.deleteCourse);

module.exports = router;