const Instrument = require("../models/instrument.js");
const {
  allInstrumentsPipeline,
  instrumentPipeline,
} = require("../utils/pipelines.js");
const { formatSort } = require("../utils/formatQueries.js");
const mongoose = require("mongoose");
class InstrumentController {
  static async getAllInstruments(req, res, next) {
    const sortBy = formatSort(req.query.sort);
    const status = req.query.status;

    try {
      let instruments = await Instrument.aggregate(
        allInstrumentsPipeline(req.user?.id || null, status, sortBy)
      ).exec();
      res.status(200).json({
        success: true,
        instruments,
        total_results: instruments.length,
      });
    } catch (err) {
      next(err);
      res.status(500).json({
        success: false,
      });
    }
  }
  static async addInstrument(req, res, next) {
    try {
      const { title, type, brand, details, condition, status } = req.body;
      const author = req.user?.id;
      await Instrument.create({
        author,
        title,
        type,
        brand,
        details,
        condition,
        status,
      });

      res.status(201).json({
        success: true,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
      });
      next(err);
    }
  }
  static async addUserLike(req, res, next) {
    try {
      const id = req.params.id;
      console.log(req.params);
      console.log(id);
      const instrument = await Instrument.findById(id);
      if (instrument) {
        let liked = false;
        const userIndex = instrument.likes.indexOf("65d517bddf2aa46349809694");
        if (userIndex !== -1) {
          instrument.likes.splice(userIndex, 1);
          instrument.likeScore -= 1;
        } else {
          instrument.likes.push("65d517bddf2aa46349809694");
          liked = true;
          instrument.likeScore += 1;
        }
        await instrument.save();
        res.status(200).json({
          success: true,
          likeScore: instrument.likeScore,
          liked,
        });
      } else {
        return next(new ErrorResponse("Instrument not found", 404));
      }
    } catch (err) {
      next(err);
      r;
    }
  }
  static async getInstrument(req, res, next) {
    try {
      const instrumentId = req.params.id
        ? new mongoose.Types.ObjectId(req.params.id)
        : "";
      const userId = new mongoose.Types.ObjectId("65d517bddf2aa46349809694");
      const aggregate = await Instrument.aggregate(
        instrumentPipeline(instrumentId, userId)
      );
      const [instrument] = await Instrument.populate(aggregate, {
        path: "comments",
      });
      console.log(aggregate);
      res.status(200).json({
        success: true,
        instrument: { ...instrument, author: instrument.author[0] },
      });
    } catch (err) {
      next(err);
    }
  }
}
module.exports = InstrumentController;
