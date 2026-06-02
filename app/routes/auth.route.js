const express = require("express");
const User = require("../models/user.model");
const { userSignup, userSignin } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", userSignup);
router.post("/signin", userSignin);

module.exports = router;
