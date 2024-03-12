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
    enum: ["valid", "expired", "canceled"],
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
    // reservations: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Reservation",
  //   },
  // ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", ticketSchema);
