const mongoose = require("mongoose");
require("./Store");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        sku: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sku",
        },
        price: Number,
        qty: Number,
      },
    ],
    createdAt: {
      type: Date,
      default: new Date(),
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
    status: String,
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    paymentMethod: String,
  },
  { collection: "orders" }
);

module.exports = mongoose.model("Order", orderSchema);
