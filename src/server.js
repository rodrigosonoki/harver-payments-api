const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");

require("dotenv/config");

const cartRoute = require("./app/routes/cart");
const authRoute = require("./app/routes/customer");
const transactionRoute = require("./app/routes/transaction");

const app = express();

app.use(
  session({
    secret: "harver",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cors());
app.use(express.json());

//CONNECT TO DB
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => console.log(`Connected to MongoDB on ${process.env.ENV} environment.`)
);

app.use("/cart", cartRoute);
app.use("/customer", authRoute);
app.use("/transaction", transactionRoute);

app.listen(3333, () => console.log("Server is running..."));
