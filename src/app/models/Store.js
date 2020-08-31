const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      default: "Minha loja",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    createdAt: {
      type: Date,
      default: new Date(),
    },
    address: {
      country: "String",
      state: "String",
      city: "String",
      neighborhood: "String",
      street: "String",
      streetNumber: "String",
      zipcode: "string",
    },
    bank: {
      name: "String",
      type: "String",
      agency: "String",
      account: "String",
      digit: "String",
    },
  },
  { collection: "stores" }
);

module.exports = mongoose.model("Store", storeSchema);
