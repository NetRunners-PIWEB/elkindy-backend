const Exchange = require("../models/exchange.js");
const mongoose = require("mongoose");

const allExchangesPipeline = (userId, itemId, statuses, sortingObj) => {
  const match = {
    $match: {
      $or: [
        { receiver: new mongoose.Types.ObjectId(userId) },
        { sender: new mongoose.Types.ObjectId(userId) },
      ],
      receiverInstrument: new mongoose.Types.ObjectId(itemId),
      status: { $in: statuses },
    },
  };

  return reusableExchangePipeline(match, sortingObj);
};

const latestTradesPipeline = (userId, statuses) => {
  const match = {
    $match: {
      $or: [
        { receiver: new mongoose.Types.ObjectId(userId) },
        { sender: new mongoose.Types.ObjectId(userId) },
      ],
      status: { $in: statuses },
    },
  };

  return reusableExchangePipeline(match);
};

module.exports = { allExchangesPipeline, latestTradesPipeline };

const reusableExchangePipeline = (match, sort) => {
  const pipelineArray = [
    {
      $lookup: {
        from: "instruments",
        localField: "receiverInstrument",
        foreignField: "_id",
        as: "receiverInstrumentDetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "senderDetails",
      },
    },
    {
      $lookup: {
        from: "instruments",
        localField: "senderInstrument",
        foreignField: "_id",
        as: "senderInstrumentDetails",
      },
    },
    {
      $project: {
        sender: {
          id: { $arrayElemAt: ["$senderDetails._id", 0] },
          firstName: { $arrayElemAt: ["$senderDetails.firstName", 0] },
          lastName: { $arrayElemAt: ["$senderDetails.lastName", 0] },
          email: { $arrayElemAt: ["$senderDetails.email", 0] },
          phoneNumber: { $arrayElemAt: ["$senderDetails.phoneNumber", 0] },
          senderInstrument: { $arrayElemAt: ["$senderInstrumentDetails", 0] },
        },
        receiverInstrument: { $arrayElemAt: ["$receiverInstrumentDetails", 0] },
        status: 1,
        createdAt: 1,
      },
    },
  ];

  if (!match.$match.receiverInstrument) {
    pipelineArray.splice(1, 0, {
      $lookup: {
        from: "instruments",
        localField: "receiverInstrument",
        foreignField: "_id",
        as: "receiverInstrumentDetails",
      },
    });
  }
  const res = sort
    ? [match, sort, ...pipelineArray]
    : [match, ...pipelineArray];
  return Exchange.aggregate(res).pipeline();
};
