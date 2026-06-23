const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  tournamentId: { type: String, required: true },
  name: { type: String, required: true },
  players: [{
    name: { type: String, required: true },
    surname: { type: String, required: true },
    jerseyNumber: { type: Number, required: false },
  }],
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;