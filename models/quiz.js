const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    question: [String],
    score: Number,
    level: String,
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'Users' 
    }
});

module.exports = mongoose.model("Quiz", quizSchema);