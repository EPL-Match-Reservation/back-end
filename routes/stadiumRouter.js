const express = require("express");
const router = express.Router();

const StadiumController = require("../controllers/stadiumController");

router
  .route("/")
  .get(StadiumController.getStadiums)
  .post(StadiumController.addStadium);

router
  .route("/:id")
  .get(StadiumController.getStadium)
  .patch(StadiumController.updateStadium)
  .delete(StadiumController.deleteStadium);

// to get stadium by name
router.route("/name").post(StadiumController.getStadiumByName);

module.exports = router;
