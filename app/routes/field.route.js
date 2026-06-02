const express = require("express");
const User = require("../models/user.model");
const Field = require("../models/field.model");
const { verifyToken } = require("../middleware/auth");
const {
  fieldQuery,
  getFieldDetails,
  getFieldAvailability,
  createFieldBooking,
  cancelFieldBooking,
} = require("../controllers/field.controller");

const router = express.Router();

router.get("/", fieldQuery);
router.get("/:id", getFieldDetails);
router.get("/:id/slots", getFieldAvailability);
router.post("/:id/bookings", verifyToken, createFieldBooking);
router.delete("/:id/bookings/:bookingId", verifyToken, cancelFieldBooking);

module.exports = router;
