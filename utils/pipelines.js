const Instrument = require("../models/instrument.js");
const mongoose = require("mongoose");

const allInstrumentsPipeline = (userId, status, sortingObj) => {
  const match = {
    $match: {
      status: {
        $in: ["exchange", "maintenance", "available for borrow", "buy"],
      },
    },
  };
  if (status) {
    match.$match.status = status;
  }
  return reusableInstrumentPipeline(userId, match, sortingObj);
};

const instrumentPipeline = (instrumentId, userId) => {
  const match = {
    $match: {
      _id: instrumentId,
    },
  };

  return reusablePipeline(userId, match);
};

module.exports = { allInstrumentsPipeline, instrumentPipeline };

const reusableInstrumentPipeline = (userId, match, sort, ops) => {
  const pipelineArray = [
    {
      $lookup: {
        from: "user",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $project: {
        _id: 1,
        "author.lastName": 1,
        "author.firstName": 1,
        title: 1,
        type: 1,
        brand: 1,
        details: 1,
        condition: 1,
        status: 1,
        likeScore:1,
      },
    },
  ];

  if (ops) {
    pipelineArray.push(...ops);
  }
  console.log(sort)

  const res = sort
    ? [match, sort].concat(pipelineArray)
    : [match].concat(pipelineArray);

  return Instrument.aggregate(res).pipeline();
};
