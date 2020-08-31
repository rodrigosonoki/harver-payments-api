const mongoose = require("mongoose");

const cartsSchema = new mongoose.Schema(
  {
    skus: [
      {
        _id: false,
        sku: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sku",
        },
        qty: Number,
      },
    ],
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    session: "String",
  },
  { collection: "carts" }
);

module.exports = mongoose.model("Cart", cartsSchema);
