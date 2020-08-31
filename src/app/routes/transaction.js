const router = require("express").Router();
const TokenHandler = require("../middlewares/TokenHandler");

const TransactionController = require("../controllers/TransactionController");

router.post(
  "/create",
  TokenHandler.validateToken,
  TransactionController.create
);

module.exports = router;
