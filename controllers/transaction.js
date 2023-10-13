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

// Get all transactions by month and year
const GetAllTransactionByFilter = async (month, year) => {
  try {
    let matchStage = {}; // Match stage for aggregation pipeline

    // if month & year both provided
    if (month && year) {
      matchStage = { month: month, year: year };
    }
    // If month is provided, filter by that month
    if (month) {
      matchStage = { month: month };
    }
    return await Transaction.find(matchStage);
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
  GetAllTransactionByFilter,
  DeleteTransactionByID,
};
