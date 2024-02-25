const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema({
    name: String,
    duration: Date,
    capacity: Number
});

module.exports = mongoose.model("Class", classSchema);
