const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const observationSchema = new Schema({
    date: Date,
    
});

module.exports = mongoose.model("Observation", observationSchema);