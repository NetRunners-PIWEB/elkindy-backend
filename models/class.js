const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema({
    name: String,
    duration: Date,
    capacity: Number,
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
});

module.exports = mongoose.model("Class", classSchema);
