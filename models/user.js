const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
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
    required: false,
    unique: true,
  },
  password: {
    type: String,
    default: null,
  }, 
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
  dateOfBirth: Date,
  phoneNumber: {
    type: String,
    default: null,
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
    enum: ["active", "inactive", "deleted", "suspended"],
    default: "active",
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

userSchema.statics.register = async (email, password) => {
  const exists = await User.findOne({ email })
  if (exists){
    throw Error('Email already in use')
  }
}
module.exports = mongoose.model("Users", userSchema);
