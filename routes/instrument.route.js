const { Router } = require("express");
const InstrumentController = require("../controllers/instrument.controller.js");

const router = Router();
router
  .route("/")
  .get(InstrumentController.getAllInstruments)
  .post(InstrumentController.addInstrument);
router.route("/:id/like").patch(InstrumentController.addUserLike);

module.exports = router;
