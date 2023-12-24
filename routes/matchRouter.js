const express = require("express");
// Require Controllers
const MatchController = require("../controllers/matchController");
const router = express.Router();

router
  .route("/:matchId")
  .get(MatchController.getMatch)
  .patch(MatchController.updateMatch);
router.route("/").post(MatchController.createMatch);
router.route("/").get(MatchController.retrievematches);

module.exports = router;
/*
updateMatch
createMatch
retrievematches
getMatch
*/
