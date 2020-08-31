const router = require("express").Router();

const CustomerController = require("../controllers/CustomerController");

router.post("/register", CustomerController.signin);
router.post("/login", CustomerController.login);

module.exports = router;
