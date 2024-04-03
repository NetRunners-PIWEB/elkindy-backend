const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.TOKEN_KEY, { expiresIn: "1h" });
};

const authMiddleware = (req, res, next) => {
  if (!req.headers) {
    req.headers = {};
  }
  const token = generateToken("65fda83050e4769c343e9c63");
  req.headers.authorization = `Bearer ${token}`;
  console.log(token)
};

module.exports = authMiddleware;
