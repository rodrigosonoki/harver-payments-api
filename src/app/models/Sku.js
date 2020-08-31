const mongoose = require("mongoose");

const skuSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    size: {
      type: "String",
      required: true,
    },
  },
  { collection: "skus" }
);

module.exports = mongoose.model("Sku", skuSchema);
