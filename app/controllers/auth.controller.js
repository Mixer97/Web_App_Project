const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSignup = async (req, res) => {
  try {
    const { username, password, name, surname, email } = req.body;
    const user = await User.findOne({ username });
    console.log(user);
    if (user) {
      return res.status(409).json({ msg: "Username already existing" });
    } else {
      const lastUser = await User.findOne({}, { sort: { id: -1 } });
      let id = lastUser?.id !== undefined ? lastUser.id : -1;
      id++;
      const hashed = await bcrypt.hash(password, 10);
      const newUser = { username, password: hashed, name, surname, email };
      await User.create(newUser);
      return res.status(201).json({ msg: "User created successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const userSignin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log(user);
    if (
      user &&
      (await bcrypt.compare(password, user.password)) &&
      user.username === username
    ) {
      const data = { id: user.id };
      const token = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: 86400, // 24 hours
      });
      res.cookie("token", token, { httpOnly: true });
      return res.json({ msg: "Authentication successfull" });
    } else {
      return res.status(401).json({ msg: "Wrong Username or password" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Invalid credentials" });
  }
};

const userWhoAmI = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(400).json({ msg: "User not registered yet" });
    }

    const user = await User.findById(req.userId).select("-password");

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

module.exports = {
  userSignup,
  userSignin,
  userWhoAmI,
};
