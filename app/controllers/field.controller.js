const Field = require("../models/field.model");

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
    res.status(500).json({ msg: "Internal Error" });
  }
};

module.exports = {
  fieldQuery,
};
