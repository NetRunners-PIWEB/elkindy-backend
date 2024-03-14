const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gradeSchema = new Schema({
    examName: String, 
    studentName: String, 
    grade: Number, 
    level: String,
    type: {
        type: String,
        enum: ["evaluation", "exam"] 
    }
    
});

module.exports = mongoose.model("Grade", gradeSchema);
