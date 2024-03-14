const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const observationSchema = new Schema({
    date: Date,
    student: String,
    description: String 
    
});

module.exports = mongoose.model("Observation", observationSchema);