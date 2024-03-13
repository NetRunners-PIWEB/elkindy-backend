const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const examSchema = new Schema({
    name: String,
    duration: Date,
    
});

module.exports = mongoose.model("Exam", examSchema);