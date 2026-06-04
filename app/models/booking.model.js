const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  fieldId: { type: String, required: true },
  userId: { type: String, required: true },
  date: { type: String, required: true },  
  slot: {
  type: String,
  match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Slot must be HH:MM"]
} 
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;