const express = require('express');
const router = express.Router();
const AuthGoogle = require('../../controllers/Auth/google');
const AuthController = require("../../controllers/Auth/authController");
const RegisterController = require("../../controllers/Auth/register");
const { userVerification } = require('../../middlewares/authJWT');



//login routes 

router.post("/login", AuthController.loginUser);
router.get("/logout", AuthController.logout);
router.post('/forgot-password', AuthController.forgotPassword); 
router.get('/connection', AuthGoogle.loginGoogle);
router.post('/Register', RegisterController.register);
// if page not found then status = 404 and message ... page not found
router.all('*', (req, res) => {
    res.status(404).send('Page not found!')
})


module.exports = router;