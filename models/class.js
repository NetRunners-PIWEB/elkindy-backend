const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema({
    name: String,
    duration: Date,
    capacity: Number,
    students:[String]
});

module.exports = mongoose.model("Class", classSchema);
