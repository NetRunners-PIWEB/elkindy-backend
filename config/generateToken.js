const jwt = require("jsonwebtoken");

const generateToken =  (id) => {
    if(!id){
        throw new Error("Invalid token")
    }else {
       return jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: "3d" });
    }
};

module.exports = generateToken