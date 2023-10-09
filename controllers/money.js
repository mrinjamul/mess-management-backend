const Transaction = require("../models/Transaction");
const { CreateTransaction } = require("./transaction");
const { GetUserByMobile, UpdateUserByMobile } = require("./users");

// AddMoney: add money to the mess
const AddMoney = async (tnx) => {
  try {
    // const type = tnx.isSpend ? "out" : "in";
    const type = "in";
    const method = tnx.isCash ? "cash" : "due";
    var tx = {
      type: type,
      method: method,
      sender: tnx.sender,
      recipient: "admin",
      amount: tnx.amount,
      description: tnx.description,
    };

    const updatedTx = await CreateTransaction(tx);

    var user = {};

    if (method == "cash") {
      try {
        // get user info
        user = await GetUserByMobile(tnx.sender);
        // Add money to user's advance
        user = await UpdateUserByMobile(tnx.sender, {
          advance: user.advance + tnx.amount,
        });
      } catch (error) {
        console.log(error);
      }
    }

    return updatedTx;
  } catch (error) {
    console.log(error);
  }
};
// SpendMoney: spend money from the mess
const SpendMoney = async (tnx) => {
  try {
    const type = "out";
    const method = tnx.isCash ? "cash" : "due";
    var tx = {
      type: type,
      method: method,
      sender: "admin",
      recipient: tnx.recipient,
      amount: tnx.amount,
      // description: tnx.description,
      item: tnx.item,
      quantity: tnx.quantity,
    };
    if (tnx.description) {
      tx.description = tnx.description;
    }

    return await CreateTransaction(tx);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  AddMoney,
  SpendMoney,
};
