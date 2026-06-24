const express = require("express");
const { userQuery, getUserDetails } = require("../controllers/user.controller");

const router = express.Router();

router.get("/", userQuery);
router.get("/:id", getUserDetails);

module.exports = router;
