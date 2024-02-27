const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String, 
    firstName: String, 
    lastName: String, 
    age: Number,
    email: String, 
    password: String, 
    registrationDate: Date,
    endDate: Date,
    dateOfBirth: Date, 
    phoneNumber: String, 
    gender: String, 
    address: String, 
    image: String,
    createdAt: Date, 
    updatedAt: Date, 
    status: {
        type: String,
        enum:["active", "inactive","deleted","suspended"],
      },

      isDeleted: {
        type: Boolean,
        default: false,
      },
    role: {
        type: String,
        enum: ["admin", "teacher", "student"],
        required: true,
    },
   
});

module.exports = mongoose.model("Users", userSchema);