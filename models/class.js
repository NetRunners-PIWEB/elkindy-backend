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
    },
    startTime: {
        type: Date,
    },
    endTime: {
        type: Date,
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
    maxStudents: Number,
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],

});
module.exports = mongoose.model('Class', classSchema);
