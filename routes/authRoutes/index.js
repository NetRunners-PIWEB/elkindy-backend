const express = require('express');
const router = express.Router();
const AuthGoogle = require('../../controllers/Auth/google');
const AuthController = require("../../controllers/Auth/authController");
const RegisterController = require("../../controllers/Auth/register");
//login routes 
router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);
router.post('/forgot-password', AuthController.forgotPassword); 
router.get('/connection', AuthGoogle.loginGoogle);
router.post('/Register', RegisterController.register);
// if page not found then status = 404 and message ... page not found
router.all('*', (req, res) => {
    res.status(404).send('Page not found!')
})


module.exports = router;