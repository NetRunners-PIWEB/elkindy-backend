const express = require('express');
const router = express.Router();
const { listTeachers } = require('../../controllers/userController/userController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
router.get('/teachers', listTeachers);
const UserController = require('../../controllers/userControllers/index');
const User = require('../../models/user');
const Course = require('../../models/course');

const { generatePayment } = require('../../controllers/userController/userController');
const {
    createUser, getAllUsers,getUserById,updateUser,deleteUser,getAllStudents} = require  ('../../controllers/userControllers/index');
const {authMiddleware, isAdmin } = require('../../middlewares/authJWT');
// Routes for User CRUD operations
router.post('/createUser', authMiddleware,createUser);
router.get('/getAllUsers',getAllUsers);//,authMiddleware,isAdmin 
router.get('/users',authMiddleware, getAllUsers);
router.get('/users/:id', authMiddleware, getUserById);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id',deleteUser);
router.get('/teachers', listTeachers);
// router.get('/Students',authMiddleware ,getAllStudents);
router.get('/Students' ,getAllStudents)
router.post('/:id/addAvailability', addAvailability);
router.get('/:id/availability', UserController.getUserAvailability);
router.patch('/:userId/upload-image', upload.single('image'), UserController.uploadUserProfilePicture);
router.post('/generate-payment', UserController.generatePayment); 
router.post('/update-status', UserController.updateCourseStatus);
router.get('/:id/courses', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId).populate('courses.courseId');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'user' || user.role === 'student') {
            let courses = [];
            if (user.courses.length > 0) {
                // User has courses, fetch those courses
                courses = await Course.find({ _id: { $in: user.courses.map(course => course._id) } });
            } else {
                // User has no courses, fetch all available courses
                courses = await Course.find({});
            }

            const userCourses = courses.map(userCourse => ({
                _id: userCourse._id,
                title: userCourse.title,
                description: userCourse.description,
                category: userCourse.category,
                teacher: userCourse.teacher,
                students: userCourse.students,
                price: userCourse.price,
                startDate: userCourse.startDate,
                endDate: userCourse.endDate,
                isArchived: userCourse.isArchived,
                isInternship: userCourse.isInternship,
                image: userCourse.image,
                status: user.courses.map(status => status.status)  // Adjust if necessary based on actual model
            }));

            return res.json(userCourses);
        } else {
            // If the user is not a student
            return res.status(200).json({ message: 'User is not a student' });
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/enrollments/pending', async (req, res) => {
    try {
        const usersWithPendingEnrollments = await User.find({
            "courses.status": "pending"
        }).populate('courses.courseId');  // Assuming you want course details too
        //push
        const pendingEnrollments = usersWithPendingEnrollments.map(user => ({
            userId: user._id,
            username: user.username,
            courseid :user.courses[0]._id,
            enrollments: user.courses.filter(course => course.status === 'pending')
        }));

        res.json(pendingEnrollments);
    } catch (error) {
        console.error("Error fetching pending enrollments:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

