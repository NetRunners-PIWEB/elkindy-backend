const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const { createSecretToken } = require("../../middlewares/SecretToken");
const { generatePasswordResetToken, sendResetPasswordEmail } = require('../../middlewares/passwordReset');
const asyncHandler = require('../../middlewares/asyncHandler');

class AuthController {
     login =asyncHandler(async (req, res) => {

            const { email, password } = req.body;
            const user = await User.findOne({ email });
            // If user doesn't exist or password is incorrect, send an error response
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: 'Incorrect email or password' });
            }
            // Generate JWT token (Access secret key from .env)
            const token = jwt.sign({ email: user.email, role: user.role }, process.env.TOKEN_KEY, { expiresIn: '1h' });
            res.json({ message: 'User logged in successfully', token }); 
       
    });


     logout =asyncHandler(async (req, res) => {
          res.clearCookie('jwtToken'); 
          res.status(200).json({ message: 'Logout successful' });
    
      });
  
    async loginGoogle(req, res) {
   
    }


    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            // Check if the user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Generate a password reset token
            const token = generatePasswordResetToken();
            // Save the token to the user document
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; 
            await user.save();
            sendResetPasswordEmail(email, token);
            res.json({ message: 'Password reset email sent successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
  
  }
  
  module.exports = new AuthController();
  