const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  torunamentId: { type: String, required: true },
  homeTeamId: { type: String, required: true },
  awayTeamId: { type: String, required: true },
  date: { type: String, required: true },
  fieldId: { type: String, required: true },
  status: { type: String, required: true },
  result: { type: String, required: true },
});

module.exports = matchSchema;