const express = require("express");
// Require Controllers
const MatchController = require("../controllers/matchController");
const router = express.Router();

router
  .route("/:id")
  .get(MatchController.getMatch)
  .patch(MatchController.updateMatch)
  .delete(MatchController.deleteMatch);
router
  .route("/")
  .post(MatchController.createMatch)
  .get(MatchController.retrievematches);
// router.route("/:matchId").patch(MatchController.editMatch);

module.exports = router;
/*
updateMatch
createMatch
retrievematches
getMatch
*/
