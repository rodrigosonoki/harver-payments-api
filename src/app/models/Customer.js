const mongoose = require("mongoose");

const customersSchema = new mongoose.Schema(
  {
    email: {
      type: "String",
    },
    name: {
      type: "String",
    },
    password: {
      type: "String",
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1024,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    documents: [
      {
        type: {
          type: "String",
        },
        number: {
          type: "String",
        },
      },
    ],
    phoneNumber: {
      type: "String",
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  { collection: "customers" }
);

module.exports = mongoose.model("Customer", customersSchema);
