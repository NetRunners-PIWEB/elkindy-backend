const express = require('express');
const router = express.Router();


// Routes for User CRUD operations

const UserController = require("../../controllers/userControllers");
// Routes for User CRUD operations
router.post('/createUser', UserController.createUser);
router.get('/getAllUsers', UserController.getAllUsers);
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.put('/updateUser/:id', UserController.updateUser);
router.delete('/deleteUser/:id', UserController.deleteUser);
router.get('/teachers', UserController.listTeachers);
router.get('/Students', UserController.getAllStudents);


module.exports = router;