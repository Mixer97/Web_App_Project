require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");

const { userWhoAmI } = require("./controllers/auth.controller");
const { verifyToken } = require("./middleware/auth");

const authRoutes = require("./routes/auth.route");
const fieldRoutes = require("./routes/field.route");
const tournamentRoutes = require("./routes/tournament.route");
const matchRoutes = require("./routes/match.route");

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/matches", matchRoutes);

// base test
app.get("/", (req, res) => {
  res.send("Hello from Node API Server");
});

// whoamI functionality
app.get("/api/whoami", verifyToken, userWhoAmI);

// connect to DB before connecting to app
connectDB(app);
