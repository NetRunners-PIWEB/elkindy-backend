const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reseravtionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users", // This references the internal users model
  },
  externalUser: {
    // Add a separate field for external user details
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
 
  status: {
    type: String,
    enum: ["pending", "confirmed", "canceled"],
    default: "pending",
  },
  ticketType: {
    type: String,
    enum: ["General Admission", "VIP", "Other"],
    // required: true,
  },
  ticketCount: {
    type: Number,
    // required: true,
  },
  isGuest: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Reservation", reseravtionSchema);
