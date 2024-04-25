const mongoose = require("mongoose");
const userSearch = new mongoose.Schema({
  userId: { type: String, required: true },
  searchQuery: { type: String, required: false },
  status: { type: String, required: false },
  age: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("UserSearch", userSearch);
