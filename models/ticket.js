const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending payment", "valid", "expired", "canceled"],
    default: "pending payment",
    required: true,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    //required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
    reservations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
    },
  ],
  ticketType: {
    type: String,
    enum: ["General Admission", "VIP", "Other"], 
    default: "General Admission",
  },
  barcode: {
    type: String,
    unique: true, 
  },
  quantity: {
    type: Number,
    default: 1, 
  },
  seat: {
    type: String, // Store seat number or section information
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", ticketSchema);
