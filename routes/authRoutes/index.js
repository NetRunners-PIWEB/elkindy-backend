const express = require('express');
const router = express.Router();
const AuthGoogle = require('../../controllers/Auth/google');
const AuthController = require("../../controllers/Auth/authController");
const RegisterController = require("../../controllers/Auth/register");
const { forgotPassword, resetPassword } = require('../../controllers/Auth/ForgotPasswordController');


//login routes 

router.post("/login", AuthController.loginUser);
router.post("/logout", AuthController.logout);
router.post('/forgot-password', forgotPassword); 
router.post('/reset-Password', resetPassword); 
router.post('/google-login', AuthController.googleLogin);
router.get('/connection', AuthGoogle.loginGoogle);
router.post('/Register', RegisterController.register);
router.post('/RegisterEnroll', RegisterController.registerEnroll);
router.get("/verifyTokenAndRole",AuthController.verifyTokenAndRole);
router.get('/check-email/:email', AuthController.checkEmailExists);
router.get('/check-phone/:phoneNumber', AuthController.checkPhoneNumberExists);
router.get ('/validateSession', AuthController.validateSession);
// if page not found then status = 404 and message ... page not found
router.all('*', (req, res) => {
    res.status(404).send('Page not found!')
})


module.exports = router;