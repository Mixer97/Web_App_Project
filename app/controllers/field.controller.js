const Field = require("../models/field.model");
const Booking = require("../models/booking.model");

const fieldQuery = async (req, res) => {
  try {
    let q = req.query.q;
    let query = {};

    if (q) {
      const q_normalized = q.trim().toLowerCase();
      if (["football", "volleyball", "basketball"].includes(q_normalized)) {
        query.sport = q_normalized;
      } else {
        query.$or = [
          { name: { $regex: q_normalized, $options: "i" } },
          { sport: { $regex: q_normalized, $options: "i" } },
          { address: { $regex: q_normalized, $options: "i" } },
        ];
      }
    }
    const fields = await Field.find(query);
    return res.status(200).json(fields);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const getFieldDetails = async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    return res.status(200).json(field);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const getFieldAvailability = async (req, res) => {
  try {
    let dateToCheck = req.query.date;
    let slotsAvailable = [];

    if (dateToCheck) {
      const fieldToCheck = await Field.findById(req.params.id);
      const slotsAvailable = await getAvailableSlots(
        req.params.id,
        dateToCheck,
      );
      return res.status(200).json(slotsAvailable);
    } else {
      return res
        .status(400)
        .json({ msg: "Missing required query parameter: date => YYYY-MM-DD" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const getAvailableSlots = async (fieldId, date) => {
  const field = await Field.findById(fieldId);
  const available = [];

  for (const slot of field.slots) {
    const booking = await Booking.findOne({ fieldId, date, slot });
    if (!booking) {
      available.push(slot);
    }
  }

  return available;
};

const getFieldBooking = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(400).json({ msg: "User not registered yet" });
    }

    const bookings = await Booking.find({ userId: req.userId });

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const createFieldBooking = async (req, res) => {
  try {
    const { date, slot } = req.body;
    const slotsAvailable = await getAvailableSlots(req.params.id, date);
    if (!slotsAvailable.includes(slot)) {
      return res.status(409).json({ msg: "Slot already booked or time slot malformed" });
    } else {
      const booking = await Booking.create({
        fieldId: req.params.id,
        userId: req.userId,
        date,
        slot,
      });
      return res.status(201).json({ msg: "Booking successfull" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const cancelFieldBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.userId;
    const booking = await Booking.findOne({ _id: bookingId });

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    if (booking.fieldId !== req.params.id) {
      return res
        .status(400)
        .json({ msg: "Booking does not belong to this field" });
    }

    if (userId === booking.userId) {
      await Booking.findByIdAndDelete(bookingId);
      return res.status(202).json({ msg: "Deletion of booking successfull" });
    }
    return res
      .status(403)
      .json({ msg: "Tried to delete a booking made by another user" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

module.exports = {
  fieldQuery,
  getFieldDetails,
  getFieldAvailability,
  getFieldBooking,
  createFieldBooking,
  cancelFieldBooking,
};
