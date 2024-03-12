const express = require('express');
const router = express.Router();


// Routes for User CRUD operations

const UserController = require("../../controllers/userControllers");
const AuthController = require("../../controllers/Auth/authController");
// Routes for User CRUD operations
router.post('/createUser',controllers.createUser);
router.get('/users', controllers.getAllUsers);
router.get('/users/:id', controllers.getUserById);
router.put('/updateUser/:id', controllers.updateUser);
router.delete('/deleteUser/:id', controllers.deleteUser);


router.get('/teachers', UserController.listTeachers);

//login routes 
router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);
router.post('/forgot-password', AuthController.forgotPassword); 


module.exports = router;