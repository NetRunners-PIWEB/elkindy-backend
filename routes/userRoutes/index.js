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

router.get('/:id/courses', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId).populate('courses.courseId');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (user.role === 'user'||'student') {
            if (user.courses.length === 0) {
                const courses = await Course.find();
                return res.json(courses);
            } else {
                const courses = await Course.find({ _id: { $in: user.courses.map(course => course.courseId) } });
                return res.json(courses);
            }
        }
        res.status(200).json({ message: 'User is not a student' });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;
