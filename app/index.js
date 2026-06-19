require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");
const cors = require("cors");

const { userWhoAmI } = require("./controllers/auth.controller");
const { verifyToken } = require("./middleware/auth");

const authRoutes = require("./routes/auth.route");
const fieldRoutes = require("./routes/field.route");
const tournamentRoutes = require("./routes/tournament.route");
const matchRoutes = require("./routes/match.route");
const userRoutes = require("./routes/user.route");

const app = express();


/*
app.use(cors({
  origin:["http://localhost:5001"],
  methods:["GET", "POST", "DELETE", "PUT"],
  credentials: true
}))
*/

// middleware
app.use(cors({origin: "http://localhost:5001", credentials: true}));
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

// base test
app.get("/", (req, res) => {
  res.send("Hello from Node API Server");
});

// whoamI functionality
app.get("/api/whoami", verifyToken, userWhoAmI);

// connect to DB before connecting to app
connectDB(app);
