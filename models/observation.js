const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const observationSchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    description: String
});

module.exports = mongoose.model("Observation", observationSchema);
