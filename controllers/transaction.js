const Transaction = require("../models/Transaction");

// Create a transaction
const CreateTransaction = async (transaction) => {
  try {
    const tx = new Transaction(transaction);
    // put json on db
    return await tx.save();
  } catch (error) {
    console.log(error);
  }
};

// Get a transaction
const GetTransactionByID = async (id) => {
  try {
    return await Transaction.findById(id);
  } catch (error) {
    console.log(error);
  }
};

// Get all transactions
const GetAllTransaction = async () => {
  try {
    return await Transaction.find().lean();
  } catch (error) {
    console.log(error);
  }
};

// Delete a Transaction
const DeleteTransactionByID = async (id) => {
  try {
    return await Transaction.findByIdAndRemove(id);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  CreateTransaction,
  GetTransactionByID,
  GetAllTransaction,
  DeleteTransactionByID,
};
