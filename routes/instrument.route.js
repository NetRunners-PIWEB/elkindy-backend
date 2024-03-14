const { Router } = require("express");
const InstrumentController = require("../controllers/instrument.controller.js");
const { authenticate } = require("../middlewares/auth.js");

const router = Router();
router
  .route("/")
  .get(authenticate(), InstrumentController.getAllInstruments)
  .post(authenticate(), InstrumentController.addInstrument);

router
  .route("/search")
  .get(authenticate(), InstrumentController.searchInstrument);

router
  .route("/:id/like")
  .patch(authenticate(), InstrumentController.addUserLike);

router.route("/:id").get(InstrumentController.getInstrument);

router
  .route("/user/instruments")
  .get(authenticate(), InstrumentController.getUserInstruments);

module.exports = router;
