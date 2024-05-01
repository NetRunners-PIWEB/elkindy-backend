const { Router } = require("express");
const InstrumentController = require("../../controllers/marketplaceController/instrument.controller.js");
const { authenticate } = require("../../middlewares/auth.js");

const router = Router();
router
  .route("/")
  .get(authenticate(), InstrumentController.getAllInstruments)
  .post(authenticate(), InstrumentController.addInstrument);

router.route("/search").get(InstrumentController.searchInstrument);

router
  .route("/:id/like")
  .patch(authenticate(), InstrumentController.addUserLike);

router.route("/:id").get(authenticate(), InstrumentController.getInstrument);
router.route("/students/:id").put(authenticate(), InstrumentController.AddStudentDetails);

router
  .route("/user/instruments")
  .get(authenticate(), InstrumentController.getUserInstruments);

router
  .route("/addusersearch")
  .post(authenticate(), InstrumentController.addUserSearch);
router
  .route("/user/usersearches")
  .get(authenticate(), InstrumentController.getUserSearches);

router.route("/predict").post(InstrumentController.callFlaskAPI);
router.delete("/user/usersearches/:id", InstrumentController.deleteUserSearch);

router.delete("/:id", InstrumentController.deleteInstrument);


module.exports = router;
