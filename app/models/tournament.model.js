const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: {
    type: String,
    enum: ["football", "volleyball", "basketball"],
    required: true,
  },
  maxTeams: { type: Number, required: true},
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
  creatorId: { type: String, required: true },
  status: {
    type: String,
    enum: ["upcoming", "active", "completed"],
    required: true,
  },
  teamIds: [{ type: String, required: false }],
});

const Tournament = mongoose.model("Tournament", tournamentSchema);

module.exports = Tournament;
