const Cart = require("../models/Cart");

//UTILS
const { sum } = require("../utils");

exports.add = async (req, res) => {
  const { skus } = req.body;
  const { sessionID: session } = req;

  const getCart = async () => {
    if (req.customer) {
      const cart = await Cart.findOne(
        {
          customer: req.customer.id,
          isActive: true,
        },
        {
          customer: 0,
        }
      );
      return cart;
    }

    const cart = await Cart.findOne({
      session: req.sessionID,
    });
    return cart;
  };

  const createCart = async () => {
    if (req.customer) {
      const newCart = await new Cart({
        session,
        skus,
        customer: req.customer.id,
      });
      return newCart;
    }

    const newCart = await new Cart({
      session: req.sessionID,
      skus,
    });
    return newCart;
  };

  const cart = await getCart();

  if (!cart) {
    const newCart = await createCart();
    newCart.save();
    return res.status(200).json({ cart: newCart.skus });
  }

  const cartSkus = await sum(skus, cart.skus);
  cart.skus = cartSkus;
  cart.save();
  return res.status(200).json({ cart: cart.skus });
};

exports.get = async (req, res) => {
  const getCart = async () => {
    if (req.customer) {
      const cart = await Cart.findOne({
        customer: req.customer.id,
        isActive: true,
      });
      return cart;
    }

    const cart = await Cart.findOne({
      session: req.sessionID,
    });
    return cart;
  };

  const cart = await getCart();
  return res.status(200).json({ cart });
};

exports.remove = async (req, res) => {
  const { sku } = req.body;

  const filterProduct = (arr) => {
    const skus = arr.filter(function (obj) {
      return obj.sku != sku;
    });

    return skus;
  };

  const getCart = async () => {
    if (req.customer) {
      const cart = await Cart.findOne(
        {
          customer: req.customer.id,
          isActive: true,
        },
        {
          customer: 0,
        }
      );
      return cart;
    }

    const cart = await Cart.findOne({
      session: req.sessionID,
    });
    return cart;
  };

  const cart = await getCart();

  if (!cart) return res.status(200).json({ cart: null });

  const skus = filterProduct(cart.skus);
  cart.skus = skus;
  cart.save();

  return res.status(200).json({ cart });
};
