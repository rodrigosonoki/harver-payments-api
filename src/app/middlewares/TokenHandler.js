const jwt = require("jsonwebtoken");

//MIDDLEWARE TO VALIDATE TOKEN
exports.validateToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.SECRET_TOKEN);
    req.customer = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Token inválido" });
  }
};

exports.checkIfCustomer = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    try {
      req.customer = "";
      next();
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET_TOKEN);
    req.customer = verified;
    next();
  } catch (err) {}
};
