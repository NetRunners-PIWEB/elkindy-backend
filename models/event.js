const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    location: String,
    capacity: Number,
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },

  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    //required: true,
  },
  status: {
    type: String,
    enum: ["Scheduled", "Active", "Completed", "Cancelled", "Postponed", "Pending"],
    default: "Scheduled",
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    //required: true
  },
  image: {
    type: String,
    default: ''
},
  eventType: {
    type: String,
    enum: ["Charity Concert", "Final Year Party", "Other"],
    default: "Other",
  },
  isArchived: {
    type: Boolean,
    default: false, 
  },
  tickets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
    },
  ],
 
  reservations: [
    {
        type: Schema.Types.ObjectId,
        ref: "Reservation",
    },
],
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  interestedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);
