const mongoose = require("mongoose");

const timestampPlugin = require("./plugins/timestamp");

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    lowercase: true,
  },
  method: {
    type: String,
    required: true,
    lowercase: true,
  },
  sender: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  item: {
    type: String,
  },
  quantity: {
    type: String,
    lowercase: true,
  },
  month: {
    type: String,
    lowercase: true,
  },
  year: {
    type: String,
    lowercase: true,
  },
});

TransactionSchema.plugin(timestampPlugin);

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
