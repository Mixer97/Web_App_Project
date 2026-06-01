require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// connecting to database before connecting to app
const connect = async (app) => {
mongoose
  .connect(
    process.env.MONGO_URL,
  )
  .then(() => {
    console.log("Connected to database succesfully");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch(() => {
    console.log("Connection to database failed");
  });
};

  module.exports = connect;