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
    const pageIndex = req.query.pageNumber;
    const size = req.query.pageSize || 10;
    try {
      let instruments = await Instrument.aggregate(
        allInstrumentsPipeline(req.user?.id, status, sortBy, null)
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
      const { title, type, brand, details, condition, price, status } =
        req.body;
      const author = req.user?.id;
      const instrument = new Instrument({
        author,
        title,
        type,
        brand,
        details,
        price,
        condition,
        status,
      });

      await instrument.save();

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
      const instrument = await Instrument.findById(id);
      if (instrument) {
        let liked = false;
        const userIndex = instrument.likes.indexOf(req.user.id);
        if (userIndex !== -1) {
          instrument.likes.splice(userIndex, 1);
          instrument.likeScore -= 1;
        } else {
          instrument.likes.push(req.user.id);
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
    }
  }
  static async getInstrument(req, res, next) {
    try {
      const instrumentId = req.params.id
        ? new mongoose.Types.ObjectId(req.params.id)
        : "";
      const userId = new mongoose.Types.ObjectId("65d517bddf2aa46349809694");
      const aggregate = await Instrument.aggregate(
        instrumentPipeline(instrumentId, null)
      );
      const [instrument] = await Instrument.populate(aggregate, {
        path: "comments",
      });
      res.status(200).json({
        success: true,
        instrument: { ...instrument, author: instrument.author[0] },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
      });
      next(err);
    }
  }

  static async searchInstrument(req, res, next) {
    try {
      const searchQuery = req.query.query;
      const sortBy = formatSort(req.query.sort);
      const status = req.query.status;
      let instruments = await Instrument.aggregate(
        allInstrumentsPipeline(
          req.user?.id || null,
          status,
          sortBy,
          searchQuery
        )
      ).exec();
      res.status(200).json({
        success: true,
        instruments,
        total_results: instruments.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
      });
      next(error);
    }
  }
  static async getUserInstruments(req, res, next) {
    try {
      const userId = req.user.id;
      const instruments = await Instrument.find({ author: userId }).exec();
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
  static async deleteInstrument(req, res, next) {
    try {
      const instrumentId = req.params.id;
      const instrument = await Instrument.findByIdAndDelete(instrumentId);
      if (!instrument) {
        return next(new ErrorResponse("Instrument not found", 404));
      }
      // if (instrument.author !== req.user.id) {
      //   return next(
      //     new ErrorResponse("Not authorized to delete this instrument", 403)
      //   );
      // }
      res.status(200).json({
        success: true,
        data: {},
      });
    } catch (err) {
      next(err);
    }
  }
}
module.exports = InstrumentController;
