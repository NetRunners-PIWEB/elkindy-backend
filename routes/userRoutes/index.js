const express = require('express');
const router = express.Router();

// Routes for User CRUD operations

const {
    createUser, getAllUsers,getUserById,updateUser,deleteUser,listTeachers,getAllStudents} = require  ('../../controllers/userControllers/index');
const {authMiddleware, isAdmin } = require('../../middlewares/authJWT');
const { handleRefreshToken } = require('../../controllers/Auth/authController');
// Routes for User CRUD operations
router.post('/createUser', authMiddleware,createUser);
router.get('/getAllUsers',authMiddleware,isAdmin,getAllUsers);
router.get('/users',authMiddleware, getAllUsers);
router.get('/users/:id', authMiddleware, getUserById);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id',deleteUser);
router.get('/teachers', listTeachers);
router.get('/Students',authMiddleware ,getAllStudents);
router.get("/refresh", handleRefreshToken);

module.exports = router;