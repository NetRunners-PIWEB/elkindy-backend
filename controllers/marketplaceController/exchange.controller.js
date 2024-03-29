const mongoose = require("mongoose");
const Exchange = require("../../models/exchange.js");
const { formatSort } = require("../../utils/formatQueries.js");
const {
  allExchangesPipeline,
  latestTradesPipeline,
} = require("../../utils/exchangePipeline.js");
class ExchangeController {
  static async createExchange(req, res, next) {
    try {
      const data = req.body;
      const senderId = req.user.id;
      const exist = await Exchange.findOne({
        sender: senderId,
        receiver: data.receiver,
        senderInstrument: data.senderInstrument,
        receiverInstrument: data.receiverInstrument,
      });
      if (exist) {
        return res
          .status(409)
          .json({ error: "This exchange request has already been sent" });
      }
      const exchangeData = {
        sender: senderId,
        receiver: data.receiver,
        senderInstrument: data.senderInstrument,
        receiverInstrument: data.receiverInstrument,
      };
      const exchange = new Exchange(exchangeData);
      await exchange.save();
      return res.status(201).json({ success: true, exchange });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
      });
    }
  }
  static async findExchangesReceivedByUser(req, res, next) {
    try {
      const userId = req.user.id;
      const sortBy = formatSort(req.query.sort);
      const status = req.query.status;
      const itemId = req.params.id;
      const statuses = ["accepted", "rejected", "requested"];
      let receivedExchanges = await Exchange.aggregate(
        allExchangesPipeline(userId, itemId, statuses, sortBy)
      ).exec();
      res.status(200).json({ success: true, receivedExchanges });
    } catch (error) {
      res.status(500).json({
        success: false,
      });
      next(error);
    }
  }

  static async findLatestTrades(req, res, next) {
    try {
      const userId = req.user.id;
      const sortBy = formatSort(req.query.sort);
      const statuses = ["accepted", "rejected"];
      let recentTrades = await Exchange.aggregate(
        latestTradesPipeline(userId, statuses, sortBy)
      ).exec();
      res.status(200).json({ success: true, recentTrades });
    } catch (error) {
      res.status(500).json({
        success: false,
      });
      next(error);
    }
  }

  static async findExchangesSentByUser(req, res, next) {
    try {
      const userId = req.user.id;
      const exchangesSent = await Exchange.find({ sender: userId });
      res.status(200).json({ success: true, exchangesSent });
    } catch (error) {
      next(error);
    }
  }
  static async updateTradeStatus(req, res, next) {
    try {
      const { id } = req.params;
      console.log(id);
      const { status } = req.body;
      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const exchange = await Exchange.findById(id);
      if (!exchange) {
        return res.status(404).json({ error: "Exchange not found" });
      }
      exchange.status = status;
      await exchange.save();
      res
        .status(200)
        .json({ success: true, message: "Trade status updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
      next(error);
    }
  }
}
module.exports = ExchangeController;
