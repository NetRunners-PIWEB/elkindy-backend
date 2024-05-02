const Instrument = require("../models/instrument.js");
const mongoose = require("mongoose");

const allInstrumentsPipeline = (
  userId,
  status,
  age,
  sortingObj,
  searchQuery,
  pageNumber,
  pageSize
) => {
  const match = {
    $match: {
      status: {
        $in: ["exchange", "maintenance", "available for borrow", "sell"],
      },
      itemStatus: "active",
    },
  };
  if (status) {
    match.$match.status = status;
  }
  if (age) {
    match.$match.age = age;
  }

  return reusableInstrumentPipeline(
    userId,
    match,
    sortingObj,
    null,
    searchQuery,
    pageNumber,
    pageSize
  );
};

const instrumentPipeline = (instrumentId, userId) => {
  const match = {
    $match: {
      _id: instrumentId,
    },
  };

  return reusableInstrumentPipeline(userId, match);
};

module.exports = { allInstrumentsPipeline, instrumentPipeline };

const reusableInstrumentPipeline = (
  userId,
  match,
  sort,
  ops,
  search,
  pageNumber,
  pageSize
) => {
  const pipelineArray = [
    { $addFields: { v: 0 } },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $project: {
        _id: 1,
        "author._id": 1,
        "author.firstName": 1,
        "author.lastName": 1,
        "author.phoneNumber": 1,
        title: 1,
        type: 1,
        brand: 1,
        details: 1,
        condition: 1,
        status: 1,
        likeScore: 1,
        img: 1,
        createdAt: 1,
        price: 1,
        itemStatus: 1,
        age:1
      },
    },
  ];

  if (search) {
    pipelineArray.unshift({
      $match: {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
        ],
      },
    });
  }
  if (ops) {
    pipelineArray.push(...ops);
  }

  let liked = null;

  if (userId) {
    liked = {
      $cond: {
        if: {
          $ne: [
            {
              $indexOfArray: ["$likes", new mongoose.Types.ObjectId(userId)],
            },
            -1,
          ],
        },
        then: 1,
        else: 0,
      },
    };
  }
  if (userId) {
    pipelineArray[2].$project.liked = liked;
  }

  const res = sort
    ? [match, sort].concat(pipelineArray)
    : [match].concat(pipelineArray);

  return Instrument.aggregate(res).pipeline();
};
