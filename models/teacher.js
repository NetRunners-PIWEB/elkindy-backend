const mongoose = require("mongoose");
const { Schema } = mongoose;

const teacherSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user', // Ensure this matches your User model's name
    required: true,
  },
  professionalDetails: {
    degree:String , /*[{
     degree: String,
      field: String,
      institution: String,
      yearCompleted: Number,
    }],*/
    specialization: String,
    teachingExperience:Number/* {
      years: Number,
      details: [String],
    },*/,

    coursesTaught: String,
  },
 /* teachingPreferences: {
      classSize: Number,
      studentAgeGroup: String,
      studentLevel: String,
  },*/

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

teacherSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Teacher", teacherSchema);
