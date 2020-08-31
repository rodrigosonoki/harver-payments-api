const Cart = require("../models/Cart");

//UTILS
const { sum } = require("../utils");

exports.add = async (req, res) => {
  const { skus } = req.body;

  if (req.customer === "") {
    const cart = await Cart.findOne({
      session: req.sessionID,
    });

    if (!cart) {
      const newCart = await new Cart({
        session: req.sessionID,
        skus,
      });
      newCart.save();
      return res.status(200).json({ cart: newCart.skus });
    } else {
      try {
        const cartSkus = await sum(skus, cart.skus);
        cart.skus = cartSkus;
        cart.save();
        return res.status(200).json({ cart: cart.skus });
      } catch (err) {
        return res.status(400).json(err);
      }
    }
  } else {
    const cart = await Cart.findOne(
      {
        customer: req.customer.id,
        isActive: true,
      },
      {
        customer: 0,
      }
    );

    if (!cart) {
      const newCart = await new Cart({
        session: req.sessionID,
        skus,
        customer: req.customer.id,
      });
      newCart.save();
      return res.status(200).json({ cart: newCart.skus });
    } else {
      const cartSkus = await sum(skus, cart.skus);
      cart.skus = cartSkus;

      cart.save();
      return res.status(200).json({ cart: cart.skus });
    }
  }
};

exports.get = async (req, res) => {
  if (req.customer === "") {
    const cart = await Cart.findOne({
      session: req.sessionID,
    });
    return res.status(200).json({ cart });
  }

  const cart = await Cart.findOne({
    customer: req.customer.id,
    isActive: true,
  });

  return res.status(200).json({ cart });
};

exports.remove = async (req, res) => {
  const { sku } = req.body;

  if (req.customer === "") {
    const cart = await Cart.findOne({
      session: req.sessionID,
    });

    if (!cart) {
      return res.status(200).json({ cart: null });
    } else {
      try {
        //REMOVE REQ.BODY.SKU FROM CART.SKUS
        const skus = cart.skus.filter(function (obj) {
          return obj.sku != sku;
        });

        cart.skus = skus;

        cart.save();
        return res.status(200).json({ cart });
      } catch (err) {
        return res.status(400).json(err);
      }
    }
  } else {
    const cart = await Cart.findOne(
      {
        customer: req.customer.id,
        isActive: true,
      },
      {
        customer: 0,
      }
    );

    if (!cart) {
      return res.status(200).json({ cart: null });
    } else {
      //REMOVE REQ.BODY.SKU FROM CART.SKUS
      const skus = cart.skus.filter(function (obj) {
        return obj.sku != sku;
      });

      cart.skus = skus;

      cart.save();
      return res.status(200).json({ cart });
    }
  }
};
