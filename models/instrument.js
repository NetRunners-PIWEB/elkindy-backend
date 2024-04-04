const mongoose = require("mongoose");
const ages = ["3-5", "4-5", "4-6", "5-7", "7-9", "9-12", "Adult"];
const instrumentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    img: {
      type: String,
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
      enum: ["exchange", "maintenance", "available for borrow", "sell"],
    },
    itemStatus: {
      type: String,
      required: true,
      enum: ["active", "deleted", "traded"],
      default: "active",
    },
    age: {
      type: String,
      required: true,
      enum: ages,
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
