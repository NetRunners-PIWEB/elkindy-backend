const { Router } = require("express");
const InstrumentController = require("../controllers/instrument.controller.js");
const { authenticate } = require("../middlewares/auth.js");

const router = Router();
router
  .route("/")
  .get(authenticate(), InstrumentController.getAllInstruments)
  .post(authenticate(), InstrumentController.addInstrument);

router.route("/search").get(InstrumentController.searchInstrument);

router
  .route("/:id/like")
  .patch(authenticate(), InstrumentController.addUserLike);

router.route("/:id").get(InstrumentController.getInstrument);

router
  .route("/user/instruments")
  .get(authenticate(), InstrumentController.getUserInstruments);

router.delete("/:id", InstrumentController.deleteInstrument);

module.exports = router;
