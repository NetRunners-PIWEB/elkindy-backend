const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/user");
const { access_token_secret, env } = require("../config/vars");

function authenticate(roles = []) {
  return async (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new ErrorResponse("Not Authenticated", 401));
    }
    try {
      const payload = jwt.verify(token, process.env.TOKEN_KEY);
      const user = await User.findById(payload.id);
      if (!user) {
        return next(new ErrorResponse("User Not Found", 404));
      }
      if (!roles.length || roles.includes(user.role)) {
        req.user = user;
        next();
      } else {
        return next(new ErrorResponse("Not Authorized ", 403));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = { authenticate };
