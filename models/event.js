const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    location: String,
    capacity: Number
});

module.exports = mongoose.model("Event", eventSchema);
