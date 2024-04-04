const express = require('express');
const router = express.Router();
const { listTeachers } = require('../../controllers/userController/userController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
router.get('/teachers', listTeachers);
const UserController = require('../../controllers/userControllers/index');


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
module.exports = router;
