const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: String,
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    teacher: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    notes: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
        note: Number
    }],
    attendance: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Excused'],
            required: true
        }
    }],
    assignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
    }],

});
module.exports = mongoose.model('Class', classSchema);
