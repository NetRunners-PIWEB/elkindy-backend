const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reseravtionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    //required: true
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Reservation", reseravtionSchema);
