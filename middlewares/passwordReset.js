const nodemailer = require('nodemailer');

const crypto = require('crypto');
const sendResetPasswordEmail = async (email, token) => {
    // Set up transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your preferred service
        auth: {
            user: process.env.EMAIL_USERNAME, // Your email
            pass: process.env.EMAIL_PASSWORD, // Your email password
        },
    });

    // Specify the email options
    const mailOptions = {
        from: process.env.EMAIL_USERNAME, // Sender address
        to: email, // List of recipients
        subject: 'Password Reset', // Subject line
        html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="${process.env.FRONTEND_URL}/reset-password/${token}">link</a> to set a new password.</p>
        `, // Plain text body
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully.');
    } catch (error) {
        console.error('There was an error sending the password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

const generatePasswordResetToken = () => {
    return crypto.randomBytes(20).toString('hex');
  };
  

  module.exports = { sendResetPasswordEmail, generatePasswordResetToken };
