const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/user.model");
const Field = require("../models/field.model");
const { verifyToken } = require("../middleware/auth");
const { fieldQuery } = require("../controllers/field.controller");

const router = express.Router();

router.get("/", fieldQuery);

module.exports = router;