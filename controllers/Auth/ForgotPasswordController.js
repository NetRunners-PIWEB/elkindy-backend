const  {createTransport } =require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config()
const userModel = require("../../models/user");


// Route to handle "forgot password" request
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    // Check if email exists in the database
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    await user.save();
    
    //Send email with reset token
    const resetUrl = `http://localhost:3001/auth/reset-password?token=${resetToken}`;
    var transporter = createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false,
          },
    });

    var mailOptions = {
        from: 'ramiwali009@gmail.com',
        to: email,
        subject: "Reset Password",
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="background-color: white; padding: 20px; text-align: center; border-radius: 10px;">
            <h1 style="color: #333;">Reset Your Password</h1>
            <p style="color: #555; font-size: 16px;">You have requested to reset your password. Click the button below to proceed.</p>
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; margin: 20px 0; text-decoration: none; display: inline-block; border-top-left-radius: 15px; border-bottom-right-radius: 15px;">Reset Password</a>
            <p style="color: #777; font-size: 14px;">If you did not request this, please ignore this email.</p>
        </div>
    </div>
    
        `
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    
    res.status(200).json({ message: 'A link to reset your password have been sent to your email.' });
  };
  
//  Route to handle password reset request
const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    
    // Verify reset token
    console.log("resettoken: ", token);
    const user = await userModel.findOne({ resetToken:token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    
    // Update password
    user.password = password;
    user.resetToken = null;
    await user.save();
    
    res.status(200).json({ message: 'Password reset successful' });
  };
module.exports = {
    forgotPassword,
    resetPassword
};
