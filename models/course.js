const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: {
        type: String,
        enum: ['Violon Ori', 'Initiation', 'Prep', '1er', '2eme', '3eme', '4eme', '5eme', '6eme', 'Diplome', '1ere Adult','2eme Adult','3eme Adult', 'Instrument', 'Peinture', 'Danse', 'Robotique', 'Théâtre'],
        required: true
    },
    teacher: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    price: {
        type: Number,
        required: true
    },
    startDate: Date,
    endDate: Date,
    maxStudents: Number,
    isArchived: {
        type: Boolean,
        default: false
    },

    isInternship: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Course', courseSchema);
