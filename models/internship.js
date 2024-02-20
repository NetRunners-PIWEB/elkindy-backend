const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const internshipSchema = new Schema({
    startDate: Date,
    endDate: Date,
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'] }
});

module.exports = mongoose.model("Internship", internshipSchema);