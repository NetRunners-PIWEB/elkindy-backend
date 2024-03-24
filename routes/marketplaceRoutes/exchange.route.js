const express = require("express");
const ExchangeController = require("../../controllers/marketplaceController/exchange.controller.js");
const { authenticate } = require("../../middlewares/auth.js");
const router = express.Router();

router.post("/create", authenticate(), ExchangeController.createExchange);
router.get(
  "/received/:id",
  authenticate(),
  ExchangeController.findExchangesReceivedByUser
);
router.get("/sent", authenticate(), ExchangeController.findExchangesSentByUser);
module.exports = router;
