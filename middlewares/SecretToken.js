require("dotenv").config();
const jwt = require("jsonwebtoken");


//function to handle the token generation
module.exports.createSecretToken = (id) => {

  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};