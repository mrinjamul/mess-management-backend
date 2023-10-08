const Transaction = require("../models/Transaction");
const { CreateTransaction } = require("./transaction");

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
      recipient: tnx.recipient,
      amount: tnx.amount,
      description: tnx.description,
    };
    return await CreateTransaction(tx);
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
      sender: tnx.sender,
      recipient: tnx.recipient,
      amount: tnx.amount,
      // description: tnx.description,
      item: tnx.item,
      quantity: tnx.quantity,
    };
    return await CreateTransaction(tx);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  AddMoney,
  SpendMoney,
};
