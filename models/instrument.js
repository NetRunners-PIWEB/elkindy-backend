const mongoose = require("mongoose");
const instrumentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    title: {
      type: String,
      unique: true,
      required: true,
    },

    type: {
      type: String,
      required: false,
    },
    brand: {
      type: String,
      required: false,
    },
    details: {
      type: String,
      require: true,
    },
    condition: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["exchange", "maintenance", "available for borrow", "buy"],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    likeScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Instrument", instrumentSchema);
