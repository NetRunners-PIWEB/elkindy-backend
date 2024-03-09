
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require("../../config/generateToken.js");
const generateRefreshToken = require("../../config/refreshToken.js");
const { createSecretToken } = require("../../middlewares/SecretToken");
const { generatePasswordResetToken, sendResetPasswordEmail } = require('../../middlewares/passwordReset');
const asyncHandler = require('../../middlewares/asyncHandler');
const User = require('../../models/user');
class AuthController {

  loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const { id } = findUser;
      const refreshToken = await generateRefreshToken(id);
      await User.findByIdAndUpdate(
        id,
        {
          refreshToken,
        },
        {
          new: true,
        }
      );
      
      const { firstName, lastName, email, _id, mobile, role } = findUser;
      res.status(200).json({
        message: "User logged in successfully",
        success: true,
        user: {
          _id,
          firstName,
          lastName,
          email,
          mobile,
          role,
          token: generateToken(_id),
        },
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  });
   validateSession = asyncHandler(async (req, res) => {
    // Assuming the request contains a bearer token in the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('No token provided or token is invalid');
    }

    const token = authHeader.split(' ')[1];

    // Verifying the token
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        // Token is valid, find the user by ID decoded from the token
        const user = await User.findById(decoded.id).select('-password -refreshToken');

        if (!user) {
            throw new Error('User not found');
        }

        // Respond with user data (excluding sensitive data like password)
        res.status(200).json({
            message: "Session is valid",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
            },
        });
    } catch (error) {
        // Token validation failed
        res.status(401).json({ message: 'Invalid token or session expired' });
    }
});

verifyTokenAndRole = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header

  if (!token) {
      return res.status(401).send({ message: 'Access denied. No token provided.' });
  }

  try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      const user = await User.findById(decoded.id); // Find the user based on the ID in the token

      if (!user) {
          return res.status(404).send({ message: 'User not found.' });
      }

      // Send back the user role
      res.json({ role: user.role });
  } catch (ex) {
      res.status(400).send({ message: 'Invalid token.' });
  }
};


handleRefreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new Error("No refresh token found in cookies");
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No refresh token found in the database");
  jwt.verify(refreshToken, process.env.TOKEN_KEY, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with the refresh token");
    } else {
      const accessToken = generateToken(decoded.id);
      res.json({ accessToken });
    }
  });
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access 
   logout = asyncHandler(async (req, res) => {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
  });


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
  