const jwt = require("jsonwebtoken");

const generateRefreshToken =  (id) => {
    if(!id){
        throw new Error("Invalid refresh token")
    }else {
       return jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: "1" });
    }
};

module.exports = generateRefreshToken