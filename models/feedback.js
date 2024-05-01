const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
    
    // Ratings for overall event experience
    entertainmentRating: Number,
    inspirationRating: Number,
    themeRelevance: Number, // How relevant was the theme to the conservatory's objectives?
    valueForMoney: Number,
    bestPart: String,
    recommend: String,

    // Specific feedback for student performances
    performersQuality: {
        overallQuality: Number, 
        themeAlignment: Number, 
        audienceEngagement: Number 
    },

    presentersFeedback: {
        interesting: Number,
        relevant: Number,
        inspiring: Number
    },

    // Venue and logistic feedback
    venueSatisfaction: Boolean,
    venueIssues: String,
    foodQuality: Number,
    foodSelection: String,
    venueFeature: String,

    // Suggestions for improvement
    improvements: String,
    futureTopics: String,
    finalComments: String,

    // Optional contact details for follow-up
    contactDetails: {
        name: String,
        email: String,
        phone: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});
  
module.exports = mongoose.model("Feedback", feedbackSchema);