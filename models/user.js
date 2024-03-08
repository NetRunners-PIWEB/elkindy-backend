const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({

  username: {
    type: String,
    unique: true,
    required: [true, "Your username is required"],
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  age: Number,
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  }, 
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
  dateOfBirth: Date,
  phoneNumber: {
    type: String,
    unique: true,
  },
  gender: String,
  address: String,
  image: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: Date,
  role: {
    type: String,
    enum: ["admin", "teacher", "student"],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "deleted", "suspended","offboarded","archived"],
    default: "active",
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },


});


userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});
module.exports = mongoose.model("Users", userSchema);
