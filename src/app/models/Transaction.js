const mongoose = require("mongoose");
const Sku = require("./Sku");
const Product = require("./Product");

const transactionsSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
    },
    status: {
      type: "String",
    },
    acquirerId: {
      type: Number,
    },
    paymentMethod: {
      type: "String",
    },
    installments: {
      type: Number,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    shipping: {
      name: String,
      fee: Number,
      address: {
        country: String,
        state: String,
        city: String,
        neighborhood: String,
        street: String,
        streetNumber: String,
        zipcode: String,
      },
    },
    products: [
      {
        _id: false,
        sku: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sku",
        },
        qty: Number,
        price: Number,
      },
    ],
  },
  { collection: "transactions" }
);

module.exports = mongoose.model("Transaction", transactionsSchema);
