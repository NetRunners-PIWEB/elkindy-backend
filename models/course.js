<<<<<<< HEAD
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: {
        type: String,
        enum: ['Violon Ori', 'Initiation', 'Prep', '1er', '2eme', '3eme', '4eme', '5eme', '6eme', 'Diplome', '2eme Adu', 'Instrument', 'Peinture', 'Danse', 'Robotique', 'Théâtre'],
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    //TODO: Prices
});

module.exports = mongoose.model('Course', courseSchema);
=======
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: String,
    
  
});

module.exports = mongoose.model("Course", courseSchema);
>>>>>>> 1d2ec6cb46d73e3518cdb4619a40198741863bd7
