const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  
});

module.exports = mongoose.model("Feedback", feedbackSchema);