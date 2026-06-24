require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");
// const cors = require("cors"); THIS WAS USED DURING DEVELOPMENT TO USE 2 SERVERS AND ONLY RESTART THE ONE THAT WAS CHANGED, BUT NOW WE USE A SINGLE SERVER FOR BOTH FRONT-END AND BACK-END, SO IT IS NOT NEEDED ANYMORE

const { userWhoAmI } = require("./controllers/auth.controller");
const { verifyToken } = require("./middleware/auth");

const authRoutes = require("./routes/auth.route");
const fieldRoutes = require("./routes/field.route");
const tournamentRoutes = require("./routes/tournament.route");
const matchRoutes = require("./routes/match.route");
const userRoutes = require("./routes/user.route");

const app = express();

// middleware
app.use(express.static(path.join(__dirname, "build")));
// app.use(cors({ origin: "http://localhost:5001", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/users", userRoutes);

// connection between back-end and front-end
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// whoamI functionality
app.get("/api/whoami", verifyToken, userWhoAmI);

// connect to DB before connecting to app
connectDB(app);
