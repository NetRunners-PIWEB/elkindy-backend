const { Router } = require("express");
const InstrumentController = require("../controllers/instrument.controller.js");

const router = Router();
router
  .route("/")
  .get(InstrumentController.getAllInstruments)
  .post(InstrumentController.addInstrument);

router.route("/search").get(InstrumentController.searchInstrument);

router.route("/:id/like").patch(InstrumentController.addUserLike);

router.route("/:id").get(InstrumentController.getInstrument);

router.route("/user/:userId").get(InstrumentController.getUserInstruments);

module.exports = router;
