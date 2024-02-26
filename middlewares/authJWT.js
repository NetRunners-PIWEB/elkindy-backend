const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/vars"); 
const User = require('../../models/user');

async function auth(req, res, next) {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, secretKey);

    // Check if the user exists in the database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Attach the user object to the request for further use in the route handler
    req.user = user;

    // Call the next middleware
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = auth;
