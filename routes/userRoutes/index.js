const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/userControllers/index');



// router.get('/teachers', UserController.listTeachers);


//fetch teachers
router.get('/teachers', UserController.listTeachers);

// //login routes 
// router.post("/login", AuthController.login);
// router.get("/logout", AuthController.logout);
// router.post('/forgot-password', AuthController.forgotPassword); 



module.exports = router;