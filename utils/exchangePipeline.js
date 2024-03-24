const Exchange = require("../models/exchange.js");
const mongoose = require("mongoose");

const allExchangesPipeline = (userId, itemId, status, sortingObj) => {
  const match = {
    $match: {
      receiver: new mongoose.Types.ObjectId(userId),
      receiverInstrument: new mongoose.Types.ObjectId(itemId),
    },
  };

  if (status) {
    match.$match.status = status;
  }

  return reusableExchangePipeline(match, sortingObj);
};

module.exports = { allExchangesPipeline };

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

  const res = sort
    ? [match, sort, ...pipelineArray]
    : [match, ...pipelineArray];
  return Exchange.aggregate(res).pipeline();
};
