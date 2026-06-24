const express = require("express");
const { verifyToken } = require("../middleware/auth");
const {
  queryTournament,
  createTournament,
  getTournamentDetails,
  updateTournamentDetails,
  deleteTournament,
  createTournamentSchedule,
  getMatchList,
  getTournamentStandings,
  queryTeam,
  createTeam,
  getTeamDetails,
  updateTeam,
  deleteTeam,
  updateMatch,
} = require("../controllers/tournament.controller");

const router = express.Router();

router.get("/", queryTournament);
router.post("/", verifyToken, createTournament);
router.get("/:id", getTournamentDetails);
router.put("/:id", verifyToken, updateTournamentDetails);
router.delete("/:id", verifyToken, deleteTournament);
router.post("/:id/matches/generate", verifyToken, createTournamentSchedule);
router.get("/:id/matches", getMatchList);
router.put("/:id/matches/:matchId", verifyToken, updateMatch);
router.get("/:id/standings", getTournamentStandings);

router.get("/teams", queryTeam);
router.post("/:id/teams", verifyToken, createTeam);
router.get("/:id/teams", getTeamDetails);
router.put("/:id/teams/:teamId", verifyToken, updateTeam);
router.delete("/:id/teams/:teamId", verifyToken, deleteTeam);


module.exports = router;