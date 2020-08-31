const Customer = require("../models/Customer");
const Cart = require("../models/Cart");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  //CHECK IF EMAIL ALREADY EXISTS
  const isRegistered = await Customer.findOne({
    email,
  });

  if (isRegistered)
    return res.status(400).json({ msg: "E-mail já cadastrado." });

  //HASH PASSWORD
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);

  //CREATE TOKEN FOR VERIFICATION
  const token = crypto.randomBytes(20).toString("hex");

  try {
    //CREATE & SAVE NEW CUSTOMER
    const customer = await new Customer({
      email,
      verificationToken: token,
      password: encryptedPassword,
    });
    await customer.save();
    return res.status(200).json({ msg: "Conta criada com sucesso!" });
  } catch (err) {
    return res.status(400).json({ err });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  //FIND USER
  const customer = await Customer.findOne({ email });

  //HANDLE ERROR: CUSTOMER NOT FOUND
  if (!customer)
    return res.status(400).json({ msg: "Usuário não encontrado." });

  //COMPARE PASSWORD
  const isPasswordValid = await bcrypt.compare(password, customer.password);

  //IF CUSTOMER NOT FOUND OR INVALID PASSWORD RETURN GENERIC ERROR MESSAGE
  if (!customer || !isPasswordValid)
    return res.status(400).json({ msg: "Credenciais inválidas." });

  const token = jwt.sign(
    {
      email: customer.email,
      id: customer._id,
    },
    process.env.SECRET_TOKEN
  );

  var cart = await Cart.findOne(
    {
      customer: customer._id,
      isActive: true,
    },
    {
      customer: 0,
    }
  );

  var currentCart = await Cart.findOne({
    session: req.sessionID,
  });

  if (!currentCart || currentCart.skus.length == 0) {
    return res.header("auth-token", token).json({ token, cart });
  }

  if (!cart) {
    currentCart.customer = customer._id;
    currentCart.save();
    return res.header("auth-token", token).json({ token, cart: currentCart });
  }

  if (currentCart) {
    currentCart.customer = customer._id;
    cart.isActive = false;
    currentCart.save();
    cart.save();
    return res.header("auth-token", token).json({ token, cart: currentCart });
  }
};
