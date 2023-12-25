const express = require("express");
const router = express.Router();

const TeamController = require("../controllers/teamController");

router
  .route("/")
  .get(TeamController.getTeams)
  .post(TeamController.addTeam);

router
  .route("/:id")
  .get(TeamController.getTeam)
  .patch(TeamController.updateTeam)
  .delete(TeamController.deleteTeam);

// to get team by name
router.route("/name").post(TeamController.getTeamByName);

module.exports = router;
