const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: String,
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    topicsCovered: String,



});
module.exports = mongoose.model('Subject', subjectSchema);
