const User = require("../models/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
//userverfication using the cookies 
module.exports.authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
      return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
      if (err) {
          return next(new Error("User not verified"));
      } else {
          const user = await User.findById(data.id);
          if (user) {
              req.user = user; // Optionally, set user data to the request for later use
              return next(); // User verified, proceed to the next middleware or route handler
          } else {
              return next(new Error("User not found")); // This can be handled in error middleware
          }
      }
  });
};

module.exports.isAdmin = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
      throw new Error("User not verified");
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
      if (err) {
          throw new Error("User not verified");
      } else {
          const user = await User.findById(data.id);
          if (!user) {
              throw new Error("User not found");
          } else {
              if (user.role !== "admin") {
                  throw new Error("You are not an admin");
              } else {
                  next();
              }
          }
      }
  });
});

exports.userVerification = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer Token
  
    if (!token) {
      return res.status(403).json({ message: "A token is required for authentication" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }
  };