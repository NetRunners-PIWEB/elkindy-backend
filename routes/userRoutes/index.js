const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const controllers = require("../../controllers/userController");

// Routes for User CRUD operations

=======
const UserController = require("../../controllers/userControllers");
const AuthController = require("../../controllers/Auth/authController");
// Routes for User CRUD operations
router.post('/createUser', UserController.createUser);
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.put('/updateUser/:id', UserController.updateUser);
router.delete('/deleteUser/:id', UserController.deleteUser);

//login routes 
router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);
>>>>>>> 1d2ec6cb46d73e3518cdb4619a40198741863bd7

module.exports = router;