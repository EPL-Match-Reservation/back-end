const express = require("express");
// Require Controllers
const MatchController = require("../controllers/matchController");
const router = express.Router();

router.route("/:matchId").get(MatchController.getMatch);
router.route("/").post(MatchController.createMatch);
router.route("/").get(MatchController.retrievematches);
router.route("/:matchId").patch(MatchController.editMatch);

module.exports = router;
