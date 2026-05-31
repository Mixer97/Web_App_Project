const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  fieldId: { type: String, required: true },
  userId: { type: String, required: true },
  date: { type: String, required: true },  
  slot: { type: String, required: true }   
});

module.exports = bookingSchema;