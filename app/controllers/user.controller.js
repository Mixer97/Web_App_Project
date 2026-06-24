const User = require("../models/user.model");
const Tournament = require("../models/tournament.model");

const userQuery = async (req, res) => {
  try {
    let q = req.query.q;
    let query = {};

    if (q) {
      const q_normalized = q.trim().toLowerCase();
      query.$or = [
        { username: { $regex: q_normalized, $options: "i" } },
        { name: { $regex: q_normalized, $options: "i" } },
        { surname: { $regex: q_normalized, $options: "i" } },
      ];
    }
    const users = await User.find(query).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const user = await User.findById(targetUserId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const tournaments = await Tournament.find({ creatorId: req.params.id });

    res.status(200).json({ user, tournaments });
  } catch (error) {
    res.status(500).json({ message: "Internal Error" });
  }
};

module.exports = {
  userQuery,
  getUserDetails,
};
