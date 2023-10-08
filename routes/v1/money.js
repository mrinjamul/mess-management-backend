var express = require("express");
var router = express.Router();

const constants = require("../../constants");

const authenticated = require("../../middlewares/authenticated");
const adminAuthenticated = require("../../middlewares/adminAuthenticated");

const { AddMoney, SpendMoney } = require("../../controllers/money");

const utils = require("../../helpers/utils");

// Add money to the mess
router.post("/add", adminAuthenticated, async (req, res, next) => {
  // get transaction details
  var tnx = req.body;
  const { isCash, sender, recipient, amount, desciption } = tnx;
  if (!sender) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "bad request",
      message: "Sender field is missing",
      data: {},
    });
    return;
  }
  if (!recipient) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "bad request",
      message: "Recipient field is missing",
      data: {},
    });
    return;
  }
  if (!amount) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "bad request",
      message: "Amount field is missing",
      data: {},
    });
    return;
  }

  // Create a transaction
  const tx = await AddMoney(tnx);

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "Money added successfully",
    data: tx,
  });
});

// Spend money from the mess
router.post("/spend", adminAuthenticated, async (req, res, next) => {
  // get transaction details
  var tnx = req.body;
  const { isCash, sender, recipient, amount, item, quantity } = tnx;
  if (!sender) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "bad request",
      message: "Sender field is missing",
      data: {},
    });
    return;
  }
  if (!recipient) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "bad request",
      message: "Recipient field is missing",
      data: {},
    });
    return;
  }
  if (!amount) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "bad request",
      message: "Amount field is missing",
      data: {},
    });
    return;
  }

  // Create a transaction
  const tx = await SpendMoney(tnx);

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "Money send to " + recipient + " successfully",
    data: tx,
  });
});

module.exports = router;
