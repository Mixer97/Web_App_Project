const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      default: 0,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      default: 0,
    },

    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;