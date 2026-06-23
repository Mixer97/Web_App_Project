const express = require("express");
const { userSignup, userSignin, userSignout } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.post("/signout", userSignout);

module.exports = router;
