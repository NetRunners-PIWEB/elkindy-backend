const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: String,
    
  
});

module.exports = mongoose.model("Course", courseSchema);
