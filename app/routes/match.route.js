const express = require("express");
const { verifyToken } = require("../middleware/auth");
const {
  getMatchDetails,
  updateMatchResult,
} = require("../controllers/match.controller");

const router = express.Router();


router.get("/:id", getMatchDetails);
router.put("/:id/result", verifyToken, updateMatchResult);


module.exports = router;
