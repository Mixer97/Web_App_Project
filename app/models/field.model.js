const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: {
    type: String,
    enum: ["football", "volleyball", "basketball"],
    required: true,
  },
  address: { type: String, required: true },
slots: [
  {
    type: String,
    match: [
      /^([01]\d|2[0-3]):[0-5]\d\s*-\s*([01]\d|2[0-3]):[0-5]\d$/, 
      "Slot must be in the format HH:MM-HH:MM (e.g., 13:00-14:00)"
    ],
  },
],
});

const Field = mongoose.model("Field", fieldSchema);

module.exports = Field;
