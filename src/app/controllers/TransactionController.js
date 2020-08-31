const Transaction = require("../models/Transaction");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Sku = require("../models/Sku");

const axios = require("axios");

exports.create = async (req, res) => {
  const { payment_method: paymentMethod, shipping, installments } = req.body;
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

  if (!cart) return res.status(400).json({ msg: "Carrinho inválido" });

  const totalAmount = () => {
    const total = cart.skus.map((sku) => {
      return sku.qty * sku.sku.product.price;
    });
    const totalAmount = total.reduce((a, b) => a + b, 0);
    return totalAmount;
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

  const amount = totalAmount() + shipping.fee;

  const transaction = await new Transaction({
    amount,
    status: "created",
    paymentMethod,
    installments,
    customer,
    shipping,
    products,
  });

  transaction.save();

  req.body.amount = amount;
  req.body.api_key = process.env.API_KEY;

  const placeOrder = async () => {
    const skus = transaction.products.map((i) => {
      return i.sku;
    });

    const i = await Sku.find(
      {
        _id: {
          $in: skus,
        },
      },
      {
        size: 0,
        __v: 0,
      }
    )
      .populate({
        path: "product",
        select: "-images -createdAt -name -description -__v",
      })
      .exec();

    const j = Object.entries(
      i.reduce((r, a) => {
        r[a.product.store] = [...(r[a.product.store] || []), a];
        return r;
      }, {})
    );

    const a = j.map((i) => {
      var obj = { store: i[0], products: i[1] };
      return obj;
    });

    a.map((item) => {
      item.products.map((i) => {
        const a = transaction.products.find(
          (el) => el.sku.toString() == i._id.toString()
        );
        i.price = a.price;
      });
    });

    const createOrder = (i) => {
      const order = new Order({
        products: i.products,
        store: i.store,
        transaction: transaction._id,
        status: "created",
        paymentMethod: transaction.paymentMethod,
      });
      order.save();
    };

    a.forEach(createOrder);
  };

  placeOrder();

  try {
    const request = await axios.post(
      "https://api.pagar.me/1/transactions",
      req.body
    );
    cart.isActive = false;
    transaction.status = request.data.status;
    await Order.updateMany(
      {
        transaction: transaction._id,
      },
      { $set: { status: request.data.status } }
    );

    cart.save();
    transaction.save();
    return res.status(200).json({ transaction });
  } catch (err) {
    transaction.status = "failed";
    await Order.updateMany(
      {
        transaction: transaction._id,
      },
      { $set: { status: "failed" } }
    );
    return res.status(400).json({ err });
  }
};
