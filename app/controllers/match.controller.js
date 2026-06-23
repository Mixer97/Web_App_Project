const Match = require("../models/match.model");
const Tournament = require("../models/tournament.model");

const getMatchDetails = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ msg: "Match not found" });
    }
    return res.status(200).json(match);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const updateMatchResult = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    const tournament = await Tournament.findById(match.tournamentId);
    const userId = req.userId;

    if (!tournament) {
      return res.status(404).json({ msg: "Tournament not found" });
    }

    if (!match) {
      return res.status(404).json({ msg: "Match not found" });
    }

    if (!(userId === tournament.creatorId)) {
      return res
        .status(403)
        .json({ msg: "Cannot modify a tournament created by another user" });
    }

    const today = new Date().toISOString().split("T")[0];
    if (match.startDate > today) {
      return res
        .status(400)
        .json({ msg: "Cannot submit result for a future match" });
    }

    const { homeScore, awayScore } = req.body;

    if (
      !Number.isInteger(homeScore) ||
      !Number.isInteger(awayScore) ||
      homeScore < 0 ||
      awayScore < 0
    ) {
      return res
        .status(400)
        .json({ msg: "Scores must be non-negative integers" });
    }

    if (tournament.sport !== "football" && homeScore === awayScore) {
      return res
        .status(400)
        .json({ msg: "Draws are not allowed in this sport" });
    }

    match.set({
      result: `${homeScore}-${awayScore}`,
      status: "played",
    });

    await match.save();

    const unplayedCount = await Match.countDocuments({
      tournamentId: tournament._id,
      status: "played",
    });

    if (unplayedCount === 0) {
      tournament.set({ status: "completed" });
      await tournament.save();
    }

    return res.status(201).json({ msg: "Match result update successfull" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

module.exports = {
  getMatchDetails,
  updateMatchResult,
};
