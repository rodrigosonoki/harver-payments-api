const router = require("express").Router();

const TokenHandler = require("../middlewares/TokenHandler");
const CartController = require("../controllers/CartController");

router.post("/add", TokenHandler.checkIfCustomer, CartController.add);
router.get("/get", TokenHandler.checkIfCustomer, CartController.get);
router.post("/remove", TokenHandler.checkIfCustomer, CartController.remove);

module.exports = router;
