const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  tournamentId: { type: String, required: true },
  homeTeamId: { type: String, required: true },
  awayTeamId: { type: String, required: true },
  startDate: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2}-\d{2}$/, "startDate must be in YYYY-MM-DD format"],
    validate: {
      validator: (value) => {
        const [y, m, d] = value.split("-").map(Number);
        const dt = new Date(Date.UTC(y, m - 1, d));
        return (
          dt.getUTCFullYear() === y &&
          dt.getUTCMonth() + 1 === m &&
          dt.getUTCDate() === d
        );
      },
      message: "startDate must be a valid calendar date",
    },
  },
  fieldId: { type: String, default: null },
  slot: { type: String, default: null },
  status: { type: String, enum: ["upcoming", "played"], required: true },
  result: { type: String, required: true },
});

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
