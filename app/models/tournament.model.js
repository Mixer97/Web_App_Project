const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, enum: ['football', 'volleyball', 'basketball'], required: true },
  maxTeams: { type: Number, required: true },
  startDate: { type: String, required: true },
  creatorId: { type: String, required: true },
  status: { type: String, required: true },
});

const Tournament = mongoose.model("Tournament", tournamentSchema);

module.exports = Tournament;