const express = require("express");
const { container } = require("../di-setup");
const MatchController = container.resolve("MatchController");

const router = express.Router();

router.route("/:matchId").get(MatchController.getMatch);
router.route("/").post(MatchController.createMatch);
router.route("/").get(MatchController.retrievematches);

module.exports = router;

