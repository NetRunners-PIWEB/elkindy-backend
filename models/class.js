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
    assignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
    }],
    maxStudents: Number,
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    schedule: [{
        start: Date,
        end: Date,
    }],
    recurring: {
        type: Boolean,
        default: false
    },
    recurringType: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly'],
    },
    recurringEnd: Date,
    sessions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    }],

});
module.exports = mongoose.model('Class', classSchema);
