const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      required: true,
    },
    images: [
      {
        type: "String",
      },
    ],
    description: "String",
    price: {
      type: Number,
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  { collection: "products" }
);

module.exports = mongoose.model("Product", productSchema);
