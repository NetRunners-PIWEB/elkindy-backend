const express = require('express');
const router = express.Router();
const UserController = require("../../controllers/userControllers");
const AuthController = require("../../controllers/Auth/authController");
const RegisterController = require("../../controllers/Auth/register");
// Routes for User CRUD operations
router.post('/createUser', RegisterController.register);
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.put('/updateUser/:id', UserController.updateUser);
router.delete('/deleteUser/:id', UserController.deleteUser);

//login routes 
router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);

module.exports = router;
