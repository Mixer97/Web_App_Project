require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");
const userRoutes = require("./routes/test-product.route");
const authRoutes = require("./routes/auth.route");

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);

// base test
app.get("/", (req, res) => {
  res.send("Hello from Node API Server");
});

// connect to DB before connecting to app
connectDB(app)
