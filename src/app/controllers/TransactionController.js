const Transaction = require("../models/Transaction");
const Cart = require("../models/Cart");

const axios = require("axios");

exports.create = async (req, res) => {
  const {
    payment_method: paymentMethod,
    billing,
    shipping,
    installments,
  } = req.body;
  const { customer } = req.customer;

  const cart = await Cart.findOne({
    customer: req.customer.id,
    isActive: true,
  })
    .populate({
      path: "skus.sku",
      populate: {
        path: "product",
      },
    })
    .exec();

  const totalAmount = () => {
    const total = cart.skus.map((sku) => {
      return sku.qty * sku.sku.product.price;
    });
    const totalAmount = total.reduce((a, b) => a + b, 0);
    return totalAmount;
  };

  const orderItems = () => {
    const cartItems = cart.skus.map((sku) => {
      var obj = {
        id: sku.sku._id,
        title: sku.sku.product.name,
        unit_price: sku.sku.product.price,
        quantity: sku.qty,
        tangible: "true",
      };
      return obj;
    });
    return cartItems;
  };

  const listProducts = () => {
    const cartItems = cart.skus.map((i) => {
      var obj = {
        sku: i.sku._id,
        qty: i.qty,
        price: i.sku.product.price,
      };
      return obj;
    });
    return cartItems;
  };

  const products = listProducts();

  const items = orderItems();

  const amount = totalAmount() + shipping.fee;

  const transaction = await new Transaction({
    amount,
    status: "Created",
    paymentMethod,
    installments,
    customer,
    shipping,
    products,
  });

  req.body.amount = amount;
  req.body.api_key = process.env.API_KEY;

  try {
    await axios.post("https://api.pagar.me/1/transactions", req.body);
    cart.isActive = false;
    cart.save();
    transaction.save();
    return res.status(200).json({ transaction });
  } catch (err) {
    return res.status(400).json({ err });
  }
};
