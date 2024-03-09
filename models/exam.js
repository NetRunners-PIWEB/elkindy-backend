const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;

const examSchema = new Schema({
    name: String, // Le nom de l'examen
    startDate: Date, // Date de début de l'examen
    duration: String, // Durée de l'examen en minutes
     
    type: {
        type: String,
        enum: ["exam", "evaluation"],
        required: true,
      },
    // Références aux autres entités
    //course: { type: Schema.Types.ObjectId, ref: "Course" }, // Référence au cours associé à cet examen
    teacher: String, // Référence à l'utilisateur (enseignant) qui a créé cet examen
    students: [{ String }], // Liste des étudiants associés à cet examen 
    classe: String
    
   
});

module.exports = mongoose.model("Exam", examSchema);
