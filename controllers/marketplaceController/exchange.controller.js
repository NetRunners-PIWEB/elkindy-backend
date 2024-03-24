const mongoose = require("mongoose");
const Exchange = require("../../models/exchange.js");
const { formatSort } = require("../../utils/formatQueries.js");
const { allExchangesPipeline } = require("../../utils/exchangePipeline.js");
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
      data.sender = senderId;
      const exchange = new Exchange(data);
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
      let receivedExchanges = await Exchange.aggregate(
        allExchangesPipeline(userId,itemId, status, sortBy)
      ).exec();
      res.status(200).json({ success: true, receivedExchanges });
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
}
module.exports = ExchangeController;
