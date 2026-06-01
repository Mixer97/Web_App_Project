const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, enum: ['football', 'volleyball', 'basketball'], required: true },
  address: { type: String, required: true },
  slots: [{ type: String }]
});

const Field = mongoose.model("Field", fieldSchema);

module.exports = Field;