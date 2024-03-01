const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: String,
    code: String,
    type: String,
    schedule: Date
    
  
});

module.exports = mongoose.model("Course", courseSchema);
