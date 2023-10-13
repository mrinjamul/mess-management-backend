const mongoose = require("mongoose");

const timestampPlugin = require("./plugins/timestamp");

const BillSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    lowercase: true,
  },
  year: {
    type: String,
    required: true,
  },
  moneyReceived: {
    type: Number,
    required: true,
  },
  moneySpent: {
    type: Number,
    required: true,
  },
  moneySpentOnCredit: {
    type: Number,
    required: true,
  },
  moneyAvailable: {
    type: Number,
    required: true,
  },
  moneyRequired: {
    type: Number,
    required: true,
  },
  totalMoneySpent: {
    type: Number,
    required: true,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
  usersBill: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      moneyAdvance: {
        type: Number,
        required: true,
      },
      totalPayable: {
        type: Number,
        required: true,
      },
      moneyDue: {
        type: Number,
        required: true,
      },
      duration: {
        type: String,
        required: true,
      },
    },
  ],
});

BillSchema.plugin(timestampPlugin);

const Bill = mongoose.model("Bill", BillSchema);

module.exports = Bill;
