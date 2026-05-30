const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model");
const app = express();
const productRoutes = require("./routes/product.route");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/products", productRoutes);



app.get("/", (req, res) => {
  res.send("Hello from Node API Server");
});



// connecting to database before connecting to app
mongoose
  .connect(
    "mongodb://mongo:27017/mongo-database",
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
