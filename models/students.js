const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const student = new Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    birthDate: Date,
    observations: [
        {
            type: Schema.Types.ObjectId,
            ref: "Observation"
        }
    ],
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course"
    },
    club: {
        type: Schema.Types.ObjectId,
        ref: "Course"
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    class:{
        type: Schema.Types.ObjectId,
        ref: "Class"
    },
});

module.exports = mongoose.model("Student", student);
